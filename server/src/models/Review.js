import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String, required: true, trim: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  images: [{ type: String }],
  privacyConsent: { type: Boolean, required: true },
  status: { type: String, enum: ['pending', 'verified', 'published', 'rejected', 'archived'], default: 'pending' },
  adminResponse: { type: String, trim: true },
  moderationNotes: { type: String, trim: true },
  submitterIp: { type: String, select: false }
}, { timestamps: true });

reviewSchema.index({ status: 1, createdAt: -1 });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
