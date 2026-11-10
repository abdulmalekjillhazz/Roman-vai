import fs from 'node:fs';
import path from 'node:path';
import { Product } from '../models/Product.js';
import { HeroSlide } from '../models/HeroSlide.js';
import { cloudinary, configureCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { cleanUnusedAssets } from '../utils/catalogAssets.js';

const dataDirectory = path.join(process.cwd(), 'data');
function readCatalog(filename) {
  return JSON.parse(fs.readFileSync(path.join(dataDirectory, filename), 'utf8'));
}

export function loadFallbackCatalog() {
  for (const filename of ['products_cloudinary.json', 'products_data.json']) {
    try {
      const data = readCatalog(filename);
      if (Array.isArray(data) && data.length) return data;
    } catch { /* Try the next bundled catalog. */ }
  }
  throw new Error('The catalog is temporarily unavailable. Please contact our team.');
}

export async function removeCloudinaryImages(assets = []) {
  configureCloudinary();
  return cleanUnusedAssets(assets, {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    configured: isCloudinaryConfigured(),
    findReferences: async () => {
      const products = await Product.find({}, { images: 1, cloudinaryImages: 1 }).lean();
      const heroes = await HeroSlide.find({}, { imageUrl: 1 }).lean();
      const backups = ['products_cloudinary.json', 'products_data.json'].flatMap(readCatalog);
      // A hero and a product may share the same URL. Bundled outage catalogs
      // must also retain working images.
      return [...products, ...heroes.map(hero => ({ images: [hero.imageUrl].filter(Boolean) })), ...backups];
    },
    destroy: (id, options) => cloudinary.uploader.destroy(id, options)
  });
}
