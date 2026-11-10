'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  Sparkles, Maximize2, Minimize2, ChevronLeft, ChevronRight,
  X, MapPin, ArrowUpRight, Play, Pause, MessageCircle, Eye
} from 'lucide-react';
import { getWhatsAppInquiryLink } from '../../utils/whatsappHelper.js';

// Curated high-resolution completed architectural masterpieces (Fallback & Seed)
const ARCHITECTURAL_SKY_ITEMS = [
  {
    id: 'sky-villa-cladding',
    title: 'Luxury Villa Curved Facade',
    category: 'Villas',
    location: 'Emirates Hills, Dubai',
    material: 'Flexible Stone Veneer',
    description: 'Bespoke continuous curved facade cladded with 2mm flexible sandstone veneer, engineered for intense desert UV resistance.',
    image: '/assets/decorforall/project-completed-luxury-villa-wall-cladding-01.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793947953/dst_deco/wall-products/project-completed-luxury-villa-wall-cladding-01.jpg',
    floatClass: 'sky-float-airy-1'
  },
  {
    id: 'sky-herringbone-parquet',
    title: 'Executive Penthouse Parquetry',
    category: 'Penthouses',
    location: 'Burj District, Dubai',
    material: 'SPC Rigid Core Parquet',
    description: 'Precision French herringbone parquetry with acoustic dampening IXPE underlay designed for high-altitude luxury apartments.',
    image: '/assets/decorforall/project-completed-herringbone-parquet-residential-05.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955830/dst_deco/gallery/projects/project-completed-herringbone-parquet-residential-05.webp',
    floatClass: 'sky-float-airy-2'
  },
  {
    id: 'sky-office-feature-wall',
    title: 'DIFC Headquarters Feature Wall',
    category: 'Commercial',
    location: 'DIFC Financial Centre, Dubai',
    material: 'Acoustic Slat Louvers',
    description: 'Certified acoustic slat wall millwork on recycled black PET felt backing, dampening reverberation in executive conference suites.',
    image: '/assets/decorforall/project-completed-commercial-office-feature-wall-03.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793947944/dst_deco/wall-products/project-completed-commercial-office-feature-wall-03.jpg',
    floatClass: 'sky-float-airy-3'
  },
  {
    id: 'sky-penthouse-grand-lounge',
    title: 'Waterfront Penthouse Salon',
    category: 'Penthouses',
    location: 'Palm Jumeirah, Dubai',
    material: 'Rigid Core Hardwood Look',
    description: 'Zero-expansion architectural flooring engineered for humid coastal waterfront villas and panoramic skyline penthouses.',
    image: '/assets/decorforall/project-completed-executive-penthouse-flooring-07.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955832/dst_deco/gallery/projects/project-completed-executive-penthouse-flooring-07.webp',
    floatClass: 'sky-float-airy-1'
  },
  {
    id: 'sky-hotel-lobby-marble',
    title: 'Hotel Lobby Grand Marble Floor',
    category: 'Commercial',
    location: 'Business Bay Canal, Dubai',
    material: 'SPC Polished Marble Tile',
    description: 'Mirror-finish bookmatched marble look with commercial AC5 wear layer and anti-slip R10 safety rating.',
    image: '/assets/decorforall/project-completed-hotel-lobby-marble-flooring-06.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955831/dst_deco/gallery/projects/project-completed-hotel-lobby-marble-flooring-06.webp',
    floatClass: 'sky-float-airy-2'
  },
  {
    id: 'sky-desert-gold-stone',
    title: 'Desert Gold Mountain Villa Wall',
    category: 'Villas',
    location: 'Al Barari Oasis, Dubai',
    material: 'Desert Gold Flexible Stone',
    description: 'Warm earth-toned natural quartzite sheet with backlit translucency option for dramatic architectural feature walls.',
    image: '/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955743/dst_deco/gallery/flexible-stone/flexible-stone-desert-gold-accent-wall-10.webp',
    floatClass: 'sky-float-airy-3'
  },
  {
    id: 'sky-exterior-facade-rock',
    title: 'Architectural Cliff Facade Panel',
    category: 'Commercial',
    location: 'Dubai Hills Estate',
    material: 'High-Density PU Stone',
    description: 'Ultra-lightweight volcanic rock profile weighing only 3.8kg per panel, delivering monolithic boulder aesthetics.',
    image: '/assets/decorforall/project-completed-exterior-architectural-facade-09.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955834/dst_deco/gallery/projects/project-completed-exterior-architectural-facade-09.webp',
    floatClass: 'sky-float-airy-1'
  },
  {
    id: 'sky-modern-living-accent',
    title: 'Private Villa 3D Fluted Wall',
    category: 'Villas',
    location: 'Jumeirah Golf Estates, Dubai',
    material: 'WPC Fluted Slat Panel',
    description: 'Seamless integration of hidden indirect LED channels with fluted walnut acoustic louvers for high-end residential interiors.',
    image: '/assets/decorforall/project-completed-modern-living-room-accent-wall-02.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955828/dst_deco/gallery/projects/project-completed-modern-living-room-accent-wall-02.webp',
    floatClass: 'sky-float-airy-2'
  }
];

