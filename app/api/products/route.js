import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import cloudCatalog from '../../../data/products_cloudinary.json';
import localCatalog from '../../../data/products_data.json';
import { connectDB } from '../../../server/src/config/db.js';
import { Product } from '../../../server/src/models/Product.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  try {
    if (mongoose.connection.readyState === 1 || (await connectDB())) {
      const filter = {};
      if (category && category !== 'all') filter.category = category;
      if (featured === 'true') filter.isFeatured = true;
      if (search) {
        const literalSearch = String(search).slice(0, 150).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = [
          { name: { $regex: literalSearch, $options: 'i' } },
          { description: { $regex: literalSearch, $options: 'i' } }
        ];
      }
      const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
      if (products.length > 0) {
        return NextResponse.json(products);
      }
    }
  } catch (error) {
    console.warn('MongoDB query failed, serving static catalog:', error.message);
  }

  // Fallback to static catalog (resilient zero-downtime)
  let items = cloudCatalog.length ? cloudCatalog : localCatalog;
  if (category && category !== 'all') {
    items = items.filter(p => p.category === category);
  }
  if (featured === 'true') {
    items = items.filter(p => p.isFeatured);
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
    );
  }

  return NextResponse.json(items);
}

