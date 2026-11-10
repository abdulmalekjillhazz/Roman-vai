import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    description: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String }
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
