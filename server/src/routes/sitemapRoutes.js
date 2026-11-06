import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.get('/sitemap.xml', (req, res) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dstdeco.com';
  const dataPath = path.join(__dirname, '../../../data/products_data.json');
  const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const categories = [...new Set(products.map(p => p.category))];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Home
  xml += `  <url><loc>${siteUrl}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`;
  xml += `  <url><loc>${siteUrl}/gallery</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;

  // Category URLs
  for (const cat of categories) {
    xml += `  <url><loc>${siteUrl}/category/${cat}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  }

  // Individual Product URLs
  for (const p of products) {
    xml += `  <url><loc>${siteUrl}/product/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>\n`;
  }

  xml += `</urlset>`;
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

export default router;
