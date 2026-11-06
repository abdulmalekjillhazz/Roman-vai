import mongoose from 'mongoose';
import { MATERIAL_HERO_SLIDES } from '../../../src/config/materialHeroSlides.js';

const heroSlideSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, enum: MATERIAL_HERO_SLIDES.map(slide => slide.file) },
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true }
  },
  { timestamps: true }
);

export const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', heroSlideSchema);
