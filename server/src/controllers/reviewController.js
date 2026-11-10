import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { ensureDBConnected } from '../config/db.js';
import { isCloudinaryConfigured, uploadBufferToCloudinary } from '../config/cloudinary.js';
import { inputError, textField } from '../utils/validation.js';

const ALLOWED_STATUSES = new Set(['pending', 'verified', 'published', 'rejected', 'archived']);

async function uploadReviewImages(files, collected) {
  if (files.length > 5) throw inputError('Upload a maximum of 5 images with your review.');
  if (files.length && !isCloudinaryConfigured()) {
    throw Object.assign(new Error('Image upload is unavailable. Configure Cloudinary before uploading files.'), { status: 503 });
  }
  for (const file of files) {
    const uploaded = await uploadBufferToCloudinary(file, 'dst_deco/reviews');
    if (!uploaded?.secure_url) throw new Error('An image could not be uploaded. Please try again.');
    collected.push(uploaded.secure_url);
  }
}

export async function submitReview(req, res) {
  try {
    if (mongoose.connection.readyState !== 1 && !(await ensureDBConnected())) {
      return res.status(503).json({ message: 'Reviews service is temporarily unavailable.' });
    }

    const body = req.body || {};
    const customerName = textField(body.customerName ?? '', 'Customer name', { required: true });
    const feedback = textField(body.feedback ?? '', 'Feedback', { required: true });

    const rawRating = Number(body.rating);
    if (!Number.isInteger(rawRating) || rawRating < 1 || rawRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' });
    }

    // Mandatory privacy consent check
    const consent = body.privacyConsent === true || body.privacyConsent === 'true';
    if (!consent) {
      return res.status(400).json({ message: 'You must agree to the privacy consent to submit a review.' });
    }

    // Basic anti-spam heuristics
    if (feedback.length < 10) {
      return res.status(400).json({ message: 'Feedback must be at least 10 characters long.' });
    }
    if (/https?:\/\//i.test(feedback) || /<[^>]+>/i.test(feedback)) {
      return res.status(400).json({ message: 'Links and markup are not permitted in review submissions.' });
    }

    const uploadedUrls = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      await uploadReviewImages(req.files, uploadedUrls);
    }

    let serviceId = undefined;
    if (body.serviceId && mongoose.isValidObjectId(body.serviceId)) {
      serviceId = body.serviceId;
    }

    let projectId = undefined;
    if (body.projectId && mongoose.isValidObjectId(body.projectId)) {
      projectId = body.projectId;
    }

    const submitterIp = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';

    // Force status: 'pending' regardless of client input
    const review = await Review.create({
      customerName,
      rating: rawRating,
      feedback,
      serviceId,
      projectId,
      images: uploadedUrls,
      privacyConsent: true,
      status: 'pending',
      submitterIp
    });

    return res.status(201).json({
      message: 'Thank you for your feedback! Your review has been submitted for verification.',
      id: review._id
    });
  } catch (error) {
    console.error('submitReview error:', error.message);
    const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
    return res.status(status).json({ message: status === 400 ? error.message : 'Failed to submit review.' });
  }
}

export async function getReviews(req, res) {
  try {
    if (mongoose.connection.readyState !== 1 && !(await ensureDBConnected())) {
      return res.json([]);
    }

    const showAll = req.query.all === 'true' && req.user?.role === 'admin';
    if (showAll) {
      const filter = {};
      if (req.query.status && ALLOWED_STATUSES.has(req.query.status)) {
        filter.status = req.query.status;
      }
      const reviews = await Review.find(filter)
        .populate('serviceId', 'title')
        .populate('projectId', 'title')
        .sort({ createdAt: -1 });
      return res.json(reviews);
    }

    // Public view: published only. Never compute or return a fabricated rating average.
    const published = await Review.find({ status: 'published' })
      .select('customerName rating feedback images adminResponse createdAt serviceId projectId')
      .populate('serviceId', 'title')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    return res.json(published);
  } catch (error) {
    console.error('getReviews error:', error.message);
    return res.status(500).json({ message: 'Failed to load reviews.' });
  }
}

export async function updateReviewStatus(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid review ID.' });
    }

    const body = req.body || {};
    const payload = {};

    if (body.status !== undefined) {
      if (!ALLOWED_STATUSES.has(body.status)) {
        throw inputError('Invalid review status. Must be pending, verified, published, rejected, or archived.');
      }
      payload.status = body.status;
    }

    if (body.adminResponse !== undefined) {
      payload.adminResponse = textField(body.adminResponse, 'Admin response');
    }

    if (body.moderationNotes !== undefined) {
      payload.moderationNotes = textField(body.moderationNotes, 'Moderation notes');
    }

    const updated = await Review.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('updateReviewStatus error:', error.message);
    const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
    return res.status(status).json({ message: status === 400 ? error.message : 'Failed to update review.' });
  }
}

export async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid review ID.' });
    }

    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    return res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('deleteReview error:', error.message);
    return res.status(500).json({ message: 'Failed to delete review.' });
  }
}
