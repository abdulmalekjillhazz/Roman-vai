import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { MATERIAL_HERO_SLIDES } from '../../../src/config/materialHeroSlides.js';
import { cloudinary, isCloudinaryConfigured, uploadBufferToCloudinary } from '../config/cloudinary.js';
import { HeroSlide } from '../models/HeroSlide.js';

const validSlideKeys = new Set(MATERIAL_HERO_SLIDES.map(slide => slide.file));

export async function getHeroSlides(req, res) {
  res.set('Cache-Control', 'no-store');

  try {
    if (mongoose.connection.readyState !== 1) {
      const connected = mongoose.connection.readyState === 2
        ? await mongoose.connection.asPromise().then(() => true).catch(() => false)
        : await connectDB();
      if (!connected) {
        return res.status(503).json({ message: 'Saved hero images are temporarily unavailable.' });
      }
    }

    const savedSlides = await HeroSlide.find({}, { key: 1, imageUrl: 1 }).lean();
    const slides = Object.fromEntries(savedSlides.map(slide => [slide.key, slide.imageUrl]));
    return res.json({ slides });
  } catch (error) {
    console.error('Could not load hero slide images:', error.message);
    return res.status(500).json({ message: 'Hero images are temporarily unavailable.' });
  }
}

export async function updateHeroSlide(req, res) {
  const { key } = req.params;
  if (!validSlideKeys.has(key)) {
    return res.status(404).json({ message: 'Hero slide not found.' });
  }
  if (!req.file) {
    return res.status(400).json({ message: 'Choose a JPG, PNG or WebP image to upload.' });
  }
  if (!isCloudinaryConfigured()) {
    return res.status(503).json({ message: 'Image uploads are unavailable. Configure Cloudinary before uploading.' });
  }

  let uploaded;
  let saved = false;

  try {
    const previous = await HeroSlide.findOne({ key }).lean();
    uploaded = await uploadBufferToCloudinary(req.file, 'dst_deco/hero');
    if (!uploaded?.secure_url || !uploaded.public_id) {
      throw new Error('The image could not be uploaded. Please try again.');
    }

    await HeroSlide.findOneAndUpdate(
      { key },
      { key, imageUrl: uploaded.secure_url, cloudinaryPublicId: uploaded.public_id },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    saved = true;

    let cleanupWarning = '';
    if (previous?.cloudinaryPublicId) {
      try {
        const result = await cloudinary.uploader.destroy(previous.cloudinaryPublicId, { resource_type: 'image' });
        if (result.result !== 'ok' && result.result !== 'not found') {
          cleanupWarning = 'The new image is live, but the previous image could not be removed from storage.';
        }
      } catch (error) {
        cleanupWarning = 'The new image is live, but the previous image could not be removed from storage.';
        console.warn('Could not remove replaced hero image:', error.message);
      }
    }

    return res.json({ key, imageUrl: uploaded.secure_url, cleanupWarning });
  } catch (error) {
    let cleanupWarning = '';
    if (!saved && uploaded?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploaded.public_id, { resource_type: 'image' });
      } catch (cleanupError) {
        cleanupWarning = ' The uploaded image may need manual cleanup.';
        console.warn('Could not clean up an unsaved hero image:', cleanupError.message);
      }
    }
    console.error('Could not update hero slide image:', error.message);
    return res.status(500).json({
      message: `The hero image could not be saved.${cleanupWarning}`,
      ...(process.env.NODE_ENV === 'development' ? { detail: error.message } : {})
    });
  }
}
