import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { ensureDBConnected } from '../config/db.js';
import { isCloudinaryConfigured, uploadBufferToCloudinary } from '../config/cloudinary.js';
import { removeCloudinaryImages } from '../services/catalogAssets.js';
import { cloudinaryAssetFromUrl, parseImageUrls } from '../utils/catalogAssets.js';
import { booleanField, inputError, orderField, textField } from '../utils/validation.js';

const normalizeSlug = (input = '') =>
  String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'project';

function buildProjectQuery(id) {
  const cleanId = String(id || '').trim();
  const conditions = [{ slug: cleanId }];
  if (mongoose.isValidObjectId(cleanId)) {
    conditions.unshift({ _id: cleanId });
  }
  return { $or: conditions };
}

function parseList(value, label = 'Item') {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) && typeof value !== 'string') {
    throw inputError(`${label} must be text or a list of text values.`);
  }
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[\n,]/) : [];
  return items.map(item => textField(item, label)).filter(Boolean);
}

function parseBeforeAfterPairs(value) {
  if (value === undefined) return undefined;
  let items = value;
  if (typeof items === 'string') {
    try { items = JSON.parse(items); } catch { throw inputError('Before/after pairs must be a valid JSON array.'); }
  }
  if (!Array.isArray(items)) throw inputError('Before/after pairs must be an array.');
  return items.map(pair => ({
    before: textField(pair.before || '', 'Before image URL'),
    after: textField(pair.after || '', 'After image URL')
  }));
}

async function uploadImages(files, collected) {
  if (files.length > 12) throw inputError('Upload a maximum of 12 images at a time.');
  if (files.length && !isCloudinaryConfigured()) {
    throw Object.assign(new Error('Image upload is unavailable. Configure Cloudinary before uploading files.'), { status: 503 });
  }
  for (const file of files) {
    const uploaded = await uploadBufferToCloudinary(file, 'dst_deco/projects');
    if (!uploaded?.secure_url || !uploaded.public_id) throw new Error('An image could not be uploaded. Please try again.');
    collected.push({ public_id: uploaded.public_id, secure_url: uploaded.secure_url, format: uploaded.format });
  }
}

function projectAssets(project) {
  const stored = project.cloudinaryImages || [];
  const allUrls = [project.coverImage, ...(project.gallery || [])].filter(Boolean);
  return allUrls.flatMap(url => {
    const parsed = cloudinaryAssetFromUrl(url);
    if (!parsed) return [];
    const metadata = stored.find(asset => asset.secure_url === url && asset.public_id === parsed.public_id);
    return [{ ...parsed, ...(metadata?.format ? { format: metadata.format } : {}) }];
  });
}

function sendWriteError(res, error, cloudinaryFailures = []) {
  const status = error.code === 11000 ? 409 : error.status || (error.name === 'ValidationError' ? 400 : 500);
  const message = error.code === 11000 ? 'A project with this title or slug already exists.'
    : status < 500 || process.env.NODE_ENV !== 'production' ? error.message : 'Could not save the project.';
  return res.status(status).json({ message, cloudinaryFailures });
}

function sanitizePublicProject(project) {
  const obj = project.toObject ? project.toObject() : { ...project };
  // Privacy rule: if hasClientConsent is false, ensure locationArea is generalized and no client data is exposed
  if (!obj.hasClientConsent) {
    // Keep locationArea only, anonymized
    delete obj.clientName;
    delete obj.clientEmail;
    delete obj.clientPhone;
    delete obj.streetAddress;
    delete obj.financials;
  }
  return obj;
}

export async function getProjects(req, res) {
  try {
    if (mongoose.connection.readyState !== 1 && !(await ensureDBConnected())) {
      return res.json([]);
    }

    const showAll = req.query.all === 'true' && req.user?.role === 'admin';
    const query = showAll ? {} : { isPublished: true };
    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });

    if (showAll) {
      return res.json(projects);
    }
    return res.json(projects.map(sanitizePublicProject));
  } catch (error) {
    console.error('getProjects error:', error.message);
    return res.status(500).json({ message: 'Failed to load projects.' });
  }
}

