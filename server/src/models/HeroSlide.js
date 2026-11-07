import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    imageUrl: { type: String },
    cloudinaryPublicId: { type: String },
    title: { type: String, trim: true },
    eyebrow: { type: String, trim: true },
    description: { type: String, trim: true },
    specs: { type: String, trim: true },
    actionText: { type: String, trim: true }
  },
  { timestamps: true }
);

export const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', heroSlideSchema);
