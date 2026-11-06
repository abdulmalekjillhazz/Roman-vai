import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';
import { ensureDBConnected } from '../config/db.js';
import { cloudinary, configureCloudinary, isCloudinaryConfigured, uploadBufferToCloudinary } from '../config/cloudinary.js';
import { requireCatalogDatabase } from '../middlewares/requireCatalogDatabase.js';
import { cleanUnusedAssets, productAssets, parseBoolean, parseImageUrls } from '../utils/catalogAssets.js';

const dataDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../data');
function loadFallbackJson() {
  for (const filename of ['products_cloudinary.json', 'products_data.json']) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dataDirectory, filename), 'utf8'));
      if (Array.isArray(data) && data.length) return data;
    } catch { /* Try the local backup. */ }
  }
  throw new Error('The catalog is temporarily unavailable. Please contact our team.');
}
function parseList(value) {
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[\n,]/) : [];
  return items.map(item => String(item).trim()).filter(Boolean);
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
function syncProductToJsonBackups(updatedProduct) {
  for (const filename of ['products_cloudinary.json', 'products_data.json']) {
    const filePath = path.join(dataDirectory, filename);
    if (!fs.existsSync(filePath)) continue;
    try {
      const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!Array.isArray(list)) continue;
      const idx = list.findIndex(p =>
        p.id === updatedProduct.id ||
        p.slug === updatedProduct.slug ||
        p.id === `cat-${updatedProduct.slug}` ||
        (p._id && updatedProduct._id && String(p._id) === String(updatedProduct._id))
      );
      if (idx >= 0) {
        list[idx] = {
          ...list[idx],
          thumbnail: updatedProduct.thumbnail,
          images: updatedProduct.images,
          name: updatedProduct.name,
          description: updatedProduct.description,
          inStock: updatedProduct.inStock,
          isFeatured: updatedProduct.isFeatured,
          specifications: updatedProduct.specifications
        };
        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
      }
    } catch (err) {
      console.warn(`Failed writing to ${filename}:`, err.message);
    }
  }
}
function productPayload(body, existing) {
  let specs = body.specifications || {};
  if (typeof specs === 'string') {
    try { specs = JSON.parse(specs); } catch { throw new Error('Product specifications must be valid JSON.'); }
  }
  const payload = {};
  for (const key of ['name', 'category', 'categoryName', 'description', 'seoTitle', 'seoDescription', 'thumbnail']) {
    if (body[key] !== undefined) payload[key] = String(body[key]).trim();
  }
  for (const key of ['name', 'category', 'description']) {
    if (!(payload[key] ?? existing?.[key])) throw new Error(`Product ${key} is required.`);
  }
  payload.categoryName = payload.categoryName || existing?.categoryName || payload.category;
  if (body.slug !== undefined || !existing) {
    payload.slug = normalizeSlug(body.slug || payload.name);
    if (!payload.slug) throw new Error('Product name must include letters or numbers for its page address.');
  }
  payload.inStock = parseBoolean(body.inStock, existing?.inStock ?? true);
  payload.isFeatured = parseBoolean(body.isFeatured, existing?.isFeatured ?? false);
  payload.specifications = {};
  for (const key of ['thickness', 'dimensions', 'material']) {
    payload.specifications[key] = String(specs[key] ?? body[key] ?? existing?.specifications?.[key] ?? '').trim();
  }
  payload.specifications.features = parseList(specs.features ?? body.features ?? existing?.specifications?.features);
  return payload;
}
async function removeCloudinaryImages(assets = []) {
  configureCloudinary();
  return cleanUnusedAssets(assets, {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    configured: isCloudinaryConfigured(),
    findReferences: async () => {
      const databaseProducts = await Product.find({}, { images: 1, cloudinaryImages: 1 }).lean();
      // Public static backups must retain working images during API outages.
      const backups = [];
      for (const filename of ['products_cloudinary.json', 'products_data.json']) {
        const filenamePath = path.join(dataDirectory, filename);
        if (fs.existsSync(filenamePath)) backups.push(...JSON.parse(fs.readFileSync(filenamePath, 'utf8')));
      }
      return [...databaseProducts, ...backups];
    },
    destroy: (publicId, options) => cloudinary.uploader.destroy(publicId, options)
  });
}
async function uploadImages(files, collected) {
  if (files.length > 12) throw new Error('Upload a maximum of 12 images at a time.');
  if (files.length && !isCloudinaryConfigured()) throw new Error('Image upload is unavailable. Configure Cloudinary before uploading files.');
  for (const file of files) {
    const uploaded = await uploadBufferToCloudinary(file, 'dst_deco/products');
    if (!uploaded?.secure_url || !uploaded.public_id) throw new Error('An image could not be uploaded. Please try again.');
    collected.push({ public_id: uploaded.public_id, secure_url: uploaded.secure_url, format: uploaded.format });
  }
}
function sendWriteError(res, error, cloudinaryFailures = []) {
  const message = error.code === 11000 ? 'A product with this name or page address already exists. Choose a different name.' : error.message;
  return res.status(error.code === 11000 ? 409 : 400).json({ message, cloudinaryFailures });
}
export async function getCatalogStatus(req, res) {
  const persistenceAvailable = await ensureDBConnected();
  return res.json({
    persistenceAvailable,
    uploadsAvailable: isCloudinaryConfigured(),
    message: persistenceAvailable ? 'Changes are saved to MongoDB.' : 'Catalog is read-only. Connect MongoDB to save or delete products and categories.'
  });
}
export async function getProducts(req, res) {
  try {
    const { category, search, featured } = req.query;
    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (category && category !== 'all') filter.category = category;
      if (featured === 'true') filter.isFeatured = true;
      if (search) {
        const literalSearch = String(search).slice(0, 150).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = [{ name: { $regex: literalSearch, $options: 'i' } }, { description: { $regex: literalSearch, $options: 'i' } }];
      }
      return res.json(await Product.find(filter).sort({ createdAt: -1 }));
    }
    let items = loadFallbackJson();
    if (category && category !== 'all') items = items.filter(p => p.category === category);
    if (featured === 'true') items = items.filter(p => p.isFeatured);
    if (search) {
      const query = String(search).toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(query) || (p.description || '').toLowerCase().includes(query));
    }
    return res.json(items);
  } catch (error) { return res.status(500).json({ message: error.message }); }
}
export async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;
    const item = mongoose.connection.readyState === 1
      ? await Product.findOne({ $or: [{ slug }, { id: slug }] })
      : loadFallbackJson().find(p => p.slug === slug || p.id === slug);
    if (!item) return res.status(404).json({ message: 'Product not found' });
    return res.json(item);
  } catch (error) { return res.status(500).json({ message: error.message }); }
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
    const rawId = decodeURIComponent(String(req.params.id || '')).trim();
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
          console.log(`[Auto-Seed] Product "${fallbackItem.name}" was missing from MongoDB. Auto-inserting now...`);
          existing = await Product.create({
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

    const chosenThumbnail = body.thumbnail !== undefined && String(body.thumbnail).trim()
      ? String(body.thumbnail).trim()
      : (existing.thumbnail || payload.images[0] || '');

    if (chosenThumbnail) {
      const normalizedChosen = chosenThumbnail.trim();
      const foundIndex = payload.images.findIndex(img => img.trim() === normalizedChosen);
      if (foundIndex >= 0) {
        const matched = payload.images[foundIndex];
        payload.images = [matched, ...payload.images.filter((_, idx) => idx !== foundIndex)];
        payload.thumbnail = matched;
      } else {
        payload.images = [normalizedChosen, ...payload.images];
        payload.thumbnail = normalizedChosen;
      }
    } else {
      payload.thumbnail = payload.images[0] || '';
    }

    payload.cloudinaryImages = productAssets({ images: payload.images, cloudinaryImages: [...(existing.cloudinaryImages || []), ...uploaded] });
    const updated = await Product.findOneAndUpdate({ _id: existing._id }, { $set: payload }, { new: true, runValidators: true });
    if (!updated) throw new Error('This product was removed while you were editing. Refresh the catalog.');
    saved = true;

    // Sync to disk static JSON backups so static catalog and fallback are always up-to-date
    try {
      syncProductToJsonBackups(updated.toObject ? updated.toObject() : updated);
    } catch (syncErr) {
      console.warn('Could not sync updated product to local JSON files:', syncErr.message);
    }

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
    const rawId = decodeURIComponent(String(req.params.id || '')).trim();
    const product = await Product.findOne(productQuery(rawId));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await Product.deleteOne({ _id: product._id });
    const cloudinaryFailures = await removeCloudinaryImages(productAssets(product));
    return res.json({ message: 'Product deleted', cloudinaryFailures });
  } catch (error) { return sendWriteError(res, error); }
}