export async function getProjectBySlug(req, res) {
  try {
    if (mongoose.connection.readyState !== 1 && !(await ensureDBConnected())) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const project = await Project.findOne(buildProjectQuery(req.params.slug));
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (!project.isPublished && req.user?.role !== 'admin') {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (req.user?.role === 'admin') {
      return res.json(project);
    }
    return res.json(sanitizePublicProject(project));
  } catch (error) {
    console.error('getProjectBySlug error:', error.message);
    return res.status(500).json({ message: 'Failed to load project.' });
  }
}

export async function createProject(req, res) {
  const uploaded = [];
  let saved = false;
  try {
    const body = req.body || {};
    const title = textField(body.title ?? '', 'Project title', { required: true });
    const description = textField(body.description ?? '', 'Project description', { required: true });
    const slug = normalizeSlug(textField(body.slug || title, 'Project slug'));

    const existing = await Project.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: 'A project with this page address already exists.' });
    }

    const urls = parseImageUrls(body.galleryUrls ?? body.gallery);
    await uploadImages(req.files || [], uploaded);
    const gallery = [...urls, ...uploaded.map(asset => asset.secure_url)];
    const coverImage = textField(body.coverImage || gallery[0] || '', 'Cover image');
    const cloudinaryImages = projectAssets({ coverImage, gallery, cloudinaryImages: uploaded });

    // Authenticity guard: if gallery or coverImage set with zero Cloudinary resolution, warn
    const hasCloudinaryUpload = uploaded.length > 0 || cloudinaryImages.length > 0;
    if ((gallery.length > 0 || coverImage) && !hasCloudinaryUpload) {
      console.warn('Project saved with non-Cloudinary image URLs — verify these are not stock photos');
    }

    let completionDate = undefined;
    if (body.completionDate && body.completionDate.trim() !== '') {
      const parsedDate = new Date(body.completionDate);
      if (!isNaN(parsedDate.getTime())) completionDate = parsedDate;
    }

    let order = 0;
    if (body.order !== undefined && body.order !== '') {
      order = orderField(body.order);
    } else {
      const highest = await Project.findOne().sort({ order: -1 }).select('order');
      order = (highest?.order || 0) + 1;
    }

    const payload = {
      slug,
      title,
      description,
      category: body.category !== undefined ? textField(body.category, 'Project category') : '',
      relatedServiceId: mongoose.isValidObjectId(body.relatedServiceId) ? body.relatedServiceId : undefined,
      materialsSupplied: parseList(body.materialsSupplied, 'Materials supplied') || [],
      locationArea: textField(body.locationArea || '', 'Location area'),
      completionDate,
      coverImage,
      gallery,
      beforeAfterPairs: parseBeforeAfterPairs(body.beforeAfterPairs) || [],
      cloudinaryImages,
      seoTitle: body.seoTitle !== undefined ? textField(body.seoTitle, 'SEO title') : '',
      seoDescription: body.seoDescription !== undefined ? textField(body.seoDescription, 'SEO description') : '',
      isPublished: booleanField(body.isPublished, false),
      isFeatured: booleanField(body.isFeatured, false),
      hasClientConsent: booleanField(body.hasClientConsent, false),
      order
    };

    const project = await Project.create(payload);
    saved = true;
    return res.status(201).json(project);
  } catch (error) {
    return sendWriteError(res, error, saved ? [] : await removeCloudinaryImages(uploaded));
  }
}

