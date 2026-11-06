import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import FallbackImage from './FallbackImage.jsx';
import { preloadProductCover } from '../../utils/imageCacheWarmup.js';

export default function ProductCard({
  product,
  onSelectProduct,
  priority = false,
  isHighlighted = false
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
      className={`group min-w-0 overflow-hidden rounded-2xl transition-all duration-300 ${
        isHighlighted
          ? 'border-2 border-amber-500/70 bg-gradient-to-b from-amber-50/40 via-white to-white shadow-md ring-1 ring-amber-400/25'
          : 'border border-stone-200/80 bg-white hover:border-amber-500/50 hover:shadow-lg'
      }`}
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
        {/* 100% Clean Image Hero Container - No Unneeded Text/Badges. Taller on Highlighted */}
        <div
          className={`relative w-full overflow-hidden bg-stone-100 ${
            isHighlighted
              ? 'aspect-[3/4] sm:aspect-[4/3]'
              : 'aspect-square sm:aspect-[4/3]'
          }`}
        >
          <FallbackImage
            key={currentImage}
            src={currentImage}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            cloudinaryWidth={isHighlighted ? 640 : 480}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 animate-fadeIn"
          />

          {/* Subtle Luxury Gradient Vignette on Hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Compact, Image-First Info Area with Strict Single-Line Title */}
        <div className="flex w-full flex-1 flex-col p-3 sm:p-4">
          <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[#8a6b36] truncate block">
            {product.categoryName || 'Architectural Material'}
          </span>
          <h3
            className={`mt-1 font-display text-xs sm:text-sm md:text-base font-bold truncate block ${
              isHighlighted ? 'text-amber-950 group-hover:text-amber-800' : 'text-stone-900 group-hover:text-amber-900'
            }`}
            title={product.name}
          >
            {product.name}
          </h3>
          <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 sm:pt-3 border-t border-stone-100">
            <span className="text-[11px] sm:text-xs text-stone-500 truncate">
              {specification || 'Specification Available'}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              size={15}
              className={`shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                isHighlighted ? 'text-amber-700 font-bold' : 'text-amber-800'
              }`}
            />
          </div>
        </div>
      </button>
    </article>
  );
}
