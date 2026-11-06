import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import cloudCatalog from '../../../../data/products_cloudinary.json';
import localCatalog from '../../../../data/products_data.json';
import { connectDB } from '../../../../server/src/config/db.js';
import { Product } from '../../../../server/src/models/Product.js';

function buildQuery(slug) {
  const clean = decodeURIComponent(String(slug || '')).trim();
  const withoutCat = clean.replace(/^cat-/, '');
  const withCat = clean.startsWith('cat-') ? clean : `cat-${clean}`;

  return {
    $or: [
      { slug: clean },
      { id: clean },
      { slug: withoutCat },
      { id: withCat },
      ...(mongoose.isValidObjectId(clean) ? [{ _id: clean }] : [])
    ]
  };
}

export async function GET(request, { params }) {
  const { slug } = await params;
  const clean = decodeURIComponent(String(slug || '')).trim();

  try {
    if (mongoose.connection.readyState === 1 || (await connectDB())) {
      const product = await Product.findOne(buildQuery(clean)).lean();
      if (product) return NextResponse.json(product);
    }
  } catch (error) {
    console.warn('MongoDB product lookup failed:', error.message);
  }

  const items = cloudCatalog.length ? cloudCatalog : localCatalog;
  const withoutCat = clean.replace(/^cat-/, '');
  const withCat = clean.startsWith('cat-') ? clean : `cat-${clean}`;
  const found = items.find(
    p => p.slug === clean || p.id === clean || p.slug === withoutCat || p.id === withCat
  );
  if (found) return NextResponse.json(found);

  return NextResponse.json({ message: 'Product not found' }, { status: 404 });
}

export async function PUT(request, { params }) {
  const { slug } = await params;
  const clean = decodeURIComponent(String(slug || '')).trim();

  let body = {};
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    for (const [key, val] of formData.entries()) {
      if (typeof val === 'string') {
        body[key] = val;
      }
    }
  } else {
    try {
      body = await request.json();
    } catch {
      body = {};
    }
  }

  const withoutCat = clean.replace(/^cat-/, '');
  const withCat = clean.startsWith('cat-') ? clean : `cat-${clean}`;

  try {
    const isConnected = mongoose.connection.readyState === 1 || (await connectDB());
    if (isConnected) {
      let existing = await Product.findOne(buildQuery(clean));
      if (!existing) {
        // Self-healing fallback from cloudCatalog/localCatalog
        const items = cloudCatalog.length ? cloudCatalog : localCatalog;
        const found = items.find(
          p => p.slug === clean || p.id === clean || p.slug === withoutCat || p.id === withCat
        );
        if (found) {
          existing = await Product.create({
            ...found,
            id: found.id || `prd-${clean}`,
            slug: found.slug || withoutCat
          });
        }
      }

      if (existing) {
        let imageUrls = existing.images || [];
        if (body.imageUrls) {
          try {
            const parsed = typeof body.imageUrls === 'string' ? JSON.parse(body.imageUrls) : body.imageUrls;
            if (Array.isArray(parsed) && parsed.length) imageUrls = parsed;
          } catch {
            imageUrls = String(body.imageUrls).split('\n').map(s => s.trim()).filter(Boolean);
          }
        }

        const chosenThumbnail = String(body.thumbnail || '').trim() || imageUrls[0] || existing.thumbnail;
        if (chosenThumbnail) {
          const foundIdx = imageUrls.findIndex(img => img.trim() === chosenThumbnail);
          if (foundIdx >= 0) {
            const matched = imageUrls[foundIdx];
            imageUrls = [matched, ...imageUrls.filter((_, idx) => idx !== foundIdx)];
          } else {
            imageUrls = [chosenThumbnail, ...imageUrls];
          }
        }

        existing.thumbnail = chosenThumbnail || imageUrls[0] || '';
        existing.images = imageUrls;
        if (body.name) existing.name = body.name.trim();
        if (body.description) existing.description = body.description.trim();
        if (body.category) existing.category = body.category.trim();
        if (body.categoryName) existing.categoryName = body.categoryName.trim();
        if (body.inStock !== undefined) existing.inStock = String(body.inStock) === 'true';
        if (body.isFeatured !== undefined) existing.isFeatured = String(body.isFeatured) === 'true';

        await existing.save();
        return NextResponse.json(existing);
      }
    }
  } catch (err) {
    console.warn('Next.js API PUT /api/products/[slug] error:', err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Product not found' }, { status: 404 });
}

export const PATCH = PUT;
