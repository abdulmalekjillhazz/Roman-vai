import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../server/src/config/db.js';
import { HeroSlide } from '../../../server/src/models/HeroSlide.js';

export async function GET() {
  try {
    if (mongoose.connection.readyState === 1 || (await connectDB())) {
      const savedSlides = await HeroSlide.find(
        {},
        { key: 1, imageUrl: 1, title: 1, eyebrow: 1, description: 1, specs: 1, actionText: 1 }
      ).lean();

      const slides = Object.fromEntries(
        savedSlides.filter(slide => Boolean(slide.imageUrl)).map(slide => [slide.key, slide.imageUrl])
      );

      const content = Object.fromEntries(
        savedSlides.map(slide => [
          slide.key,
          {
            imageUrl: slide.imageUrl || '',
            title: slide.title || '',
            eyebrow: slide.eyebrow || '',
            description: slide.description || '',
            specs: slide.specs || '',
            actionText: slide.actionText || ''
          }
        ])
      );

      return NextResponse.json({ slides, content }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }
  } catch (error) {
    console.warn('MongoDB hero slides lookup failed:', error.message);
  }

  return NextResponse.json({ slides: {}, content: {} }, {
    headers: { 'Cache-Control': 'no-store' }
  });
}
