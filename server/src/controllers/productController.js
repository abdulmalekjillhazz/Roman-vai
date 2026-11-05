import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadFallbackJson() {
  const cloudinaryPath = path.join(__dirname, '../../../data/products_cloudinary.json');
  const defaultPath = path.join(__dirname, '../../../data/products_data.json');
  const target = fs.existsSync(cloudinaryPath) ? cloudinaryPath : defaultPath;
  return JSON.parse(fs.readFileSync(target, 'utf8'));
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

    // Fallback to JSON file if DB is not connected yet
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
    const body = req.body;
    const uploadedUrls = req.files ? req.files.map(f => f.path) : [];
    const images = uploadedUrls.length > 0 ? uploadedUrls : (body.images || []);

    const slug = (body.slug || body.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newProduct = await Product.create({
      ...body,
      id: body.id || `prd-${Date.now()}`,
      slug,
      images
    });
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updated = await Product.findOneAndUpdate(
      { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { id }, { slug: id }] },
      req.body,
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
