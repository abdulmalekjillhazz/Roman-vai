import mongoose from 'mongoose';
import { randomUUID } from 'crypto';
import { Product } from '../models/Product.js';
import { ensureDBConnected } from '../config/db.js';
import { isCloudinaryConfigured, uploadBufferToCloudinary } from '../config/cloudinary.js';
import { requireCatalogDatabase } from '../middlewares/requireCatalogDatabase.js';
import { productAssets, parseBoolean, parseImageUrls } from '../utils/catalogAssets.js';
import { loadFallbackCatalog as loadFallbackJson, removeCloudinaryImages } from '../services/catalogAssets.js';
import { inputError, textField } from '../utils/validation.js';

function parseList(value) {
  if (value !== undefined && !Array.isArray(value) && typeof value !== 'string') throw inputError('Features must be text or a list of text values.');
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[\n,]/) : [];
  return items.map(item => textField(item, 'Feature')).filter(Boolean);
}
function normalizeSlug(value = '') {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
function productQuery(id) {
  const cleanId = String(id || '').trim();
  const withoutCat = cleanId.replace(/^cat-/, '');
  const withCat = cleanId.startsWith('cat-') ? cleanId : `cat-${cleanId}`;

  const conditions = [
    { id: cleanId },
    { slug: cleanId },
    { id: withCat },
    { slug: withoutCat }
  ];

  if (mongoose.isValidObjectId(cleanId)) {
    conditions.push({ _id: cleanId });
  }

  return { $or: conditions };
}
function productPayload(body, existing) {
  let specs = body.specifications === undefined ? {} : body.specifications;
  if (typeof specs === 'string') {
    try { specs = JSON.parse(specs); } catch { throw inputError('Product specifications must be valid JSON.'); }
  }
  if (!specs || typeof specs !== 'object' || Array.isArray(specs)) throw inputError('Product specifications must be an object.');
  const payload = {};
  for (const key of ['name', 'category', 'categoryName', 'description', 'seoTitle', 'seoDescription', 'thumbnail']) {
    if (body[key] !== undefined) payload[key] = textField(body[key], `Product ${key}`);
  }
  for (const key of ['name', 'category', 'description']) {
    if (!(payload[key] ?? existing?.[key])) throw inputError(`Product ${key} is required.`);
  }
  payload.categoryName = payload.categoryName || existing?.categoryName || payload.category;
  if (body.slug !== undefined || !existing) {
    payload.slug = normalizeSlug(textField(body.slug || payload.name, 'Product slug'));
    if (!payload.slug) throw inputError('Product name must include letters or numbers for its page address.');
  }
  payload.inStock = parseBoolean(body.inStock, existing?.inStock ?? true);
  payload.isFeatured = parseBoolean(body.isFeatured, existing?.isFeatured ?? false);
  payload.specifications = {};
  const defaults = { thickness: 'Standard', dimensions: 'Custom', material: 'Composite' };
  for (const key of ['thickness', 'dimensions', 'material']) {
    payload.specifications[key] = textField(specs[key] ?? body[key] ?? existing?.specifications?.[key] ?? defaults[key], key);
  }
  payload.specifications.features = parseList(specs.features ?? body.features ?? existing?.specifications?.features);
  return payload;
}
async function uploadImages(files, collected) {
  if (files.length > 12) throw inputError('Upload a maximum of 12 images at a time.');
  if (files.length && !isCloudinaryConfigured()) throw Object.assign(new Error('Image upload is unavailable. Configure Cloudinary before uploading files.'), { status: 503 });
  for (const file of files) {
    const uploaded = await uploadBufferToCloudinary(file, 'dst_deco/products');
    if (!uploaded?.secure_url || !uploaded.public_id) throw new Error('An image could not be uploaded. Please try again.');
    collected.push({ public_id: uploaded.public_id, secure_url: uploaded.secure_url, format: uploaded.format });
  }
}
function sendWriteError(res, error, cloudinaryFailures = []) {
  const status = error.code === 11000 ? 409 : error.status || (error.name === 'ValidationError' ? 400 : 500);
  const message = error.code === 11000 ? 'A product with this name or page address already exists. Choose a different name.'
    : status < 500 || process.env.NODE_ENV !== 'production' ? error.message : 'Could not save the product. Please try again.';
  return res.status(status).json({ message, cloudinaryFailures });
}
export async function getCatalogStatus(req, res) {
  let persistenceAvailable = false;
  try { persistenceAvailable = await ensureDBConnected(); } catch { /* Report read-only capabilities. */ }
  return res.json({
    persistenceAvailable,
    uploadsAvailable: isCloudinaryConfigured(),
    message: persistenceAvailable ? 'Changes are saved to MongoDB.' : 'Catalog is read-only. Connect MongoDB to save or delete products and categories.'
  });
}
export async function getProducts(req, res) {
  try {
    const { category, search, featured, limit } = req.query;
    const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 200);
    if ([category, search, featured, limit].some(value => value !== undefined && typeof value !== 'string')) {
      return res.status(400).json({ message: 'Catalog filters must be text values.' });
    }

    if (await ensureDBConnected()) {
      const filter = {};
      if (typeof category === 'string' && category && category !== 'all') {
        filter.category = String(category).trim().slice(0, 100);
      }
      if (featured === 'true') filter.isFeatured = true;
      if (search && typeof search === 'string') {
        const literalSearch = String(search).slice(0, 150).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = [{ name: { $regex: literalSearch, $options: 'i' } }, { description: { $regex: literalSearch, $options: 'i' } }];
      }
      try {
        return res.json(await Product.find(filter).sort({ createdAt: -1 }).limit(Math.floor(safeLimit)));
      } catch (error) {
        console.warn('Product query failed; using the bundled catalog:', error.message);
      }
    }
    let items = loadFallbackJson();
    if (typeof category === 'string' && category && category !== 'all') {
      const cat = category.trim();
      items = items.filter(p => p.category === cat);
    }
    if (featured === 'true') items = items.filter(p => p.isFeatured);
    if (search && typeof search === 'string') {
      const query = String(search).toLowerCase().slice(0, 150);
      items = items.filter(p => p.name.toLowerCase().includes(query) || (p.description || '').toLowerCase().includes(query));
    }
    res.set('X-Data-Source', 'bundled');
    return res.json(items.slice(0, safeLimit));
  } catch (error) {
    console.error('getProducts error:', error.message);
    const message = process.env.NODE_ENV === 'production' ? 'Failed to fetch products.' : error.message;
    return res.status(500).json({ message });
  }
}
export async function getProductBySlug(req, res) {
  try {
    const rawSlug = String(req.params.slug || '').trim().slice(0, 150);
    if (await ensureDBConnected()) {
      try {
        const item = await Product.findOne(productQuery(rawSlug));
        return item ? res.json(item) : res.status(404).json({ message: 'Product not found' });
      } catch (error) {
        console.warn('Product lookup failed; using the bundled catalog:', error.message);
      }
    }
    const cleanSlug = rawSlug.replace(/^cat-/, '');
    const item = loadFallbackJson().find(p => p.slug === rawSlug || p.id === rawSlug || p.slug === cleanSlug || p.id === `cat-${rawSlug}`);
    if (!item) return res.status(404).json({ message: 'Product not found' });
    res.set('X-Data-Source', 'bundled');
    return res.json(item);
  } catch (error) {
    console.error('getProductBySlug error:', error.message);
    const message = process.env.NODE_ENV === 'production' ? 'Failed to fetch product details.' : error.message;
    return res.status(500).json({ message });
  }
}
export async function createProduct(req, res) {
  if (!(await requireCatalogDatabase(req, res))) return;
  const uploaded = [];
  let saved = false;
  try {
    const body = req.body || {};
    const payload = productPayload(body);
    const urls = parseImageUrls(body.imageUrls ?? body.images);
    await uploadImages(req.files || [], uploaded);
    payload.images = [...urls, ...uploaded.map(asset => asset.secure_url)];
    if (payload.thumbnail && payload.images.includes(payload.thumbnail)) {
      payload.images = [payload.thumbnail, ...payload.images.filter(img => img !== payload.thumbnail)];
    } else {
      payload.thumbnail = payload.images[0] || '';
    }
    payload.cloudinaryImages = productAssets({ images: payload.images, cloudinaryImages: uploaded });
    const product = await Product.create({ ...payload, id: `prd-${randomUUID()}` });
    saved = true;
    return res.status(201).json(product);
  } catch (error) {
    return sendWriteError(res, error, saved ? [] : await removeCloudinaryImages(uploaded));
  }
}
export async function updateProduct(req, res) {
  if (!(await requireCatalogDatabase(req, res))) return;
  const uploaded = [];
  let saved = false;
  try {
    const rawId = String(req.params.id || '').trim();
    let existing = await Product.findOne(productQuery(rawId));

    if (!existing) {
      // Self-healing fallback: Check if product exists in local JSON backups
      try {
        const fallbackList = loadFallbackJson();
        const withoutCat = rawId.replace(/^cat-/, '');
        const withCat = rawId.startsWith('cat-') ? rawId : `cat-${rawId}`;
        const fallbackItem = fallbackList.find(p =>
          p.id === rawId ||
          p.slug === rawId ||
          p.id === withCat ||
          p.slug === withoutCat ||
          (p._id && String(p._id) === rawId)
        );

        if (fallbackItem) {
          console.log(`[Catalog] Preparing bundled product "${fallbackItem.name}" for a validated save.`);
          // Validate and apply the requested update before any persistence.
          existing = new Product({
            ...fallbackItem,
            id: fallbackItem.id || `prd-${randomUUID()}`,
            slug: fallbackItem.slug || normalizeSlug(fallbackItem.name)
          });
        }
      } catch (fallbackErr) {
        console.warn('Fallback auto-seed failed:', fallbackErr.message);
      }
    }

    if (!existing) return res.status(404).json({ message: 'Product not found' });
    const body = req.body || {};
    const payload = productPayload(body, existing);
    const hasImages = body.imageUrls !== undefined || body.images !== undefined;
    const urls = hasImages ? parseImageUrls(body.imageUrls ?? body.images) : [...existing.images];
    await uploadImages(req.files || [], uploaded);
    payload.images = [...urls, ...uploaded.map(asset => asset.secure_url)];

    const chosenThumbnail = body.thumbnail !== undefined
      ? payload.thumbnail
      : (hasImages ? payload.images[0] : existing.thumbnail) || payload.images[0] || '';

    if (chosenThumbnail) {
      const normalizedChosen = chosenThumbnail.trim();
      const foundIndex = payload.images.findIndex(img => img.trim() === normalizedChosen);
      if (foundIndex >= 0) {
        const matched = payload.images[foundIndex];
        payload.images = [matched, ...payload.images.filter((_, idx) => idx !== foundIndex)];
        payload.thumbnail = matched;
      } else {
        payload.thumbnail = payload.images[0] || '';
      }
    } else {
      payload.thumbnail = payload.images[0] || '';
    }

    payload.cloudinaryImages = productAssets({ images: payload.images, cloudinaryImages: [...(existing.cloudinaryImages || []), ...uploaded] });
    const updated = existing.isNew
      ? await Object.assign(existing, payload).save()
      : await Product.findOneAndUpdate({ _id: existing._id }, { $set: payload }, { new: true, runValidators: true });
    if (!updated) throw new Error('This product was removed while you were editing. Refresh the catalog.');
    saved = true;

    // Bundled files are immutable outage defaults, not a writable database mirror.
    const retainedIds = new Set(payload.cloudinaryImages.map(asset => asset.public_id));
    const removed = productAssets(existing).filter(asset => !retainedIds.has(asset.public_id));
    const cloudinaryFailures = await removeCloudinaryImages(removed);
    return res.json({ ...updated.toObject(), cloudinaryFailures });
  } catch (error) {
    return sendWriteError(res, error, saved ? [] : await removeCloudinaryImages(uploaded));
  }
}
export async function deleteProduct(req, res) {
  if (!(await requireCatalogDatabase(req, res))) return;
  try {
    const rawId = String(req.params.id || '').trim();
    const product = await Product.findOne(productQuery(rawId));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await Product.deleteOne({ _id: product._id });
    const cloudinaryFailures = await removeCloudinaryImages(productAssets(product));
    return res.json({ message: 'Product deleted', cloudinaryFailures });
  } catch (error) { return sendWriteError(res, error); }
}
