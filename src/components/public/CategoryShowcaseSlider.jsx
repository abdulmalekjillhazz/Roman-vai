import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { getWhatsAppInquiryLink } from '../../utils/whatsappHelper.js';
import { CLIENT_INFO } from '../../config/clientInfo.js';

export default function CategoryShowcaseSlider({ products = [], activeCategory = 'all', onOpenQuote }) {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImg, setLightboxImg] = useState(null);

  // Filter items matching active category or all
  const displayItems = products.filter(p => 
    activeCategory === 'all' ? true : p.category === activeCategory
  );

  // Track scroll position to update current index indicator
  function handleScroll() {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth } = sliderRef.current;
    const cardWidth = 340; // approx card width + gap
    const newIdx = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(Math.min(Math.max(newIdx, 0), displayItems.length - 1));
  }

  // Mouse drag handlers for desktop
  function handleMouseDown(e) {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  }

  function handleMouseMove(e) {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.6; // multiplier for smooth drag speed
    sliderRef.current.scrollLeft = scrollLeft - walk;
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  // Arrow controls
  function scrollByDirection(dir) {
    if (!sliderRef.current) return;
    const offset = dir === 'next' ? 360 : -360;
    sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  }

  if (displayItems.length === 0) return null;

  return (
    <div className="w-full bg-white py-10 px-4 sm:px-6 lg:px-8 border-y border-brand-sand/60 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">
        {/* Slider Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-brand-gold font-bold">
                Interactive Material Visualizer
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-brand-charcoal mt-1">
              Drag & Explore Architectural Textures
            </h2>
            <p className="font-sans text-xs text-brand-muted mt-1">
              Drag with mouse or swipe on touch screen to browse high-definition materials.
            </p>
          </div>

          {/* Navigation Controls & Index Counter */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-brand-muted bg-brand-cream px-3 py-1.5 rounded-full border border-brand-sand/70">
              <strong className="text-brand-charcoal">{String(currentIndex + 1).padStart(2, '0')}</strong> / {String(displayItems.length).padStart(2, '0')}
            </span>

            <div className="flex gap-1.5">
              <button
                onClick={() => scrollByDirection('prev')}
                aria-label="Previous Material"
                className="w-9 h-9 rounded-full border border-brand-sand bg-white hover:bg-brand-gold hover:text-white hover:border-brand-gold transition flex items-center justify-center text-sm font-bold shadow-sm"
              >
                ←
              </button>
              <button
                onClick={() => scrollByDirection('next')}
                aria-label="Next Material"
                className="w-9 h-9 rounded-full border border-brand-sand bg-white hover:bg-brand-gold hover:text-white hover:border-brand-gold transition flex items-center justify-center text-sm font-bold shadow-sm"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Draggable Carousel Track */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex gap-5 overflow-x-auto pb-4 scrollbar-none scroll-smooth ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayItems.map((item, index) => {
            const waLink = getWhatsAppInquiryLink({
              product: item,
              category: item.categoryName
            });
            const sku = item.sku || item.pfcCode || item.id || `PFC-${index + 1}`;

            return (
              <div
                key={item.id || index}
                className="w-[280px] sm:w-[330px] shrink-0 bg-brand-cream/40 rounded-2xl border border-brand-sand overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Canvas with Click-to-Zoom */}
                <div className="relative h-56 sm:h-64 bg-stone-100 overflow-hidden">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    draggable="false"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button
                      onClick={() => setLightboxImg(item.images?.[0])}
                      className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-[11px] font-sans font-bold text-brand-charcoal hover:bg-brand-gold hover:text-white transition shadow"
                    >
                      🔍 Fullscreen Texture View
                    </button>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span className="bg-brand-charcoal/90 text-white font-sans text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md backdrop-blur">
                      {item.categoryName}
                    </span>
                    <span className="bg-white/90 text-brand-charcoal font-mono text-[9px] px-2 py-0.5 rounded border border-brand-sand/60">
                      SKU: {sku}
                    </span>
                  </div>

                  <span className="absolute top-3 right-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ● UAE Stock
                  </span>
                </div>

                {/* Specs Readout */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="font-display font-bold text-base text-brand-charcoal hover:text-brand-bronze transition leading-snug">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-sans bg-white p-2.5 rounded-xl border border-brand-sand/50">
                      <div>
                        <span className="text-stone-400 block text-[10px]">Thickness</span>
                        <span className="font-mono font-bold text-brand-charcoal">{item.specifications?.thickness || 'Standard'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px]">Dimensions</span>
                        <span className="font-mono font-bold text-brand-charcoal">{item.specifications?.dimensions || '1200x2400mm'}</span>
                      </div>
                    </div>
                  </div>

                  {/* NO CART ICON - DIRECT BOOKING & WHATSAPP ONLY */}
                  <div className="mt-5 grid grid-cols-2 gap-2 pt-2 border-t border-brand-sand/40">
                    <button
                      onClick={() => onOpenQuote(`${item.name} (SKU: ${sku})`)}
                      className="w-full py-2.5 px-3 bg-brand-charcoal hover:bg-stone-800 text-white text-xs font-sans font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>📦</span>
                      <span>Book Sample</span>
                    </button>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 bg-brand-whatsapp hover:bg-emerald-600 text-white text-xs font-sans font-bold rounded-xl text-center transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>💬</span>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={lightboxImg}
              alt="Architectural Material Fullscreen Texture"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-12 right-0 text-white text-3xl font-light hover:text-brand-gold transition"
            >
              ✕
            </button>
            <div className="text-center mt-3 text-stone-300 text-xs font-sans">
              Click anywhere to close texture preview
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
