import React from 'react';

export default function ProductCard({ product, onSelectProduct }) {
  const images = product.images || [];
  const thumbnail =
    images.length > 0
      ? images[0]
      : '/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp';

  const thickness = product.specifications?.thickness || product.thickness || 'Custom';
  const material = product.specifications?.material || product.material || 'Premium finish';

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group flex cursor-pointer flex-col rounded-2xl border border-stone-200 bg-white/95 p-2.5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg sm:p-3"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-100 shadow-inner">
        <img
          src={thumbnail}
          alt={`${product.name} architectural surface Dubai`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
        />

        {images.length > 1 && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-sans font-medium text-white shadow-sm backdrop-blur-xs">
            <span>📷</span>
            <span>{images.length} Photos</span>
          </span>
        )}

        {product.isNew && (
          <span className="absolute right-2 top-2 rounded-full bg-[#e02424] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-md">
            NEW
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-2.5">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.18em] text-amber-700">
          {product.categoryName || 'Architectural Surface'}
        </span>

        <h3
          className="mt-1 truncate text-xs font-sans font-bold text-stone-900 transition group-hover:text-amber-800 sm:text-[13px]"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-1 text-[10px] font-medium text-stone-700">
            {thickness}
          </span>
          <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-1 text-[10px] font-medium text-stone-700">
            {material}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.12em] text-stone-500">
            Trade ready
          </span>
          <span className="text-[10px] font-sans font-bold text-emerald-600">
            {product.inStock === false ? 'Backorder' : 'In stock'}
          </span>
        </div>
      </div>
    </div>
  );
}
