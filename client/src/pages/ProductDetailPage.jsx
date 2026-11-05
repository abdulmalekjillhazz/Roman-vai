import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SEOHead from '../components/public/SEOHead.jsx';
import { getWhatsAppInquiryLink } from '../utils/whatsappHelper.js';
import { CLIENT_INFO } from '../config/clientInfo.js';

export default function ProductDetailPage({ onOpenQuote }) {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
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
        <Link to="/" className="mt-5 px-5 py-2.5 bg-brand-charcoal text-white rounded-xl text-xs font-bold font-sans">
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
        title={`${product.name} Supplier in Dubai | CLASSICAL DECOR I D`}
        description={product.seoDescription || product.description}
        canonicalPath={`/product/${product.slug}`}
        product={product}
      />

      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-brand-muted mb-6">
          <Link to="/" className="hover:text-brand-charcoal transition">Catalog</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-brand-charcoal transition capitalize">
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
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition duration-300"
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
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
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
              <div className="mt-8 bg-brand-cream/60 rounded-2xl border border-brand-sand p-5 sm:p-6">
                <h3 className="font-display text-xs font-bold tracking-wider uppercase text-brand-charcoal pb-3 border-b border-brand-sand/80">
                  Architectural Specifications
                </h3>
                
                <dl className="mt-3.5 space-y-2.5 font-sans text-xs">
                  <div className="flex justify-between py-1 border-b border-brand-sand/40">
                    <dt className="text-brand-muted">Thickness Readout</dt>
                    <dd className="font-mono text-brand-charcoal font-semibold">{product.specifications?.thickness || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-brand-sand/40">
                    <dt className="text-brand-muted">Standard Dimensions</dt>
                    <dd className="font-mono text-brand-charcoal font-semibold">{product.specifications?.dimensions || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-brand-sand/40">
                    <dt className="text-brand-muted">Material Composition</dt>
                    <dd className="font-sans text-brand-charcoal font-medium text-right max-w-[60%]">{product.specifications?.material || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-brand-muted">Logistics / Dispatch</dt>
                    <dd className="font-sans text-emerald-700 font-semibold">Immediate Dubai & UAE Dispatch</dd>
                  </div>
                </dl>

                {product.specifications?.features && product.specifications.features.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-brand-sand/80">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-muted mb-2 font-sans">
                      Performance Features
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {product.specifications.features.map((feat, i) => (
                        <span key={i} className="bg-white border border-brand-sand text-brand-charcoal text-[11px] font-sans px-2.5 py-1 rounded-md">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Trade CTA Buttons */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
              <button
                onClick={() => onOpenQuote(`${product.name} (SKU: ${sku})`)}
                className="w-full py-3.5 px-4 rounded-xl border border-brand-charcoal bg-white hover:bg-brand-cream text-brand-charcoal text-xs font-sans font-bold tracking-wide transition shadow-sm"
              >
                Request Official Catalog & Quote
              </button>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-whatsapp hover:bg-emerald-600 text-white text-xs font-sans font-bold tracking-wide text-center transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>💬</span> 1-Click WhatsApp Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
