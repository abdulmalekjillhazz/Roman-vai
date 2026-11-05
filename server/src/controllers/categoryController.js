import mongoose from 'mongoose';
import { Category } from '../models/Category.js';

const normalizeSlug = (input = '') =>
  String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'uncategorized';

function buildFallbackCategories() {
  return [
    { slug: 'wall-products', name: 'Wall Panels', description: 'Wall panels and architectural finishes' },
    { slug: 'flooring-products', name: 'Flooring', description: 'Flooring and skirting materials' },
    { slug: 'aluminum-profiles', name: 'Profiles & Fixing', description: 'Profiles, trims and fixing materials' }
  ];
}

export async function getCategories(req, res) {
  try {
    if (mongoose.connection.readyState === 1) {
      const categories = await Category.find().sort({ name: 1 });
      return res.json(categories.length ? categories : buildFallbackCategories());
    }

    return res.json(buildFallbackCategories());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createCategory(req, res) {
  try {
    const { name, description = '', seoTitle = '', seoDescription = '' } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const slug = normalizeSlug(req.body.slug || name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: 'Category already exists.' });
    }

    const category = await Category.create({
      slug,
      name: String(name).trim(),
      description: String(description).trim(),
      seoTitle: String(seoTitle).trim(),
      seoDescription: String(seoDescription).trim()
    });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (payload.name) payload.name = String(payload.name).trim();
    if (payload.description !== undefined) payload.description = String(payload.description).trim();
    if (payload.slug) payload.slug = normalizeSlug(payload.slug);

    const category = await Category.findOneAndUpdate(
      { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { slug: id }, { _id: id }] },
      payload,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findOneAndDelete({
      $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { slug: id }, { _id: id }]
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.json({ message: 'Category deleted.' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
