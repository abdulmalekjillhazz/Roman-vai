import React, { useState, useEffect } from 'react';
import { CLIENT_INFO } from '../../config/clientInfo.js';

export default function ProductModal({ product, isOpen, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp'];

  const currentImage = images[activeImageIndex] || images[0];

  function handlePrevImage(e) {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function handleNextImage(e) {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  const specificationList = [
    { label: 'Thickness', value: product.specifications?.thickness || product.thickness || 'Custom' },
    { label: 'Dimensions', value: product.specifications?.dimensions || product.dimensions || 'Project-based' },
    { label: 'Material', value: product.specifications?.material || product.material || 'Premium surface' },
    { label: 'Availability', value: product.inStock === false ? 'On request' : 'Ready for order' }
  ];

  const waText = encodeURIComponent(
    `Hello Classical Decor ID,\nI am interested in ${product.name}.\nPlease share product details, finish options, trade pricing, and delivery availability.`
  );
  const waLink = `https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${waText}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl floating-modal overflow-hidden border border-white/60 max-h-[92vh] flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Round Black Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center transition shadow-lg backdrop-blur-sm focus:outline-none"
        >
          <span className="text-sm font-bold leading-none">✕</span>
        </button>

        {/* Top Architectural Photo Gallery */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 bg-stone-900 select-none shrink-0 group">
          <img
            src={currentImage}
            alt={`${product.name} Dubai luxury architecture`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {/* Photo Caption & Counter */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition backdrop-blur-xs text-lg"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition backdrop-blur-xs text-lg"
                aria-label="Next image"
              >
                ›
              </button>

              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur text-white text-[11px] font-sans font-medium px-3 py-1 rounded-full max-w-[65%] truncate shadow-md">
                {currentImage.split('/').pop().replace(/\.[^/.]+$/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </div>

              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur text-white text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full">
                {activeImageIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* New / Featured Tag */}
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-[#e02424] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md tracking-wider">
              NEW
            </span>
          )}
        </div>

        {/* Thumbnail Carousel */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 border-b border-stone-200 overflow-x-auto no-scrollbar shrink-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                  activeImageIndex === idx
                    ? 'border-[#25D366] scale-105 shadow-sm'
                    : 'border-stone-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Body Content */}
        <div className="flex flex-1 flex-col items-center overflow-y-auto p-5 text-center sm:p-7">
          <h2 className="font-sans text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
            {product.name}
          </h2>

          <span className="mt-1 text-xs font-sans font-semibold uppercase tracking-[0.18em] text-amber-700">
            {product.categoryGroup || product.categoryName}
          </span>

          <p className="mt-2 max-w-lg text-xs leading-relaxed text-stone-600 sm:text-sm">
            {product.description}
          </p>

          <div className="mt-5 w-full rounded-xl border border-[#d4af37]/40 bg-[#faf8f5] p-4 text-left sm:p-5">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#996515] sm:text-xs">
              {product.featureTitle || `${product.name.toUpperCase()} — Key Specifications`}
            </h3>

            <div className="grid gap-2 sm:grid-cols-2">
              {specificationList.map((item) => (
                <div key={item.label} className="rounded-lg border border-stone-200 bg-white px-3 py-2">
                  <div className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-stone-500">
                    {item.label}
                  </div>
                  <div className="mt-1 text-xs font-sans font-semibold text-stone-900">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {(product.features || [
                'Water resistant',
                'Architectural finish',
                'Easy maintenance',
                'Commercial grade',
                'Project ready'
              ]).map((feature, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-medium text-stone-800 shadow-xs sm:text-xs"
                >
                  <span className="font-bold text-emerald-500">✓</span>
                  <span>{feature}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-sans font-bold text-white shadow-md transition duration-200 hover:bg-[#20ba59] active:bg-[#1da850]"
            >
              <svg
                className="h-5 w-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.031 0C5.396 0 .029 5.367.029 12.002c0 2.118.553 4.187 1.603 6.007L0 24l6.167-1.618a11.97 11.97 0 005.864 1.518h.005c6.634 0 12.001-5.367 12.001-12.002C24.037 5.368 18.67 0 12.031 0zm0 21.897c-1.8 0-3.565-.484-5.105-1.4l-.366-.217-3.793.995 1.013-3.697-.238-.379a9.92 9.92 0 01-1.521-5.197c0-5.498 4.474-9.972 9.975-9.972 2.664 0 5.168 1.038 7.051 2.922a9.92 9.92 0 012.921 7.052c0 5.499-4.474 9.973-9.975 9.973zm5.467-7.464c-.299-.15-1.771-.874-2.046-.974-.275-.1-.475-.15-.675.15s-.774.974-.95 1.173c-.174.2-.349.225-.648.075-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.494-1.78-1.669-2.079-.175-.3-.019-.462.131-.611.135-.134.299-.349.449-.524.15-.175.2-.3.3-.5.1-.2.05-.374-.025-.524-.075-.15-.675-1.623-.925-2.222-.243-.583-.49-.504-.674-.513-.174-.009-.374-.01-.574-.01s-.524.075-.798.374c-.275.3-1.049 1.024-1.049 2.5 0 1.474 1.074 2.898 1.224 3.098.15.2 2.113 3.227 5.119 4.526.715.309 1.273.494 1.708.632.718.228 1.371.196 1.888.118.577-.087 1.771-.724 2.021-1.423.25-.699.25-1.298.175-1.423-.075-.125-.275-.2-.575-.35z" />
              </svg>
              <span>Contact on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="flex flex-1 items-center justify-center rounded-xl border border-stone-300 bg-white px-6 py-3.5 text-sm font-sans font-bold text-stone-800 shadow-sm transition duration-200 hover:border-stone-400"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