export default function SkyFloatingGallerySection({ onOpenQuote }) {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [items, setItems] = useState(ARCHITECTURAL_SKY_ITEMS);
  const [activeCategory, setActiveCategory] = useState('All Projects');
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrifting, setIsDrifting] = useState(false); // Mobile friendly: static snap swipe by default, toggleable drift

  // Load dynamic projects from database (Admin Panel Full Control)
  useEffect(() => {
    fetch('/api/projects')
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((proj, idx) => ({
            id: proj._id || proj.slug || `db-${idx}`,
            title: proj.title,
            category: proj.category || 'Portfolio',
            location: proj.locationArea || 'Dubai, UAE',
            material: Array.isArray(proj.materialsSupplied)
              ? proj.materialsSupplied.join(', ')
              : (proj.materialsSupplied || 'Architectural Surface'),
            description: proj.description || 'Verified Classical Decor ID project execution in the UAE.',
            image: proj.coverImage || proj.gallery?.[0] || ARCHITECTURAL_SKY_ITEMS[idx % ARCHITECTURAL_SKY_ITEMS.length].image,
            cloudinary: proj.cloudinaryImages?.[0]?.secure_url || null,
            floatClass: `sky-float-airy-${(idx % 3) + 1}`,
            isFeatured: Boolean(proj.isFeatured),
            isFromAdmin: true
          }));

          // Sort featured projects to the front, then all admin projects, supplemented by seed items
          const combined = [...mapped, ...ARCHITECTURAL_SKY_ITEMS.filter(item => !mapped.some(m => m.title === item.title))];
          setItems(combined);
        }
      })
      .catch(() => {});
  }, []);

  // Dynamically extract categories from all live items so Admin categories auto-populate!
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach(it => {
      if (it.category) set.add(it.category);
    });
    return ['All Projects', ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All Projects') return items;
    return items.filter(item => item.category === activeCategory);
  }, [items, activeCategory]);

  // Duplicate items for continuous drifting marquee on desktop
  const displayItems = useMemo(() => {
    return isDrifting ? [...filteredItems, ...filteredItems] : filteredItems;
  }, [filteredItems, isDrifting]);

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!activeLightbox) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveLightbox(null);
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightbox, filteredItems]);

  const navigateLightbox = (dir) => {
    if (!activeLightbox) return;
    const curIndex = filteredItems.findIndex(item => item.id === activeLightbox.id);
    if (curIndex === -1) return;
    const nextIndex = (curIndex + dir + filteredItems.length) % filteredItems.length;
    setActiveLightbox(filteredItems[nextIndex]);
  };

  const handleManualScroll = (delta) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="sky-portfolio"
      ref={containerRef}
      className={`relative w-full overflow-hidden transition-all duration-500 border-t border-brand-sand/60 ${
        isFullscreen ? 'h-screen w-screen py-6' : 'pt-5 pb-8 sm:pt-12 sm:pb-16'
      }`}
      style={{
        background: 'linear-gradient(180deg, #FAF6EE 0%, #F1F6FA 20%, #E7F0F7 50%, #EDF4F9 80%, #FAF6EE 100%)'
      }}
      aria-label="Floating Architectural Sky Portfolio"
    >
      {/* 1. SOFT SUNNY DUBAI SKY & ETHEREAL CLOUDS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Warm Golden Sun Aura at the top */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[300px] rounded-full opacity-60 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(229, 169, 36, 0.22) 0%, rgba(250, 246, 238, 0.05) 60%, transparent 80%)'
          }}
        />

        {/* Soft daylight sky cloud drift */}
        <div className="absolute top-4 left-0 right-0 h-40 opacity-45 sky-cloud-gentle-1 pointer-events-none">
          <svg viewBox="0 0 1440 220" className="w-[125%] h-full fill-white/80 filter blur-xl">
            <path d="M0,64L60,85.3C120,107,240,149,360,149.3C480,149,600,107,720,106.7C840,107,960,149,1080,144C1200,139,1320,85,1380,58.7L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
          </svg>
        </div>
      </div>

      {/* 2. SECTION HEADER (Tight, Punchy, Beautifully Spaced on Mobile) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 sm:mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/90 border border-amber-300/60 shadow-2xs text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] text-amber-900 font-bold backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[#E5A924]" />
              <span>Architectural Sky Showcase · Dubai & UAE</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 mt-1.5 sm:mt-2.5 tracking-tight">
              Floating Masterpieces.
            </h2>
            <p className="font-sans text-stone-600 text-[11px] sm:text-xs mt-1 sm:mt-1.5 max-w-xl leading-relaxed">
              Explore completed luxury residential villas, penthouses, and commercial surface executions floating under the Dubai sky.
            </p>
          </div>

          {/* Compact Control Row: Drift Toggle + Fullscreen */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsDrifting(!isDrifting)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/90 hover:bg-white border border-stone-200/90 text-[10px] sm:text-[11px] font-semibold text-stone-700 shadow-xs backdrop-blur-md transition active:scale-95"
            >
              {isDrifting ? (
                <>
                  <Pause className="w-3 h-3 text-[#E5A924]" />
                  <span>Drift: On</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-stone-500" />
                  <span>Auto Drift</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleFullScreen}
              className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-[10px] sm:text-[11px] shadow-sm transition active:scale-95"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3 h-3 text-[#E5A924]" />
                  <span>Exit</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3 h-3 text-[#E5A924]" />
                  <span>Fullscreen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Category Scroll Row + Mobile Swipe Hint */}
        <div className="mt-2.5 sm:mt-4 flex items-center justify-between gap-2 border-b border-stone-200/60 pb-2">
          {/* Horizontally scrollable category pills on mobile without wrapping */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1 pr-2" role="tablist">
            {categories.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white/80 border border-stone-200/80 text-stone-600 hover:bg-white hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Desktop/Mobile Navigation Arrows */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="hidden sm:inline text-[10px] font-mono text-stone-400 mr-1.5">
              Swipe to explore
            </span>
            <button
              type="button"
              onClick={() => handleManualScroll(-300)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/90 hover:bg-white border border-stone-200 text-stone-700 flex items-center justify-center shadow-2xs transition active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleManualScroll(300)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/90 hover:bg-white border border-stone-200 text-stone-700 flex items-center justify-center shadow-2xs transition active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE-OPTIMIZED SNAP CAROUSEL & FLOATING SKY STREAM */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-2 sm:py-6 select-none"
      >
        <div
          className={`flex items-center gap-4 sm:gap-6 px-4 sm:px-8 ${
            isDrifting ? 'sky-drift-track' : 'w-max'
          }`}
        >
          {displayItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={`shrink-0 snap-center group cursor-pointer transition-all duration-300 ${item.floatClass} w-[78vw] sm:w-[310px] max-w-[320px]`}
              onClick={() => setActiveLightbox(item)}
            >
              {/* Clean, Elegant Floating Glass Card */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-stone-200/90 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)] group-hover:shadow-[0_20px_40px_-8px_rgba(229,169,36,0.28)] group-hover:border-[#E5A924] group-hover:-translate-y-1.5 transition-all duration-300">
                {/* Image Stage */}
                <div className="relative overflow-hidden rounded-xl bg-stone-100 h-[280px] sm:h-[330px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 78vw, 320px"
                    loading="lazy"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-950/85 backdrop-blur-md text-[#E5A924] border border-amber-400/30 shadow-xs">
                      {item.category}
                    </span>

                    {item.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 shadow-xs flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}

                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 text-stone-900 flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Eye className="w-3 h-3 text-stone-900" />
                    </span>
                  </div>

                  {/* Gradient Scrim for text clarity */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent pointer-events-none" />

                  {/* Bottom info on the photo */}
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-3.5 text-white pointer-events-none">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-amber-300/95 mb-0.5">
                      <MapPin className="w-3 h-3 text-[#E5A924] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <h3 className="font-serif text-sm sm:text-base font-semibold text-white group-hover:text-amber-200 transition-colors truncate">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Clean Bottom Card Footer */}
                <div className="pt-2 pb-0.5 px-1 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wide truncate max-w-[170px] sm:max-w-[200px]">
                    {item.material}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-amber-900 group-hover:translate-x-0.5 transition-transform shrink-0">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3 text-[#E5A924]" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. MOBILE SWIPE HINT BAR */}
      <div className="sm:hidden mt-2 text-center">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-stone-500 bg-white/70 px-3 py-1 rounded-full border border-stone-200/60 shadow-2xs">
          <span>👈 Swipe horizontally to browse all projects 👉</span>
        </span>
      </div>

      {/* 5. LIGHTBOX THEATER MODAL */}
      {activeLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 max-w-6xl mx-auto w-full">
            <div>
              <span className="text-[10px] font-mono text-[#E5A924] uppercase tracking-[0.2em] block">
                {activeLightbox.category} · {activeLightbox.location}
              </span>
              <h4 className="font-serif text-base sm:text-2xl font-bold text-white">
                {activeLightbox.title}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setActiveLightbox(null)}
              aria-label="Close modal"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Stage */}
          <div className="relative flex-1 flex items-center justify-center py-3 max-w-6xl mx-auto w-full overflow-hidden">
            <button
              type="button"
              onClick={() => navigateLightbox(-1)}
              aria-label="Previous"
              className="absolute left-1 sm:left-4 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-[#E5A924] hover:text-stone-950 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition shadow-lg active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="relative max-h-[62vh] sm:max-h-[72vh] w-full max-w-4xl h-[62vh] sm:h-[72vh] flex items-center justify-center">
              <Image
                src={activeLightbox.image}
                alt={activeLightbox.title}
                fill
                sizes="(max-width: 1024px) 90vw, 1200px"
                loading="lazy"
                className="object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </div>

            <button
              type="button"
              onClick={() => navigateLightbox(1)}
              aria-label="Next"
              className="absolute right-1 sm:right-4 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-[#E5A924] hover:text-stone-950 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition shadow-lg active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Footer with actions */}
          <div className="max-w-6xl mx-auto w-full pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="font-mono text-xs text-[#E5A924]">
                Material Specification: {activeLightbox.material}
              </p>
              <p className="font-sans text-[11px] sm:text-xs text-stone-300 mt-0.5 max-w-xl">
                {activeLightbox.description}
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href={getWhatsAppInquiryLink({ category: `Project Specification: ${activeLightbox.title}` })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#25D366] text-white font-sans text-xs font-bold shadow-md hover:bg-[#20bd59] transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveLightbox(null);
                  onOpenQuote?.(activeLightbox.title);
                }}
                className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#E5A924] text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-[#f3be43] transition shadow-md"
              >
                Request Sample
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
