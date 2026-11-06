import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import SEOHead from '../components/public/SEOHead.jsx';
import FallbackImage from '../components/public/FallbackImage.jsx';
import { getWhatsAppInquiryLink } from '../utils/whatsappHelper.js';
import { CLIENT_INFO } from '../config/clientInfo.js';

export default function ProductDetailPage({ onOpenQuote, slug }) {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const fallbackImage = '/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp';

  useEffect(() => {
    setLoading(true);
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
    axios
      .get(`${apiBase}/products/${slug}`)
      .then(res => {
        setProduct(res.data);
        setSelectedImage(0);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans text-sm text-brand-muted">
        Loading technical specifications...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-display text-2xl font-bold text-brand-charcoal">Material Not Found</h2>
        <p className="font-sans text-sm text-brand-muted mt-2">The requested specification sheet could not be located.</p>
        <Link href="/" className="mt-5 px-5 py-2.5 bg-brand-charcoal text-white rounded-xl text-xs font-bold font-sans">
          Return to Trade Catalog
        </Link>
      </div>
    );
  }

  const sku = product.sku || product.pfcCode || product.id || 'N/A';
  const waLink = getWhatsAppInquiryLink({ product, category: product.categoryName });
  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="bg-brand-cream min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${product.name} | Premium Interior Material Supplier in Dubai, UAE`}
        description={product.seoDescription || `Discover ${product.name} by Classical Decor ID, a premium architectural material for Dubai and UAE residential, commercial, and hospitality projects.`}
        canonicalPath={`/product/${product.slug}`}
        product={product}
      />

      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-brand-muted mb-6">
          <Link href="/" className="hover:text-brand-charcoal transition">Catalog</Link>
          <span>/</span>
          <Link href={`/category/${product.category}`} className="hover:text-brand-charcoal transition capitalize">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="font-mono text-brand-charcoal">{sku}</span>
        </nav>

        {/* Product Specification Box */}
        <div className="bg-white rounded-3xl border border-brand-sand overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 p-6 sm:p-10">
          {/* Gallery View */}
          <div className="flex flex-col gap-4">
            <div className="relative h-80 sm:h-96 md:h-[420px] rounded-2xl bg-stone-100 overflow-hidden border border-brand-sand/50">
              <FallbackImage
                src={images[selectedImage] || images[0] || fallbackImage}
                alt={product.name}
                className="w-full h-full object-cover transition duration-300"
                fallbackSrc={fallbackImage}
              />
              <span className="absolute top-4 left-4 bg-brand-charcoal/90 backdrop-blur text-white font-mono text-[11px] px-3 py-1 rounded-md">
                SKU: {sku}
              </span>
              <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
                product.inStock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-600'
              }`}>
                {product.inStock ? '● UAE Warehouse Stock' : 'Pre-Order / Indent'}
              </span>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      selectedImage === idx ? 'border-brand-gold ring-2 ring-brand-gold/30' : 'border-brand-sand/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <FallbackImage src={img || fallbackImage} alt={`View ${idx + 1}`} className="w-full h-full object-cover" fallbackSrc={fallbackImage} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Millimeter Specifications */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-bronze font-bold">
                {product.categoryName}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-charcoal mt-1.5 leading-tight">
                {product.name}
              </h1>

              <p className="font-sans text-sm text-brand-muted mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Technical Spec Sheet Table */}
              <div className="mt-8 rounded-2xl border border-brand-sand bg-brand-cream/60 p-5 sm:p-6">
              <h3 className="border-b border-brand-sand/80 pb-3 font-display text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                Product Specifications
              </h3>

              <dl className="mt-3.5 space-y-2.5 font-sans text-xs">
                <div className="flex justify-between border-b border-brand-sand/40 py-1">
                  <dt className="text-brand-muted">Thickness</dt>
                  <dd className="font-mono font-semibold text-brand-charcoal">{product.specifications?.thickness || 'N/A'}</dd>
                </div>
                <div className="flex justify-between border-b border-brand-sand/40 py-1">
                  <dt className="text-brand-muted">Dimensions</dt>
                  <dd className="font-mono font-semibold text-brand-charcoal">{product.specifications?.dimensions || 'N/A'}</dd>
                </div>
                <div className="flex justify-between border-b border-brand-sand/40 py-1">
                  <dt className="text-brand-muted">Material</dt>
                  <dd className="max-w-[60%] text-right font-sans font-medium text-brand-charcoal">{product.specifications?.material || 'N/A'}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-brand-muted">Delivery</dt>
                  <dd className="font-sans font-semibold text-emerald-700">Dubai & UAE delivery support</dd>
                </div>
              </dl>

              {product.specifications?.features && product.specifications.features.length > 0 && (
                <div className="mt-4 border-t border-brand-sand/80 pt-4">
                  <h4 className="mb-2 font-sans text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                    Key Features
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.specifications.features.map((feat, i) => (
                      <span key={i} className="rounded-md border border-brand-sand bg-white px-2.5 py-1 font-sans text-[11px] text-brand-charcoal">
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3.5 pt-4 sm:grid-cols-2">
              <button
                onClick={() => onOpenQuote(`${product.name} (SKU: ${sku})`)}
                className="w-full rounded-xl border border-brand-charcoal bg-white px-4 py-3.5 text-xs font-sans font-bold tracking-wide text-brand-charcoal shadow-sm transition hover:bg-brand-cream"
              >
                Request official catalog & quote
              </button>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-whatsapp px-4 py-3.5 text-center text-xs font-sans font-bold tracking-wide text-white shadow-sm transition hover:bg-emerald-600"
              >
                <span>💬</span> 1-click WhatsApp quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
