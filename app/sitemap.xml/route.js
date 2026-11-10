import { NextResponse } from 'next/server';
import cloudCatalog from '../../data/products_cloudinary.json';
import localCatalog from '../../data/products_data.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://classicaldecorid.com';

export async function GET() {
  let items = cloudCatalog.length ? cloudCatalog : localCatalog;
  let services = [];
  let projects = [];

  try {
    const res = await fetch(`${SITE_URL}/api/products?limit=200`, { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        items = data;
      }
    }
  } catch {
    // Gracefully fall back to bundled JSON catalog
  }

  try {
    const sRes = await fetch(`${SITE_URL}/api/services?published=true`, { next: { revalidate: 300 } });
    if (sRes.ok) {
      const sData = await sRes.json();
      if (Array.isArray(sData)) {
        services = sData;
      }
    }
  } catch {
    // Silently continue if services API is temporarily unreachable
  }

  try {
    const pRes = await fetch(`${SITE_URL}/api/projects?published=true`, { next: { revalidate: 300 } });
    if (pRes.ok) {
      const pData = await pRes.json();
      if (Array.isArray(pData)) {
        projects = pData;
      }
    }
  } catch {
    // Silently continue if projects API is temporarily unreachable
  }

  const categories = [...new Set(items.map(p => p.category).filter(Boolean))];

  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: 'gallery', priority: '0.9', changefreq: 'daily' },
    { url: 'services', priority: '0.8', changefreq: 'weekly' },
    { url: 'projects', priority: '0.8', changefreq: 'weekly' }
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

  const servicePages = services.map(svc => ({
    url: `services/${svc.slug}`,
    priority: '0.7',
    changefreq: 'weekly'
  }));

  const projectPages = projects.map(proj => ({
    url: `projects/${proj.slug}`,
    priority: '0.7',
    changefreq: 'weekly'
  }));

  const allUrls = [...staticPages, ...categoryPages, ...productPages, ...servicePages, ...projectPages];

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
