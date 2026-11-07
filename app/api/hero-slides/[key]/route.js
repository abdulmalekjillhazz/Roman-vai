import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../../server/src/config/db.js';
import { HeroSlide } from '../../../../server/src/models/HeroSlide.js';
import { MATERIAL_HERO_SLIDES } from '../../../../src/config/materialHeroSlides.js';

const validSlideKeys = new Set(MATERIAL_HERO_SLIDES.map(slide => slide.file));

export async function POST(request, { params }) {
  const { key } = await params;
  const decodedKey = decodeURIComponent(String(key || '')).trim();

  if (!validSlideKeys.has(decodedKey)) {
    return NextResponse.json({ message: 'Hero slide not found.' }, { status: 404 });
  }

  let body = {};
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    for (const [k, val] of formData.entries()) {
      if (typeof val === 'string') {
        body[k] = val;
      }
    }
  } else {
    try {
      body = await request.json();
    } catch {
      body = {};
    }
  }

  const textKeys = ['title', 'eyebrow', 'description', 'specs', 'actionText', 'imageUrl'];
  const updateFields = { key: decodedKey };

  for (const field of textKeys) {
    if (body[field] !== undefined) {
      updateFields[field] = String(body[field]).trim();
    }
  }

  if (body.hideTextBox !== undefined) {
    updateFields.hideTextBox = body.hideTextBox === true || body.hideTextBox === 'true';
  }

  try {
    if (mongoose.connection.readyState === 1 || (await connectDB())) {
      const updated = await HeroSlide.findOneAndUpdate(
        { key: decodedKey },
        { $set: updateFields },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
      );

      return NextResponse.json({
        key: decodedKey,
        imageUrl: updated.imageUrl || '',
        title: updated.title || '',
        eyebrow: updated.eyebrow || '',
        description: updated.description || '',
        specs: updated.specs || '',
        actionText: updated.actionText || '',
        hideTextBox: Boolean(updated.hideTextBox),
        cleanupWarning: ''
      });
    }
  } catch (error) {
    console.error('Next.js API update hero slide failed:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Database connection unavailable.' }, { status: 503 });
}

export const PUT = POST;
