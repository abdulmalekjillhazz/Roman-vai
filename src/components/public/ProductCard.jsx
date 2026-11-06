import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import FallbackImage from './FallbackImage.jsx';
import { preloadProductCover } from '../../utils/imageCacheWarmup.js';

export default function ProductCard({
  product,
  onSelectProduct,
  priority = false
}) {
  const images = product?.images?.length ? product.images : [];
  // The primary thumbnail is fixed by admin (thumbnail property or 1st image)
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  function handleMouseEnter() {
    // Preview second finish on desktop hover if available
    if (images.length > 1) {
      setActiveImgIndex(1);
    }
  }

  function handleMouseLeave() {
    // Revert to primary thumbnail
    setActiveImgIndex(0);
  }

  const specification = product.specifications?.thickness || product.thickness
    || product.specifications?.dimensions || product.dimensions;

  const currentImage = images[activeImgIndex] || product.thumbnail || images[0];

  return (
    <article
      className="group min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white transition-all duration-300 hover:shadow-xl hover:border-amber-500/60"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => preloadProductCover(product)}
    >
      <button
        type="button"
        onClick={() => onSelectProduct(product)}
        aria-label={`Explore ${product.name} finishes`}
        className="flex h-full w-full flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-amber-700"
      >
        {/* Full-Width YouTube Feed-Style Image (16:10 Cinematic on Mobile) - 100% Clean & Zero Overlay Badges */}
        <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-stone-100">
          <FallbackImage
            key={currentImage}
            src={currentImage}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            cloudinaryWidth={720}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-106 animate-fadeIn"
          />

          {/* Subtle Luxury Gradient Vignette on Hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Info Area - Clean Single-Line Typography, No Numbers */}
        <div className="flex w-full flex-1 flex-col p-4 sm:p-5">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-[#8a6b36] truncate block">
            {product.categoryName || 'Architectural Material'}
          </span>
          <h3
            className="mt-1 font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-amber-900 truncate block"
            title={product.name}
          >
            {product.name}
          </h3>
          <div className="mt-3 flex items-center justify-between gap-3 pt-3 border-t border-stone-100">
            <span className="text-xs text-stone-500 truncate">
              {specification || 'Specification Available'}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              size={17}
              className="shrink-0 text-amber-800 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </button>
    </article>
  );
}
