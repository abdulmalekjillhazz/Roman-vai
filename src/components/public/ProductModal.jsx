import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MessageCircle, X, ArrowUpRight, Info } from 'lucide-react';
import FallbackImage, { optimizedCloudinaryUrl } from './FallbackImage.jsx';
import useModalDialog from '../../hooks/useModalDialog.js';
import { CLIENT_INFO } from '../../config/clientInfo.js';

export default function ProductModal({ product, isOpen, onClose, onOpenQuote }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const dragStart = useRef(null);
  const thumbnailStrip = useRef(null);
  const images = product?.images?.length ? product.images : [undefined];
  const dialogRef = useModalDialog(Boolean(isOpen && product), onClose, event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      moveImage(event.key === 'ArrowRight' ? 1 : -1);
    }
  });

  useEffect(() => {
    setActiveImageIndex(0);
    setDragOffset(0);
    dragStart.current = null;
    setShowMobileDetails(false);
  }, [product, isOpen]);

  useEffect(() => {
    if (!isOpen || images.length < 2) return undefined;

    const timer = window.setTimeout(() => {
      const nextSource = images[(activeImageIndex + 1) % images.length];
      if (!nextSource) return;

      const image = new window.Image();
      image.decoding = 'async';
      image.fetchPriority = 'low';
      image.src = optimizedCloudinaryUrl(nextSource, 1200);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [activeImageIndex, images, isOpen]);

  useEffect(() => {
    const strip = thumbnailStrip.current;
    const active = strip?.children[activeImageIndex];
    if (strip && active) {
      strip.scrollTo({ left: active.offsetLeft - strip.offsetLeft - (strip.clientWidth - active.clientWidth) / 2, behavior: 'auto' });
    }
  }, [activeImageIndex, isOpen]);

  function moveImage(direction) {
    setActiveImageIndex(index => (index + direction + images.length) % images.length);
  }
  function handlePointerDown(event) {
    if (images.length < 2 || (event.pointerType === 'mouse' && event.button !== 0)) return;
    dragStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function handlePointerMove(event) {
    if (!dragStart.current) return;
    const dx = event.clientX - dragStart.current.x;
    const dy = event.clientY - dragStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) setDragOffset(Math.max(-80, Math.min(80, dx)));
  }
  function handlePointerEnd(event) {
    const drag = dragStart.current;
    dragStart.current = null;
    setDragOffset(0);
    if (!drag || event.type === 'pointercancel') return;
    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(event.clientY - drag.y)) moveImage(dx < 0 ? 1 : -1);
  }

  if (!isOpen || !product) return null;
  const specifications = [
    { label: 'Thickness', value: product.specifications?.thickness || product.thickness },
    { label: 'Dimensions', value: product.specifications?.dimensions || product.dimensions },
    { label: 'Material', value: product.specifications?.material || product.material },
    { label: 'Availability', value: product.inStock === true ? 'In stock' : product.inStock === false ? 'Available to order' : 'Please confirm with our team' }
  ].filter(item => item.value);
  const features = product.specifications?.features || product.features || [];
  const waLink = `https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent(
    `Hello Classical Decor ID, I am interested in ${product.name}. Please share finish options, specifications and sample availability.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
        tabIndex={-1}
        className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-48px)] sm:rounded-3xl"
        onClick={event => event.stopPropagation()}
      >
        <button type="button" onClick={onClose} aria-label="Close product details" className="absolute right-3 top-3 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-black/75 text-white hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">
          <X size={20} />
        </button>
        <div className="min-h-0 overflow-y-auto overscroll-contain lg:grid lg:grid-cols-[1.1fr_1fr]">
          <div className="min-w-0 bg-stone-100 lg:sticky lg:top-0 lg:self-start">
            <div
              className="relative h-[48dvh] min-h-64 touch-pan-y select-none overflow-hidden bg-stone-100 sm:h-[50dvh] lg:h-[55dvh] lg:max-h-[540px]"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
            >
              <FallbackImage
                key={images[activeImageIndex] || images[0]}
                src={images[activeImageIndex] || images[0]}
                alt={`${product.name} finish`}
                cloudinaryWidth={1200}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                draggable={false}
                className="h-full w-full object-contain"
                style={{ transform: `translateX(${dragOffset}px)` }}
              />

              {/* Image Counter & Type Badge on Top Left */}
              <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-white/25 bg-black/70 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md shadow-md">
                {activeImageIndex === 0 ? (
                  <>
                    <span className="text-[#E5A924] font-bold">★ Cover Thumbnail</span>
                    {images.length > 1 && <span className="text-white/40">· 1/{images.length}</span>}
                  </>
                ) : (
                  <>
                    <span className="text-stone-300 font-bold">Finish #{activeImageIndex + 1}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-[#E5A924]">{activeImageIndex + 1}/{images.length}</span>
                  </>
                )}
              </div>

              {/* Mobile View: Small Button on Top of Image to View Details */}
              <button
                type="button"
                onClick={() => setShowMobileDetails(true)}
                className="lg:hidden absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-full border border-white/35 bg-black/70 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-black active:scale-95"
              >
                <Info size={14} className="text-[#E5A924]" />
                <span>Specs & Details</span>
              </button>

              {images.length > 1 && <>
                <button type="button" onPointerDown={event => event.stopPropagation()} onClick={() => moveImage(-1)} aria-label="Previous product image" className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white hover:bg-black z-20"><ChevronLeft size={22} /></button>
                <button type="button" onPointerDown={event => event.stopPropagation()} onClick={() => moveImage(1)} aria-label="Next product image" className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white hover:bg-black z-20"><ChevronRight size={22} /></button>
              </>}
            </div>

            {/* Thumbnail Previews Strip with Numbered Selection */}
            {images.length > 1 && (
              <div ref={thumbnailStrip} aria-label="Product image previews" className="relative flex gap-2.5 overflow-x-auto border-t border-stone-200 p-3 bg-white sm:bg-stone-100">
                {images.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Show ${product.name} finish ${index + 1}`}
                    aria-pressed={activeImageIndex === index}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      activeImageIndex === index
                        ? 'border-[#E5A924] ring-2 ring-[#E5A924]/40 scale-105 shadow-md'
                        : 'border-transparent opacity-65 hover:opacity-100 hover:scale-102'
                    }`}
                  >
                    <FallbackImage src={src} alt="" loading={Math.abs(index - activeImageIndex) <= 1 ? 'eager' : 'lazy'} fetchPriority="low" decoding="async" cloudinaryWidth={160} className="h-full w-full object-cover" />
                    <span className={`absolute bottom-0 inset-x-0 text-center text-[9px] font-mono font-bold py-0.5 leading-none backdrop-blur-xs ${
                      index === 0
                        ? 'bg-[#E5A924] text-stone-950'
                        : 'bg-black/60 text-white'
                    }`}>
                      {index === 0 ? '★ 1st' : `#${index + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Mobile View Summary Bar: Clean Title & Quick Button */}
            <div className="lg:hidden flex items-center justify-between border-t border-stone-200/80 bg-white px-4 py-3">
              <div className="min-w-0 pr-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E5A924] truncate">
                  {product.categoryName || product.categoryGroup || 'Architectural materials'}
                </p>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-950 truncate mt-0.5">
                  {product.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileDetails(true)}
                className="shrink-0 flex items-center gap-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 px-3.5 py-2 text-xs font-bold text-stone-800 transition"
              >
                <span>Full Details</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Desktop View Column: Side-by-Side (Unchanged for PC) */}
          <div className="hidden lg:block p-8 pt-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">{product.categoryName || product.categoryGroup || 'Architectural materials'}</p>
            <h2 id="product-dialog-title" className="mt-2 font-serif text-3xl leading-tight text-stone-950 sm:text-4xl">{product.name}</h2>
            {product.description && <p className="mt-4 text-sm leading-relaxed text-stone-600">{product.description}</p>}
            <h3 className="mb-1 mt-7 text-xs font-semibold uppercase tracking-[0.13em] text-stone-900">Key specifications</h3>
            <dl className="divide-y divide-stone-200">
              {specifications.map(item => <div key={item.label} className="grid grid-cols-[100px_1fr] gap-4 py-3 text-sm">
                <dt className="text-stone-500">{item.label}</dt><dd className="break-words text-stone-900">{item.value}</dd>
              </div>)}
            </dl>
            {features.length > 0 && <ul className="mt-5 list-disc space-y-2 pl-4 text-sm leading-relaxed text-stone-600">{features.map((feature, index) => <li key={index}>{feature}</li>)}</ul>}
            
            {/* UAE B2B Quality & Compliance Badges */}
            <div className="mt-5 grid grid-cols-1 gap-2 rounded-2xl border border-amber-200/60 bg-amber-50/40 p-3.5 text-[11px] text-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-[#8a6b36] font-bold">🛡️ Fire Rating:</span>
                <span className="font-medium text-stone-700">Class A / B1 Flame Retardant Options</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8a6b36] font-bold">💧 Endurance:</span>
                <span className="font-medium text-stone-700">100% Moisture Proof & Termite Resistant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8a6b36] font-bold">⚡ Supply:</span>
                <span className="font-medium text-stone-700">Immediate UAE Warehouse Stock · Fast Dispatch</span>
              </div>
            </div>

            <div className="mt-6 border-t border-stone-200 pt-4">
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-950 transition group"
              >
                <span>View Full Architectural Page & All Finishes</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Up Full Details Sheet (Opens when user taps button on image or title) */}
        <div
          className={`lg:hidden absolute inset-0 z-30 flex flex-col bg-white transition-transform duration-300 ease-in-out ${
            showMobileDetails ? 'translate-y-0' : 'translate-y-full pointer-events-none'
          }`}
        >
          {/* Mobile Sheet Top Bar */}
          <div className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-stone-50 px-4 py-3.5">
            <div className="min-w-0 pr-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#E5A924] truncate">
                {product.categoryName || product.categoryGroup || 'Architectural materials'}
              </p>
              <h3 className="font-serif text-base font-bold text-stone-950 truncate">
                {product.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowMobileDetails(false)}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-stone-200/80 px-3.5 py-1.5 text-xs font-bold text-stone-800 hover:bg-stone-300 transition"
            >
              <X size={14} />
              <span>Back to Photos</span>
            </button>
          </div>

          {/* Mobile Sheet Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div>
              <h4 className="font-serif text-2xl font-semibold text-stone-950 leading-tight">
                {product.name}
              </h4>
              {product.description && (
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600">
                  {product.description}
                </p>
              )}
            </div>

            {specifications.length > 0 && (
              <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-900">
                  Key Specifications
                </h4>
                <dl className="divide-y divide-stone-200/70">
                  {specifications.map(item => (
                    <div key={item.label} className="grid grid-cols-[100px_1fr] gap-2 py-2.5 text-xs sm:text-sm">
                      <dt className="text-stone-500 font-medium">{item.label}</dt>
                      <dd className="break-words font-semibold text-stone-900">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {features.length > 0 && (
              <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-900">
                  Features & Characteristics
                </h4>
                <ul className="list-disc space-y-1.5 pl-4 text-xs sm:text-sm text-stone-600">
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* UAE B2B Quality & Compliance Badges */}
            <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4 space-y-2 text-xs text-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-[#8a6b36] font-bold">🛡️ Fire Rating:</span>
                <span className="font-medium text-stone-700">Class A / B1 Flame Retardant Options</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8a6b36] font-bold">💧 Endurance:</span>
                <span className="font-medium text-stone-700">100% Moisture Proof & Termite Resistant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8a6b36] font-bold">⚡ Supply:</span>
                <span className="font-medium text-stone-700">Immediate UAE Warehouse Stock · Fast Dispatch</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="flex items-center justify-between rounded-xl border border-stone-200 p-3.5 text-xs font-bold text-amber-800 hover:bg-stone-50 transition"
              >
                <span>View Full Architectural Page & All Finishes</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          {/* Quick Tap to Return Bar */}
          <div className="border-t border-stone-200 p-3 bg-stone-50 text-center">
            <button
              type="button"
              onClick={() => setShowMobileDetails(false)}
              className="w-full py-2 text-xs font-bold text-stone-600 hover:text-stone-950 uppercase tracking-wider"
            >
              ↑ Tap to Return to Photos ↑
            </button>
          </div>
        </div>

        {/* Fixed Bottom Action Bar: Always Clickable on Mobile & PC */}
        <div className="shrink-0 border-t border-stone-200 bg-white p-3 sm:p-5 relative z-40">
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#176846] px-3 py-3 text-xs font-semibold text-white transition hover:bg-[#125438] sm:text-sm"><MessageCircle size={18} />Contact on WhatsApp</a>
            <button type="button" onClick={() => { onClose(); onOpenQuote?.(product.name); }} className="min-h-11 rounded-xl bg-[#ead8b0] px-3 py-3 text-xs font-semibold text-stone-900 transition hover:bg-[#dfc596] sm:text-sm">Request Sample / Booking</button>
          </div>
        </div>
      </div>
    </div>
  );
}
