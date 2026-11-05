import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';
import { uploadBufferToCloudinary } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadFallbackJson() {
  const cloudinaryPath = path.join(__dirname, '../../../data/products_cloudinary.json');
  const defaultPath = path.join(__dirname, '../../../data/products_data.json');
  const target = fs.existsSync(cloudinaryPath) ? cloudinaryPath : defaultPath;
  return JSON.parse(fs.readFileSync(target, 'utf8'));
}

function parseList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(/[\n,]/)
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseJsonValue(value, fallback) {
  if (!value) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
}

function normalizeSlug(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function resolveUploadedImageUrls(files = []) {
  const urls = [];

  for (const file of files || []) {
    if (!file) continue;

    const uploaded = await uploadBufferToCloudinary(file, 'dst_deco/products');
    if (uploaded && uploaded.secure_url) {
      urls.push(uploaded.secure_url);
    }
  }

  return urls;
}

export async function getProducts(req, res) {
  try {
    const { category, search, featured } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (category && category !== 'all') filter.category = category;
      if (featured === 'true') filter.isFeatured = true;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const items = await Product.find(filter).sort({ createdAt: -1 });
      return res.json(items);
    }

    let items = loadFallbackJson();
    if (category && category !== 'all') {
      items = items.filter(p => p.category === category);
    }
    if (featured === 'true') {
      items = items.filter(p => p.isFeatured);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;
    if (mongoose.connection.readyState === 1) {
      const item = await Product.findOne({ $or: [{ slug }, { id: slug }] });
      if (!item) return res.status(404).json({ message: 'Product not found' });
      return res.json(item);
    }

    const items = loadFallbackJson();
    const item = items.find(p => p.slug === slug || p.id === slug);
    if (!item) return res.status(404).json({ message: 'Product not found' });
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createProduct(req, res) {
  try {
    const body = req.body || {};
    const specificationInput = parseJsonValue(body.specifications, {
      thickness: body.thickness || 'Standard',
      dimensions: body.dimensions || 'Custom',
      material: body.material || 'Composite'
    });

    const uploadedUrls = await resolveUploadedImageUrls(req.files || []);
    const urlImages = parseList(body.images);
    const images = [...uploadedUrls, ...urlImages].filter(Boolean);

    const rawName = body.name || 'New Material';
    const slugBase = normalizeSlug(body.slug || rawName);
    const category = body.category || 'wall-products';
    const categoryName = body.categoryName || 'Wall Panels';

    const product = await Product.create({
      id: body.id || `prd-${Date.now()}`,
      name: rawName,
      slug: slugBase,
      category,
      categoryName,
      description: body.description || 'Premium architectural material',
      specifications: {
        thickness: specificationInput.thickness || body.thickness || 'Standard',
        dimensions: specificationInput.dimensions || body.dimensions || 'Custom',
        material: specificationInput.material || body.material || 'Composite',
        features: parseList(specificationInput.features || body.features)
      },
      images,
      inStock: body.inStock === undefined ? true : Boolean(body.inStock),
      isFeatured: body.isFeatured === 'true' || body.isFeatured === true,
      seoTitle: body.seoTitle || rawName,
      seoDescription: body.seoDescription || body.description || 'Premium architectural material for modern projects.'
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const specificationInput = parseJsonValue(body.specifications, {
      thickness: body.thickness || 'Standard',
      dimensions: body.dimensions || 'Custom',
      material: body.material || 'Composite'
    });

    const uploadedUrls = await resolveUploadedImageUrls(req.files || []);
    const urlImages = parseList(body.images);
    const finalImages = uploadedUrls.length > 0 ? [...uploadedUrls, ...urlImages] : urlImages;

    const payload = {
      ...body,
      description: body.description,
      inStock: body.inStock === undefined ? undefined : Boolean(body.inStock),
      isFeatured: body.isFeatured === undefined ? undefined : body.isFeatured === 'true' || body.isFeatured === true,
      specifications: {
        thickness: specificationInput.thickness || body.thickness || 'Standard',
        dimensions: specificationInput.dimensions || body.dimensions || 'Custom',
        material: specificationInput.material || body.material || 'Composite',
        features: parseList(specificationInput.features || body.features)
      }
    };

    if (body.name) payload.name = body.name;
    if (body.category) payload.category = body.category;
    if (body.categoryName) payload.categoryName = body.categoryName;
    if (body.slug) payload.slug = normalizeSlug(body.slug);
    if (finalImages.length > 0) payload.images = finalImages;

    const updated = await Product.findOneAndUpdate(
      { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id }, { slug: id }] },
      payload,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Product not found' });
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await Product.findOneAndDelete({
      $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id }, { slug: id }]
    });
    return res.json({ message: 'Product deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
