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
  console.error('\n❌ ERROR: Cloudinary credentials missing in .env!');
  console.log('👉 Provide credentials in .env:');
  console.log('   CLOUDINARY_CLOUD_NAME=...');
  console.log('   CLOUDINARY_API_KEY=...');
  console.log('   CLOUDINARY_API_SECRET=...\n');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

const productsDataPath = path.join(__dirname, '../data/products_data.json');
const cloudinaryCachePath = path.join(__dirname, '../data/products_cloudinary.json');
const publicAssetsDir = path.join(__dirname, '../client/public');

const products = JSON.parse(fs.readFileSync(productsDataPath, 'utf8'));

// Load existing synced records to avoid wasting Cloudinary quota
let existingCache = {};
if (fs.existsSync(cloudinaryCachePath)) {
  try {
    const cachedProducts = JSON.parse(fs.readFileSync(cloudinaryCachePath, 'utf8'));
    for (const cp of cachedProducts) {
      if (cp.cloudinaryImages && cp.cloudinaryImages.length > 0) {
        existingCache[cp.id] = cp.cloudinaryImages;
      }
    }
  } catch (e) {
    console.warn('⚠️ Could not parse existing products_cloudinary.json, starting fresh.');
  }
}

/**
 * Resolves local file on disk from image path
 */
function resolveLocalPath(imagePath) {
  if (!imagePath) return null;
  const cleaned = imagePath.replace(/^\//, '');
  const candidate = path.join(publicAssetsDir, cleaned);
  if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
    return candidate;
  }
  return null;
}

/**
 * Checks if image already exists in Cloudinary before uploading
 */
async function checkRemoteExists(fullPublicId) {
  try {
    const res = await cloudinary.api.resource(fullPublicId);
    if (res && res.secure_url) {
      return {
        public_id: res.public_id,
        secure_url: res.secure_url,
        format: res.format,
        width: res.width,
        height: res.height
      };
    }
  } catch (err) {
    // 404 means not uploaded yet
    return null;
  }
  return null;
}

async function syncToCloudinary() {
  console.log('==========================================================');
  console.log('⚡ SEMANTIC CLOUDINARY SYNC (DESCRIPTIVE & ULTRA-FAST) ⚡');
  console.log('==========================================================\n');

  const updatedProducts = [];

  for (const product of products) {
    console.log(`\n📦 Processing [${product.category}] -> ${product.name}`);

    // Check local cache first
    const cachedImgs = existingCache[product.id];
    if (cachedImgs && cachedImgs.length === product.images.length && cachedImgs.every(img => img.public_id !== 'original')) {
      console.log(`  ⏭️  Skipped (Already synced in products_cloudinary.json)`);
      updatedProducts.push({
        ...product,
        images: cachedImgs.map(i => i.secure_url),
        cloudinaryImages: cachedImgs,
        thumbnail: cachedImgs[0].secure_url
      });
      continue;
    }

    const cloudinaryImages = [];

    for (let i = 0; i < product.images.length; i++) {
      const imgPath = product.images[i];
      const localFilePath = resolveLocalPath(imgPath);
      const baseName = path.parse(imgPath).name;
      const folderPath = `dst_deco/${product.category}`;
      const fullPublicId = `${folderPath}/${baseName}`;

      // Check if already on Cloudinary server
      const remoteExisting = await checkRemoteExists(fullPublicId);
      if (remoteExisting) {
        console.log(`  ⏭️  Found existing on Cloudinary: ${remoteExisting.secure_url}`);
        cloudinaryImages.push(remoteExisting);
        continue;
      }

      const uploadSource = localFilePath || imgPath;

      try {
        console.log(`  ⏳ Uploading [${baseName}] -> ${fullPublicId}...`);
        const uploadRes = await cloudinary.uploader.upload(uploadSource, {
          folder: folderPath,
          public_id: baseName,
          overwrite: false,
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });

        console.log(`  ✅ Uploaded: ${uploadRes.secure_url}`);
        cloudinaryImages.push({
          public_id: uploadRes.public_id,
          secure_url: uploadRes.secure_url,
          format: uploadRes.format,
          width: uploadRes.width,
          height: uploadRes.height
        });
      } catch (err) {
        console.error(`  ❌ Upload Error for ${baseName}: ${err.message}`);
        cloudinaryImages.push({
          public_id: 'original',
          secure_url: imgPath
        });
      }
    }

    updatedProducts.push({
      ...product,
      images: cloudinaryImages.map(c => c.secure_url),
      cloudinaryImages,
      thumbnail: cloudinaryImages[0]?.secure_url || product.images[0]
    });
  }

  fs.writeFileSync(cloudinaryCachePath, JSON.stringify(updatedProducts, null, 2), 'utf8');
  console.log('\n==========================================================');
  console.log(`🎉 Sync Complete! Saved to: ${cloudinaryCachePath}`);
  console.log('==========================================================\n');
}

syncToCloudinary();
