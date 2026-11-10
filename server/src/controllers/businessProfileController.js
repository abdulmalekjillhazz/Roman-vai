import mongoose from 'mongoose';
import { BusinessProfile } from '../models/BusinessProfile.js';
import { isCloudinaryConfigured, uploadBufferToCloudinary } from '../config/cloudinary.js';
import { inputError, textField } from '../utils/validation.js';

function parseList(value, label = 'Item') {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) && typeof value !== 'string') {
    throw inputError(`${label} must be text or a list of text values.`);
  }
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[\n,]/) : [];
  return items.map(item => textField(item, label)).filter(Boolean);
}

export async function getProfile(req, res) {
  res.set('Cache-Control', 'no-store');
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({});
    }
    const profile = await BusinessProfile.findOne({ singletonKey: 'main' }).lean();
    return res.json(profile || {});
  } catch (error) {
    console.error('getProfile error:', error.message);
    return res.json({});
  }
}

export async function updateProfile(req, res) {
  try {
    const body = req.body || {};
    const hasFiles = req.files && Object.values(req.files).some(arr => arr && arr.length > 0);
    if (hasFiles && !isCloudinaryConfigured()) {
      return res.status(503).json({ message: 'Uploads are unavailable. Configure Cloudinary before uploading.' });
    }

    const payload = {};
    const textFields = [
      'legalName',
      'displayName',
      'introduction',
      'history',
      'missionValues',
      'contactPhone',
      'whatsappNumber',
      'contactEmail',
      'officeAddress',
      'showroomAddress',
      'googleMapsUrl',
      'operatingHours',
      'registrationDetails',
      'logoUrl',
      'companyProfilePdfUrl'
    ];

    for (const field of textFields) {
      if (body[field] !== undefined) {
        payload[field] = textField(body[field], field);
      }
    }

    if (body.serviceAreas !== undefined) {
      payload.serviceAreas = parseList(body.serviceAreas, 'Service area');
    }

    let currentPhotos = [];
    if (body.photoUrls !== undefined) {
      currentPhotos = parseList(body.photoUrls, 'Photo URL');
    }

    let currentCerts = [];
    if (body.certificateUrls !== undefined) {
      currentCerts = parseList(body.certificateUrls, 'Certificate URL');
    }

    if (body.socials !== undefined) {
      let socialsObj = body.socials;
      if (typeof socialsObj === 'string') {
        try { socialsObj = JSON.parse(socialsObj); } catch { socialsObj = {}; }
      }
      if (typeof socialsObj === 'object' && socialsObj !== null) {
        payload.socials = {
          instagramUrl: socialsObj.instagramUrl !== undefined ? textField(socialsObj.instagramUrl, 'Instagram URL') : undefined,
          facebookUrl: socialsObj.facebookUrl !== undefined ? textField(socialsObj.facebookUrl, 'Facebook URL') : undefined,
          linkedinUrl: socialsObj.linkedinUrl !== undefined ? textField(socialsObj.linkedinUrl, 'LinkedIn URL') : undefined
        };
      }
    } else {
      const socials = {};
      let hasSocial = false;
      if (body.instagramUrl !== undefined) { socials.instagramUrl = textField(body.instagramUrl, 'Instagram URL'); hasSocial = true; }
      if (body.facebookUrl !== undefined) { socials.facebookUrl = textField(body.facebookUrl, 'Facebook URL'); hasSocial = true; }
      if (body.linkedinUrl !== undefined) { socials.linkedinUrl = textField(body.linkedinUrl, 'LinkedIn URL'); hasSocial = true; }
      if (hasSocial) payload.socials = socials;
    }

    if (req.files) {
      if (req.files.logo?.[0]) {
        const uploaded = await uploadBufferToCloudinary(req.files.logo[0], 'dst_deco/business');
        if (uploaded?.secure_url) payload.logoUrl = uploaded.secure_url;
      }
      if (req.files.companyProfilePdf?.[0]) {
        const uploaded = await uploadBufferToCloudinary(req.files.companyProfilePdf[0], 'dst_deco/business');
        if (uploaded?.secure_url) payload.companyProfilePdfUrl = uploaded.secure_url;
      }
      if (Array.isArray(req.files.photos) && req.files.photos.length > 0) {
        for (const file of req.files.photos) {
          const uploaded = await uploadBufferToCloudinary(file, 'dst_deco/business');
          if (uploaded?.secure_url) currentPhotos.push(uploaded.secure_url);
        }
        payload.photoUrls = currentPhotos;
      } else if (body.photoUrls !== undefined) {
        payload.photoUrls = currentPhotos;
      }

      if (Array.isArray(req.files.certificates) && req.files.certificates.length > 0) {
        for (const file of req.files.certificates) {
          const uploaded = await uploadBufferToCloudinary(file, 'dst_deco/business');
          if (uploaded?.secure_url) currentCerts.push(uploaded.secure_url);
        }
        payload.certificateUrls = currentCerts;
      } else if (body.certificateUrls !== undefined) {
        payload.certificateUrls = currentCerts;
      }
    } else {
      if (body.photoUrls !== undefined) payload.photoUrls = currentPhotos;
      if (body.certificateUrls !== undefined) payload.certificateUrls = currentCerts;
    }

    const updated = await BusinessProfile.findOneAndUpdate(
      { singletonKey: 'main' },
      { $set: payload },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.json(updated);
  } catch (error) {
    console.error('updateProfile error:', error.message);
    const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
    return res.status(status).json({ message: status === 400 ? error.message : 'Failed to update business profile.' });
  }
}
