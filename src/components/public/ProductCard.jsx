import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import FallbackImage from './FallbackImage.jsx';

export default function ProductCard({ product, onSelectProduct }) {
  const specification = product.specifications?.thickness || product.thickness
    || product.specifications?.dimensions || product.dimensions;

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
      <button
        type="button"
        onClick={() => onSelectProduct(product)}
        aria-label={`Explore ${product.name}`}
        className="flex h-full w-full flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-amber-700"
      >
        <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
          <FallbackImage
            src={product.images?.[0]}
            alt={`${product.name} material and finish`}
            loading="lazy"
            decoding="async"
            cloudinaryWidth={480}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          />
        </div>
        <div className="flex w-full flex-1 flex-col p-4 sm:p-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-500">
            {product.categoryName || 'Architectural material'}
          </span>
          <h3 className="mt-2 text-sm font-semibold leading-relaxed text-stone-900 sm:text-base">{product.name}</h3>
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <span className="text-xs text-stone-600">{specification || 'Explore finishes & specifications'}</span>
            <ArrowUpRight aria-hidden="true" size={18} className="shrink-0 text-amber-800 transition-transform group-hover:-translate-y-0.5 motion-reduce:transform-none" />
          </div>
        </div>
      </button>
    </article>
  );
}