export async function updateProject(req, res) {
  const uploaded = [];
  let saved = false;
  try {
    const rawId = String(req.params.id || '').trim();
    const existing = await Project.findOne(buildProjectQuery(rawId));
    if (!existing) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const body = req.body || {};
    const payload = {};

    if (body.title !== undefined) payload.title = textField(body.title, 'Project title', { required: true });
    if (body.description !== undefined) payload.description = textField(body.description, 'Project description', { required: true });
    if (body.slug !== undefined) payload.slug = normalizeSlug(textField(body.slug, 'Project slug'));
    if (body.category !== undefined) payload.category = textField(body.category, 'Project category');
    if (body.relatedServiceId !== undefined) {
      payload.relatedServiceId = mongoose.isValidObjectId(body.relatedServiceId) ? body.relatedServiceId : null;
    }
    if (body.materialsSupplied !== undefined) payload.materialsSupplied = parseList(body.materialsSupplied, 'Materials supplied');
    if (body.locationArea !== undefined) payload.locationArea = textField(body.locationArea, 'Location area');
    if (body.completionDate !== undefined) {
      if (!body.completionDate || body.completionDate.trim() === '') {
        payload.completionDate = null;
      } else {
        const parsedDate = new Date(body.completionDate);
        if (!isNaN(parsedDate.getTime())) payload.completionDate = parsedDate;
      }
    }
    if (body.beforeAfterPairs !== undefined) payload.beforeAfterPairs = parseBeforeAfterPairs(body.beforeAfterPairs);
    if (body.seoTitle !== undefined) payload.seoTitle = textField(body.seoTitle, 'SEO title');
    if (body.seoDescription !== undefined) payload.seoDescription = textField(body.seoDescription, 'SEO description');
    if (body.isPublished !== undefined) payload.isPublished = booleanField(body.isPublished);
    if (body.isFeatured !== undefined) payload.isFeatured = booleanField(body.isFeatured);
    if (body.hasClientConsent !== undefined) payload.hasClientConsent = booleanField(body.hasClientConsent);
    if (body.order !== undefined) payload.order = orderField(body.order);

    const hasGallery = body.galleryUrls !== undefined || body.gallery !== undefined;
    const urls = hasGallery ? parseImageUrls(body.galleryUrls ?? body.gallery) : [...(existing.gallery || [])];
    await uploadImages(req.files || [], uploaded);
    payload.gallery = [...urls, ...uploaded.map(asset => asset.secure_url)];
    payload.coverImage = body.coverImage !== undefined
      ? textField(body.coverImage, 'Cover image')
      : (existing.coverImage || payload.gallery[0] || '');

    payload.cloudinaryImages = projectAssets({
      coverImage: payload.coverImage,
      gallery: payload.gallery,
      cloudinaryImages: [...(existing.cloudinaryImages || []), ...uploaded]
    });

    // Authenticity guard:
    const hasCloudinary = uploaded.length > 0 || payload.cloudinaryImages.length > 0;
    if ((payload.gallery.length > 0 || payload.coverImage) && !hasCloudinary) {
      console.warn('Project saved with non-Cloudinary image URLs — verify these are not stock photos');
    }

    const updated = await Project.findByIdAndUpdate(existing._id, { $set: payload }, { new: true, runValidators: true });
    saved = true;

    const retainedIds = new Set(payload.cloudinaryImages.map(asset => asset.public_id));
    const removed = projectAssets(existing).filter(asset => !retainedIds.has(asset.public_id));
    const cloudinaryFailures = await removeCloudinaryImages(removed);

    return res.json({ ...updated.toObject(), cloudinaryFailures });
  } catch (error) {
    return sendWriteError(res, error, saved ? [] : await removeCloudinaryImages(uploaded));
  }
}

export async function deleteProject(req, res) {
  try {
    const rawId = String(req.params.id || '').trim();
    const project = await Project.findOne(buildProjectQuery(rawId));
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    await Project.deleteOne({ _id: project._id });
    const cloudinaryFailures = await removeCloudinaryImages(projectAssets(project));
    return res.json({ message: 'Project deleted successfully.', cloudinaryFailures });
  } catch (error) {
    console.error('deleteProject error:', error.message);
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Failed to delete project.' });
  }
}
