import mongoose from 'mongoose';
import { ensureDBConnected } from '../config/db.js';
import { MATERIAL_HERO_SLIDES } from '../../../src/config/materialHeroSlides.js';
import { isCloudinaryConfigured, uploadBufferToCloudinary } from '../config/cloudinary.js';
import { HeroSlide } from '../models/HeroSlide.js';
import { removeCloudinaryImages } from '../services/catalogAssets.js';
import { cloudinaryAssetFromUrl } from '../utils/catalogAssets.js';
import { booleanField, textField } from '../utils/validation.js';

const validSlideKeys = new Set(MATERIAL_HERO_SLIDES.map(slide => slide.file));

export async function getHeroSlides(req, res) {
  res.set('Cache-Control', 'no-store');

  try {
    if (!(await ensureDBConnected())) {
      return res.json({ slides: {}, content: {} });
    }

    const savedSlides = await HeroSlide.find(
      {},
      { key: 1, imageUrl: 1, title: 1, eyebrow: 1, description: 1, specs: 1, actionText: 1, hideTextBox: 1 }
    ).lean();

    // 1. Backward-compatible image mapping (key -> imageUrl string)
    const slides = Object.fromEntries(
      savedSlides.filter(slide => Boolean(slide.imageUrl)).map(slide => [slide.key, slide.imageUrl])
    );

    // 2. New comprehensive content mapping (key -> { title, eyebrow, description, specs, actionText, imageUrl, hideTextBox })
    const content = Object.fromEntries(
      savedSlides.map(slide => [
        slide.key,
        {
          imageUrl: slide.imageUrl || '',
          title: slide.title || '',
          eyebrow: slide.eyebrow || '',
          description: slide.description || '',
          specs: slide.specs || '',
          actionText: slide.actionText || '',
          hideTextBox: Boolean(slide.hideTextBox)
        }
      ])
    );

    return res.json({ slides, content });
  } catch (error) {
    console.error('Could not load hero slide images:', error.message);
    return res.json({ slides: {}, content: {} });
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
  const hasTextUpdate = textKeys.some(k => body[k] !== undefined) || body.hideTextBox !== undefined;

  if (!hasFile && !hasTextUpdate) {
    return res.status(400).json({
      message: 'Provide an image file or text content (title, eyebrow, description, specs, actionText, hideTextBox) to update.'
    });
  }

  let uploaded;
  let saved = false;
  const updateFields = { key };

  try {
    for (const field of textKeys) {
      if (body[field] !== undefined) {
        updateFields[field] = textField(body[field], field);
      }
    }

    if (body.hideTextBox !== undefined) {
      updateFields.hideTextBox = booleanField(body.hideTextBox);
    }
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
        const asset = cloudinaryAssetFromUrl(previous.imageUrl);
        const failures = asset ? await removeCloudinaryImages([asset]) : [];
        if (failures.length) {
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
      hideTextBox: Boolean(updated.hideTextBox),
      cleanupWarning
    });
  } catch (error) {
    let cleanupWarning = '';
    if (!saved && uploaded?.public_id) {
      try {
        const failures = await removeCloudinaryImages([uploaded]);
        if (failures.length) cleanupWarning = ' The uploaded image may need manual cleanup.';
      } catch (cleanupError) {
        cleanupWarning = ' The uploaded image may need manual cleanup.';
        console.warn('Could not clean up an unsaved hero image:', cleanupError.message);
      }
    }
    console.error('Could not update hero slide:', error.message);
    return res.status(error.status || 500).json({
      message: error.status ? error.message : `The hero slide could not be saved.${cleanupWarning}`,
      ...(process.env.NODE_ENV === 'development' ? { detail: error.message } : {})
    });
  }
}
