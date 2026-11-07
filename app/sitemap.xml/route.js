import { NextResponse } from 'next/server';
import cloudCatalog from '../../data/products_cloudinary.json';
import localCatalog from '../../data/products_data.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://classicaldecorid.com';

export async function GET() {
  const items = cloudCatalog.length ? cloudCatalog : localCatalog;
  const categories = [...new Set(items.map(p => p.category).filter(Boolean))];

  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: 'gallery', priority: '0.9', changefreq: 'daily' }
  ];

  const categoryPages = categories.map(cat => ({
    url: `category/${cat}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  const productPages = items.map(prod => ({
    url: `product/${prod.slug || prod.id}`,
    priority: '0.7',
    changefreq: 'weekly'
  }));

  const allUrls = [...staticPages, ...categoryPages, ...productPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    page => `  <url>
    <loc>${SITE_URL}/${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}

