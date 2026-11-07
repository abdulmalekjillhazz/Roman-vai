import mongoose from 'mongoose';
import { ensureDBConnected } from '../config/db.js';
import { MATERIAL_HERO_SLIDES } from '../../../src/config/materialHeroSlides.js';
import { cloudinary, isCloudinaryConfigured, uploadBufferToCloudinary } from '../config/cloudinary.js';
import { HeroSlide } from '../models/HeroSlide.js';

const validSlideKeys = new Set(MATERIAL_HERO_SLIDES.map(slide => slide.file));

export async function getHeroSlides(req, res) {
  res.set('Cache-Control', 'no-store');

  try {
    if (!(await ensureDBConnected())) {
      return res.status(503).json({
        message: 'MongoDB is not connected. Hero image replacements cannot be loaded; the homepage will use its original images.'
      });
    }

    const savedSlides = await HeroSlide.find(
      {},
      { key: 1, imageUrl: 1, title: 1, eyebrow: 1, description: 1, specs: 1, actionText: 1 }
    ).lean();

    // 1. Backward-compatible image mapping (key -> imageUrl string)
    const slides = Object.fromEntries(
      savedSlides.filter(slide => Boolean(slide.imageUrl)).map(slide => [slide.key, slide.imageUrl])
    );

    // 2. New comprehensive content mapping (key -> { title, eyebrow, description, specs, actionText, imageUrl })
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

    return res.json({ slides, content });
  } catch (error) {
    console.error('Could not load hero slide images:', error.message);
    return res.status(500).json({
      message: 'Saved hero images could not be loaded. The homepage will use its original images.'
    });
  }
}

export async function updateHeroSlide(req, res) {
  const { key } = req.params;
  if (!validSlideKeys.has(key)) {
    return res.status(404).json({ message: 'Hero slide not found.' });
  }

  const body = req.body || {};
  const hasFile = Boolean(req.file);
  const textKeys = ['title', 'eyebrow', 'description', 'specs', 'actionText'];
  const hasTextUpdate = textKeys.some(k => body[k] !== undefined);

  if (!hasFile && !hasTextUpdate) {
    return res.status(400).json({
      message: 'Provide an image file or text content (title, eyebrow, description, specs, actionText) to update.'
    });
  }

  let uploaded;
  let saved = false;
  const updateFields = { key };

  // Collect text updates
  for (const field of textKeys) {
    if (body[field] !== undefined) {
      updateFields[field] = String(body[field]).trim();
    }
  }

  try {
    const previous = await HeroSlide.findOne({ key }).lean();

    // Handle image upload if a file was attached
    if (hasFile) {
      if (!isCloudinaryConfigured()) {
        return res.status(503).json({
          message: 'Image uploads are unavailable. Configure Cloudinary before uploading.'
        });
      }

      uploaded = await uploadBufferToCloudinary(req.file, 'dst_deco/hero');
      if (!uploaded?.secure_url || !uploaded.public_id) {
        throw new Error('The image could not be uploaded. Please try again.');
      }

      updateFields.imageUrl = uploaded.secure_url;
      updateFields.cloudinaryPublicId = uploaded.public_id;
    }

    const updated = await HeroSlide.findOneAndUpdate(
      { key },
      { $set: updateFields },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    saved = true;

    let cleanupWarning = '';
    if (hasFile && previous?.cloudinaryPublicId && previous.cloudinaryPublicId !== uploaded.public_id) {
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

    return res.json({
      key,
      imageUrl: updated.imageUrl || '',
      title: updated.title || '',
      eyebrow: updated.eyebrow || '',
      description: updated.description || '',
      specs: updated.specs || '',
      actionText: updated.actionText || '',
      cleanupWarning
    });
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
    console.error('Could not update hero slide:', error.message);
    return res.status(500).json({
      message: `The hero slide could not be saved.${cleanupWarning}`,
      ...(process.env.NODE_ENV === 'development' ? { detail: error.message } : {})
    });
  }
}
