import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import FallbackImage from './FallbackImage.jsx';
import { preloadProductCover } from '../../utils/imageCacheWarmup.js';

export default function ProductCard({
  product,
  onSelectProduct,
  priority = false,
  isFeatured = false
}) {
  const cardRef = useRef(null);
  const [isInView, setIsInView] = useState(priority);

  useEffect(() => {
    if (priority) return;
    const currentRef = cardRef.current;
    if (!currentRef) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '60px 0px', threshold: 0.05 }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [priority]);

  const images = Array.isArray(product?.images) && product.images.length ? product.images : [];
  const primaryImage = product?.thumbnail || images[0] || '/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp';
  const secondaryImage = images.length > 1 ? images[1] : null;

  const specification = product?.specifications?.thickness || product?.thickness
    || product?.specifications?.dimensions || product?.dimensions;

  return (
    <article
      ref={cardRef}
      className={`material-card group min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white transition-all duration-700 ease-out hover:shadow-2xl hover:border-[#E5A924]/60 ${
        isFeatured ? 'sm:col-span-2 md:col-span-2 md:row-span-2' : ''
      } ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      onTouchStart={() => preloadProductCover(product)}
    >
      <button
        type="button"
        onClick={() => onSelectProduct(product)}
        aria-label={`Explore ${product.name} specifications and finishes`}
        className="flex h-full w-full flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-amber-700"
      >
        {/* Image Container with Smooth Double-Layer CSS Crossfade & Option B Signature Gold Vignette */}
        <div
          className={`relative w-full overflow-hidden bg-stone-100 ${
            isFeatured
              ? 'aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/11]'
              : 'aspect-[16/10] sm:aspect-[4/3]'
          }`}
        >
          {/* Featured Bento Architectural Tag */}
          {isFeatured && (
            <div className="absolute top-3.5 left-3.5 z-20">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-950/85 backdrop-blur-md border border-[#E5A924]/40 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#E5A924] shadow-md">
                <Sparkles size={11} className="text-[#E5A924]" />
                Featured Collection
              </span>
            </div>
          )}

          {/* Primary Base Image */}
          <FallbackImage
            src={primaryImage}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            cloudinaryWidth={isFeatured ? 1080 : 720}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Secondary Finish Image (Crossfade on Hover - Smooth CSS Opacity) */}
          {secondaryImage && (
            <FallbackImage
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              loading="lazy"
              decoding="async"
              cloudinaryWidth={isFeatured ? 1080 : 720}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-600 ease-out group-hover:opacity-100 transition-transform duration-700 group-hover:scale-105"
            />
          )}

          {/* Option B: Ambient Gold Duotone Vignette on Hover */}
          <div className="pointer-events-none absolute inset-0 ambient-gold-vignette opacity-0 transition-opacity duration-400 ease-out group-hover:opacity-100 z-10" />

          {/* Option B: Ambient Floating Specification Pill Reveal on Hover */}
          <div className="pointer-events-none absolute bottom-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[10px] font-mono font-bold tracking-wider text-stone-900 shadow-sm border border-stone-200/80">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E5A924] animate-pulse" />
              {specification || 'Official Specification'}
            </span>
            <span className="rounded-full bg-stone-950/85 px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-[#E5A924] backdrop-blur-md border border-white/10">
              Explore →
            </span>
          </div>
        </div>

        {/* Info Typography Area */}
        <div className="flex w-full flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-brand-bronzeDark truncate block">
              {product.categoryName || 'Architectural Material'}
            </span>
            {product.inStock === false && (
              <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                Made to order
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.12em] text-stone-400">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E5A924]" />
            <span>{isFeatured ? 'Selected specification' : 'Trade specification'}</span>
          </div>

          <h3
            className={`mt-1 font-display font-bold text-stone-900 group-hover:text-amber-900 leading-snug ${
              isFeatured ? 'text-lg sm:text-2xl' : 'text-base sm:text-lg'
            }`}
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Detailed description snippet for Featured Bento Card */}
          {isFeatured && product.description && (
            <p className="mt-2 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mt-auto pt-3.5 flex items-center justify-between gap-3 border-t border-stone-100">
            <span className="text-xs text-stone-500 truncate font-sans">
              {specification || 'Specification Available'}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-bronzeDark group-hover:text-amber-800 transition">
              <span className="hidden sm:inline text-[11px] font-mono uppercase tracking-wider">Specs</span>
              <ArrowUpRight
                aria-hidden="true"
                size={17}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-amber-800"
              />
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
