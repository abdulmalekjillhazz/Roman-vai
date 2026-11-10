import mongoose from 'mongoose';
import { Service } from '../models/Service.js';
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
    .replace(/(^-|-$)/g, '') || 'service';

function buildServiceQuery(id) {
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

function parseFaqs(value) {
  if (value === undefined) return undefined;
  let items = value;
  if (typeof items === 'string') {
    try { items = JSON.parse(items); } catch { throw inputError('Service FAQs must be a valid JSON array.'); }
  }
  if (!Array.isArray(items)) throw inputError('Service FAQs must be an array of question and answer pairs.');
  return items.map(item => ({
    question: textField(item.question, 'FAQ question', { required: true }),
    answer: textField(item.answer, 'FAQ answer', { required: true })
  }));
}

async function uploadImages(files, collected) {
  if (files.length > 12) throw inputError('Upload a maximum of 12 images at a time.');
  if (files.length && !isCloudinaryConfigured()) {
    throw Object.assign(new Error('Image upload is unavailable. Configure Cloudinary before uploading files.'), { status: 503 });
  }
  for (const file of files) {
    const uploaded = await uploadBufferToCloudinary(file, 'dst_deco/services');
    if (!uploaded?.secure_url || !uploaded.public_id) throw new Error('An image could not be uploaded. Please try again.');
    collected.push({ public_id: uploaded.public_id, secure_url: uploaded.secure_url, format: uploaded.format });
  }
}

function serviceAssets(service) {
  const stored = service.cloudinaryImages || [];
  return (service.images || []).flatMap(url => {
    const parsed = cloudinaryAssetFromUrl(url);
    if (!parsed) return [];
    const metadata = stored.find(asset => asset.secure_url === url && asset.public_id === parsed.public_id);
    return [{ ...parsed, ...(metadata?.format ? { format: metadata.format } : {}) }];
  });
}

function sendWriteError(res, error, cloudinaryFailures = []) {
  const status = error.code === 11000 ? 409 : error.status || (error.name === 'ValidationError' ? 400 : 500);
  const message = error.code === 11000 ? 'A service with this title or slug already exists.'
    : status < 500 || process.env.NODE_ENV !== 'production' ? error.message : 'Could not save the service.';
  return res.status(status).json({ message, cloudinaryFailures });
}

export async function getServices(req, res) {
  try {
    if (mongoose.connection.readyState !== 1 && !(await ensureDBConnected())) {
      return res.json([]);
    }

    const showAll = req.query.all === 'true' && req.user?.role === 'admin';
    const query = showAll ? {} : { isPublished: true };
    const services = await Service.find(query).sort({ order: 1, createdAt: 1 });
    return res.json(services);
  } catch (error) {
    console.error('getServices error:', error.message);
    return res.status(500).json({ message: 'Failed to load services.' });
  }
}

export async function getServiceBySlug(req, res) {
  try {
    if (mongoose.connection.readyState !== 1 && !(await ensureDBConnected())) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    const service = await Service.findOne(buildServiceQuery(req.params.slug));
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    if (!service.isPublished && req.user?.role !== 'admin') {
      return res.status(404).json({ message: 'Service not found.' });
    }

    return res.json(service);
  } catch (error) {
    console.error('getServiceBySlug error:', error.message);
    return res.status(500).json({ message: 'Failed to load service.' });
  }
}

export async function createService(req, res) {
  const uploaded = [];
  let saved = false;
  try {
    const body = req.body || {};
    const title = textField(body.title ?? '', 'Service title', { required: true });
    const description = textField(body.description ?? '', 'Service description', { required: true });
    const slug = normalizeSlug(textField(body.slug || title, 'Service slug'));

    const existing = await Service.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: 'A service with this page address already exists.' });
    }

    const urls = parseImageUrls(body.imageUrls ?? body.images);
    await uploadImages(req.files || [], uploaded);
    const images = [...urls, ...uploaded.map(asset => asset.secure_url)];
    const cloudinaryImages = serviceAssets({ images, cloudinaryImages: uploaded });

    let order = 0;
    if (body.order !== undefined && body.order !== '') {
      order = orderField(body.order);
    } else {
      const highest = await Service.findOne().sort({ order: -1 }).select('order');
      order = (highest?.order || 0) + 1;
    }

    const payload = {
      slug,
      title,
      description,
      highlights: parseList(body.highlights, 'Highlight') || [],
      images,
      cloudinaryImages,
      serviceAreas: parseList(body.serviceAreas, 'Service area') || [],
      relatedProductIds: parseList(body.relatedProductIds, 'Related product ID') || [],
      faqs: parseFaqs(body.faqs) || [],
      seoTitle: body.seoTitle !== undefined ? textField(body.seoTitle, 'SEO title') : '',
      seoDescription: body.seoDescription !== undefined ? textField(body.seoDescription, 'SEO description') : '',
      isPublished: booleanField(body.isPublished, false),
      isFeatured: booleanField(body.isFeatured, false),
      order
    };

    const service = await Service.create(payload);
    saved = true;
    return res.status(201).json(service);
  } catch (error) {
    return sendWriteError(res, error, saved ? [] : await removeCloudinaryImages(uploaded));
  }
}

