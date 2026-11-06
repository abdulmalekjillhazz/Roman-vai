import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary credentials missing in .env');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

const galleryManifestPath = path.join(__dirname, '../client/public/assets/decorforall/gallery-categories.json');
const publicGalleryManifestPath = path.join(__dirname, '../public/assets/decorforall/gallery-categories.json');
const localAssetsDir = path.join(__dirname, '../client/public');
const productsCloudinaryPath = path.join(__dirname, '../data/products_cloudinary.json');

// Map of existing Cloudinary assets from products
const existingCloudinaryMap = {};
if (fs.existsSync(productsCloudinaryPath)) {
  const products = JSON.parse(fs.readFileSync(productsCloudinaryPath, 'utf8'));
  for (const product of products) {
    for (const url of product.images || []) {
      const filename = path.basename(url).replace(/\.[^/.]+$/, '');
      existingCloudinaryMap[filename] = url;
    }
  }
}

const manifest = JSON.parse(fs.readFileSync(galleryManifestPath, 'utf8'));

async function uploadLocalFile(localRelPath, categoryId) {
  const cleanPath = localRelPath.replace(/^\//, '');
  const absPath = path.join(localAssetsDir, cleanPath);
  const baseName = path.basename(cleanPath).replace(/\.[^/.]+$/, '');

  // Check if already in productsCloudinaryMap
  if (existingCloudinaryMap[baseName]) {
    return existingCloudinaryMap[baseName];
  }

  if (!fs.existsSync(absPath)) {
    console.warn(`⚠️ Local file not found: ${absPath}`);
    return localRelPath;
  }

  try {
    const result = await cloudinary.uploader.upload(absPath, {
      folder: `dst_deco/gallery/${categoryId}`,
      public_id: baseName,
      overwrite: false,
      resource_type: 'image'
    });
    console.log(`✅ Uploaded: ${baseName} -> ${result.secure_url}`);
    existingCloudinaryMap[baseName] = result.secure_url;
    return result.secure_url;
  } catch (err) {
    console.error(`❌ Upload failed for ${baseName}:`, err.message);
    return localRelPath;
  }
}

async function run() {
  console.log('🚀 Syncing gallery images to Cloudinary...\n');

  let uploadedCount = 0;
  let reusedCount = 0;

  for (const category of manifest.categories) {
    console.log(`\n📁 Category: ${category.title} (${category.id})`);
    for (const img of category.images) {
      if (!img.src.startsWith('http')) {
        const baseName = path.basename(img.src).replace(/\.[^/.]+$/, '');
        if (existingCloudinaryMap[baseName]) {
          img.src = existingCloudinaryMap[baseName];
          reusedCount++;
        } else {
          const cldUrl = await uploadLocalFile(img.src, category.id);
          if (cldUrl.startsWith('http')) {
            img.src = cldUrl;
            uploadedCount++;
          }
        }
      }
    }
  }

  const jsonStr = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(galleryManifestPath, jsonStr, 'utf8');
  if (fs.existsSync(path.dirname(publicGalleryManifestPath))) {
    fs.writeFileSync(publicGalleryManifestPath, jsonStr, 'utf8');
  }

  console.log(`\n🎉 Gallery sync complete! Uploaded: ${uploadedCount}, Reused: ${reusedCount}`);
}

run().catch(console.error);

