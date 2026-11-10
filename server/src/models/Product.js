import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    category: { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    description: { type: String, required: true },
    specifications: {
      thickness: { type: String, default: 'Standard' },
      dimensions: { type: String, default: 'Custom' },
      material: { type: String, default: 'Composite' },
      features: [{ type: String }]
    },
    images: [{ type: String, required: true }],
    thumbnail: { type: String },
    cloudinaryImages: [
      {
        public_id: String,
        secure_url: String,
        format: String
      }
    ],
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String }
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
