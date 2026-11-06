import React, { useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import FallbackImage from './FallbackImage.jsx';
import { preloadProductFinishes } from '../../utils/imageCacheWarmup.js';

export default function ProductCard({ product, onSelectProduct, priority = false }) {
  const images = product?.images?.length ? product.images : [];
  // The primary thumbnail is fixed by admin (thumbnail property or 1st image)
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseEnter() {
    setIsHovered(true);
    // Instant background preload of all finish variations for this product
    preloadProductFinishes(product);
    // Preview second finish on hover if available
    if (images.length > 1) {
      setActiveImgIndex(1);
    }
  }

  function handleMouseLeave() {
    setIsHovered(false);
    // Always revert to the designated admin primary thumbnail
    setActiveImgIndex(0);
  }

  const specification = product.specifications?.thickness || product.thickness
    || product.specifications?.dimensions || product.dimensions;

  // Designated cover thumbnail is always index 0 / product.thumbnail
  const currentImage = images[activeImgIndex] || product.thumbnail || images[0];

  return (
    <article
      className="group min-w-0 overflow-hidden rounded-2xl border border-stone-200/80 bg-white transition-all duration-300 hover:shadow-lg hover:border-amber-500/50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => preloadProductFinishes(product)}
    >
      <button
        type="button"
        onClick={() => onSelectProduct(product)}
        aria-label={`Explore ${product.name} finishes`}
        className="flex h-full w-full flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-amber-700"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
          <FallbackImage
            key={currentImage}
            src={currentImage}
            alt={`${product.name} finish ${activeImgIndex + 1}`}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            cloudinaryWidth={480}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 animate-fadeIn"
          />

          {/* Luxury Gradient Vignette on Hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Dynamic Finish Counter Pill */}
          {images.length > 1 && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full border border-white/25 bg-black/60 px-2 py-0.5 text-[10px] font-mono text-white/95 backdrop-blur-md shadow-xs">
              <span className="text-[#E5A924] font-bold">
                {activeImgIndex === 0 ? '★ Cover' : `#${activeImgIndex + 1}`}
              </span>
              <span className="text-white/40">/</span>
              <span>{images.length}</span>
              <span className="hidden sm:inline text-[9px] text-stone-300 ml-0.5">Finishes</span>
            </div>
          )}

          {/* Quick Hover Hint */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="rounded-lg bg-black/75 px-2.5 py-1 text-[10px] font-semibold text-[#f5ebd7] backdrop-blur-md flex items-center gap-1">
              <Sparkles size={11} className="text-[#E5A924]" />
              <span>Inspect All Finishes</span>
            </span>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col p-4 sm:p-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-[#8a6b36]">
            {product.categoryName || 'Architectural Material'}
          </span>
          <h3 className="mt-1.5 font-display text-sm font-bold leading-snug text-stone-900 group-hover:text-amber-900 sm:text-base">
            {product.name}
          </h3>
          <div className="mt-auto flex items-center justify-between gap-3 pt-3.5 border-t border-stone-100">
            <span className="text-xs text-stone-500 truncate">{specification || `${images.length} Luxury Finishes`}</span>
            <ArrowUpRight aria-hidden="true" size={17} className="shrink-0 text-amber-800 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </button>
    </article>
  );
}
