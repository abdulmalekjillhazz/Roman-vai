import mongoose from 'mongoose';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { textField } from '../utils/validation.js';

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
    { slug: 'details', name: 'Profiles & Fixing', description: 'Profiles, trims and fixing materials' }
  ];
}

function buildCategoryQuery(id) {
  const cleanId = String(id || '').trim();
  const conditions = [{ slug: cleanId }];
  if (mongoose.isValidObjectId(cleanId)) {
    conditions.unshift({ _id: cleanId });
  }
  return { $or: conditions };
}

export async function getCategories(req, res) {
  try {
    if (mongoose.connection.readyState === 1) {
      const categories = await Category.find().sort({ name: 1 });
      return res.json(categories);
    }

    return res.json(buildFallbackCategories());
  } catch (error) {
    console.error('getCategories error:', error.message);
    return res.json(buildFallbackCategories());
  }
}

export async function createCategory(req, res) {
  try {
    const { name, description = '', seoTitle = '', seoDescription = '' } = req.body || {};
    const cleanName = textField(name ?? '', 'Category name', { required: true });

    const slug = normalizeSlug(textField(req.body.slug || cleanName, 'Category slug'));
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: 'Category already exists.' });
    }

    const category = await Category.create({
      slug,
      name: cleanName,
      description: textField(description, 'Description'),
      seoTitle: textField(seoTitle, 'SEO title'),
      seoDescription: textField(seoDescription, 'SEO description')
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error('createCategory error:', error.message);
    const status = error.code === 11000 ? 409 : error.status || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.code === 11000 ? 'A category with this name or slug already exists.'
      : status === 400 ? error.message : 'Failed to create category.';
    return res.status(status).json({ message });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const payload = {};

    // Whitelist allowed fields to prevent NoSQL operator injection & mass assignment
    if (body.name !== undefined) payload.name = textField(body.name, 'Category name', { required: true });
    if (body.description !== undefined) payload.description = textField(body.description, 'Description');
    if (body.slug !== undefined) payload.slug = normalizeSlug(textField(body.slug, 'Category slug', { required: true }));
    if (body.seoTitle !== undefined) payload.seoTitle = textField(body.seoTitle, 'SEO title');
    if (body.seoDescription !== undefined) payload.seoDescription = textField(body.seoDescription, 'SEO description');

    const current = await Category.findOne(buildCategoryQuery(id));
    if (!current) return res.status(404).json({ message: 'Category not found.' });
    if (payload.slug && payload.slug !== current.slug && await Product.exists({ category: current.slug })) {
      return res.status(409).json({ message: 'Move this category’s products before changing its slug.' });
    }

    const category = await Category.findOneAndUpdate(
      buildCategoryQuery(id),
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.json(category);
  } catch (error) {
    console.error('updateCategory error:', error.message);
    const status = error.code === 11000 ? 409 : error.status || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.code === 11000 ? 'A category with this slug already exists.' : error.status ? error.message : 'Failed to update category.';
    return res.status(status).json({ message });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findOne(buildCategoryQuery(id));

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    if (await Product.exists({ category: category.slug })) {
      return res.status(409).json({ message: 'Move or delete this category’s products before deleting the category.' });
    }
    await Category.deleteOne({ _id: category._id });
    return res.json({ message: 'Category deleted.' });
  } catch (error) {
    console.error('deleteCategory error:', error.message);
    const message = process.env.NODE_ENV === 'production' ? 'Failed to delete category.' : error.message;
    return res.status(500).json({ message });
  }
}
