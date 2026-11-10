import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export function configureCloudinary() {
  if (!isCloudinaryConfigured()) return false;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  return true;
}

export async function uploadBufferToCloudinary(file, folderName = 'dst_deco') {
  if (!file?.buffer) throw new Error('An uploaded image is empty. Please select it again.');
  if (!configureCloudinary()) throw new Error('Configure Cloudinary before uploading images.');
  const filename = path.parse(file.originalname || 'material').name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'material';

  const isPdf = file.mimetype === 'application/pdf';
  const uploadOptions = {
    folder: folderName,
    public_id: `${filename}-${randomUUID()}`,
    overwrite: false
  };
  if (isPdf) {
    uploadOptions.resource_type = 'raw';
  } else {
    uploadOptions.allowed_formats = ['jpg', 'jpeg', 'png', 'webp'];
    uploadOptions.transformation = [{ quality: 'auto', fetch_format: 'auto' }];
  }

  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });

  return uploadResult;
}

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: (req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.mimetype)) {
      return callback(new Error('Upload JPG, PNG, WebP images or PDF documents only.'));
    }
    callback(null, true);
  }
});

export { cloudinary };
