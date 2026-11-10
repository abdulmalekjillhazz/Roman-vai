import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  highlights: [{ type: String }],
  images: [{ type: String }],
  cloudinaryImages: [{ public_id: String, secure_url: String, format: String }],
  serviceAreas: [{ type: String }],
  relatedProductIds: [{ type: String }],
  faqs: [{ question: String, answer: String }],
  seoTitle: { type: String },
  seoDescription: { type: String },
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

serviceSchema.index({ order: 1, createdAt: 1 });

export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
