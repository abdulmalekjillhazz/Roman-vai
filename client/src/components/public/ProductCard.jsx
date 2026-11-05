import React from 'react';

export default function ProductCard({ product, onSelectProduct }) {
  const images = product.images || [];
  const thumbnail =
    images.length > 0
      ? images[0]
      : '/assets/decorforall/018a73771c6dbbc65d2f905d.webp';

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="bg-white/95 backdrop-blur-xs rounded-2xl border border-white/90 ring-1 ring-black/5 p-2.5 sm:p-3 floating-card cursor-pointer flex flex-col group text-left"
    >
      {/* Square Architectural Photo Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 shadow-inner">
        <img
          src={thumbnail}
          alt={`${product.name} architectural surface Dubai`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Gallery Image Counter Badge */}
        {images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-sans font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <span>📷</span>
            <span>{images.length} Photos</span>
          </span>
        )}

        {/* Optional Red 'NEW' Badge */}
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-[#e02424] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md tracking-wider">
            NEW
          </span>
        )}
      </div>

      {/* Card Info - Clean Luxury Floating Styling */}
      <div className="pt-2.5 pb-1 px-1 flex flex-col items-center text-center">
        <h3
          className="font-sans font-bold text-xs sm:text-[13px] text-stone-900 truncate w-full group-hover:text-amber-800 transition"
          title={product.name}
        >
          {product.name}
        </h3>
        <span className="text-[11px] text-stone-500 font-sans mt-0.5 truncate max-w-full">
          {product.categoryName || 'Architectural Surface'}
        </span>
      </div>
    </div>
  );
}
