import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

const storage = isCloudinaryConfigured()
  ? new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => ({
        folder: `dst_deco/${req.body.category || 'general'}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      })
    })
  : multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 } // 8MB max
});

export { cloudinary };