export async function updateService(req, res) {
  const uploaded = [];
  let saved = false;
  try {
    const rawId = String(req.params.id || '').trim();
    const existing = await Service.findOne(buildServiceQuery(rawId));
    if (!existing) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    const body = req.body || {};
    const payload = {};

    if (body.title !== undefined) payload.title = textField(body.title, 'Service title', { required: true });
    if (body.description !== undefined) payload.description = textField(body.description, 'Service description', { required: true });
    if (body.slug !== undefined) payload.slug = normalizeSlug(textField(body.slug, 'Service slug'));
    if (body.highlights !== undefined) payload.highlights = parseList(body.highlights, 'Highlight');
    if (body.serviceAreas !== undefined) payload.serviceAreas = parseList(body.serviceAreas, 'Service area');
    if (body.relatedProductIds !== undefined) payload.relatedProductIds = parseList(body.relatedProductIds, 'Related product ID');
    if (body.faqs !== undefined) payload.faqs = parseFaqs(body.faqs);
    if (body.seoTitle !== undefined) payload.seoTitle = textField(body.seoTitle, 'SEO title');
    if (body.seoDescription !== undefined) payload.seoDescription = textField(body.seoDescription, 'SEO description');
    if (body.isPublished !== undefined) payload.isPublished = booleanField(body.isPublished);
    if (body.isFeatured !== undefined) payload.isFeatured = booleanField(body.isFeatured);
    if (body.order !== undefined) payload.order = orderField(body.order);

    const hasImages = body.imageUrls !== undefined || body.images !== undefined;
    const urls = hasImages ? parseImageUrls(body.imageUrls ?? body.images) : [...existing.images];
    await uploadImages(req.files || [], uploaded);
    payload.images = [...urls, ...uploaded.map(asset => asset.secure_url)];
    payload.cloudinaryImages = serviceAssets({
      images: payload.images,
      cloudinaryImages: [...(existing.cloudinaryImages || []), ...uploaded]
    });

    const updated = await Service.findByIdAndUpdate(existing._id, { $set: payload }, { new: true, runValidators: true });
    saved = true;

    const retainedIds = new Set(payload.cloudinaryImages.map(asset => asset.public_id));
    const removed = serviceAssets(existing).filter(asset => !retainedIds.has(asset.public_id));
    const cloudinaryFailures = await removeCloudinaryImages(removed);

    return res.json({ ...updated.toObject(), cloudinaryFailures });
  } catch (error) {
    return sendWriteError(res, error, saved ? [] : await removeCloudinaryImages(uploaded));
  }
}

export async function deleteService(req, res) {
  try {
    const rawId = String(req.params.id || '').trim();
    const service = await Service.findOne(buildServiceQuery(rawId));
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    await Service.deleteOne({ _id: service._id });
    const cloudinaryFailures = await removeCloudinaryImages(serviceAssets(service));
    return res.json({ message: 'Service deleted successfully.', cloudinaryFailures });
  } catch (error) {
    console.error('deleteService error:', error.message);
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Failed to delete service.' });
  }
}
