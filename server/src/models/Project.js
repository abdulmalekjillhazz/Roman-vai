import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, trim: true },
  relatedServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  materialsSupplied: [{ type: String }],
  locationArea: { type: String, trim: true },
  completionDate: { type: Date },
  coverImage: { type: String },
  gallery: [{ type: String }],
  beforeAfterPairs: [{ before: String, after: String }],
  cloudinaryImages: [{ public_id: String, secure_url: String, format: String }],
  seoTitle: { type: String },
  seoDescription: { type: String },
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  hasClientConsent: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

projectSchema.index({ order: 1, createdAt: 1 });

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
