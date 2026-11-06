import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, X } from 'lucide-react';
import FallbackImage from './FallbackImage.jsx';
import useModalDialog from '../../hooks/useModalDialog.js';
import { CLIENT_INFO } from '../../config/clientInfo.js';

export default function ProductModal({ product, isOpen, onClose, onOpenQuote }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
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
  }, [product, isOpen]);

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
        <button type="button" onClick={onClose} aria-label="Close product details" className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/75 text-white hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">
          <X size={20} />
        </button>
        <div className="min-h-0 overflow-y-auto overscroll-contain lg:grid lg:grid-cols-[1.1fr_1fr]">
          <div className="min-w-0 bg-stone-100 lg:sticky lg:top-0 lg:self-start">
            <div
              className="relative h-[32dvh] min-h-44 touch-pan-y select-none overflow-hidden bg-stone-100 sm:h-[42dvh] lg:h-[55dvh] lg:max-h-[540px]"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
            >
              <FallbackImage
                src={images[activeImageIndex] || images[0]}
                alt={`${product.name} finish`}
                cloudinaryWidth={1400}
                draggable={false}
                className="h-full w-full object-contain"
                style={{ transform: `translateX(${dragOffset}px)` }}
              />
              {images.length > 1 && <>
                <button type="button" onPointerDown={event => event.stopPropagation()} onClick={() => moveImage(-1)} aria-label="Previous product image" className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white hover:bg-black"><ChevronLeft size={22} /></button>
                <button type="button" onPointerDown={event => event.stopPropagation()} onClick={() => moveImage(1)} aria-label="Next product image" className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white hover:bg-black"><ChevronRight size={22} /></button>
              </>}
            </div>
            {images.length > 1 && <div ref={thumbnailStrip} aria-label="Product image previews" className="relative flex gap-2 overflow-x-auto border-t border-stone-200 p-3">
              {images.map((src, index) => <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                aria-label={`Show ${product.name} image ${index + 1}`}
                aria-pressed={activeImageIndex === index}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 ${activeImageIndex === index ? 'border-amber-800' : 'border-transparent opacity-65 hover:opacity-100'}`}
              ><FallbackImage src={src} alt="" loading="lazy" cloudinaryWidth={160} className="h-full w-full object-cover" /></button>)}
            </div>}
          </div>
          <div className="p-5 sm:p-8 lg:pt-16">
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
          </div>
        </div>
        <div className="shrink-0 border-t border-stone-200 bg-white p-3 sm:p-5">
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#176846] px-3 py-3 text-xs font-semibold text-white transition hover:bg-[#125438] sm:text-sm"><MessageCircle size={18} />Contact on WhatsApp</a>
            <button type="button" onClick={() => { onClose(); onOpenQuote?.(product.name); }} className="min-h-11 rounded-xl bg-[#ead8b0] px-3 py-3 text-xs font-semibold text-stone-900 transition hover:bg-[#dfc596] sm:text-sm">Request Sample / Booking</button>
          </div>
        </div>
      </div>
    </div>
  );
}
