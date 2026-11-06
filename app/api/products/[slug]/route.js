import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import cloudCatalog from '../../../../data/products_cloudinary.json';
import localCatalog from '../../../../data/products_data.json';
import { connectDB } from '../../../../server/src/config/db.js';
import { Product } from '../../../../server/src/models/Product.js';

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    if (mongoose.connection.readyState === 1 || (await connectDB())) {
      const query = {
        $or: [
          { slug },
          { id: slug },
          ...(mongoose.isValidObjectId(slug) ? [{ _id: slug }] : [])
        ]
      };
      const product = await Product.findOne(query).lean();
      if (product) return NextResponse.json(product);
    }
  } catch (error) {
    console.warn('MongoDB product lookup failed:', error.message);
  }

  const items = cloudCatalog.length ? cloudCatalog : localCatalog;
  const found = items.find(p => p.slug === slug || p.id === slug);
  if (found) return NextResponse.json(found);

  return NextResponse.json({ message: 'Product not found' }, { status: 404 });
}

