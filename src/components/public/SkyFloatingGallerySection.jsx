'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles, Maximize2, Minimize2, ChevronLeft, ChevronRight,
  X, MapPin, ArrowUpRight, Play, Pause, MessageCircle, Eye
} from 'lucide-react';
import { getWhatsAppInquiryLink } from '../../utils/whatsappHelper.js';

// Curated high-resolution completed architectural masterpieces
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
    floatClass: 'sky-float-airy-1',
    aspect: 'tall'
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
    floatClass: 'sky-float-airy-2',
    aspect: 'standard'
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
    floatClass: 'sky-float-airy-3',
    aspect: 'tall'
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
    floatClass: 'sky-float-airy-1',
    aspect: 'standard'
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
    floatClass: 'sky-float-airy-2',
    aspect: 'tall'
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
    floatClass: 'sky-float-airy-3',
    aspect: 'standard'
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
    floatClass: 'sky-float-airy-1',
    aspect: 'tall'
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
    floatClass: 'sky-float-airy-2',
    aspect: 'standard'
  }
];

const CATEGORIES = ['All Projects', 'Villas', 'Penthouses', 'Commercial'];

export default function SkyFloatingGallerySection({ onOpenQuote }) {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [items, setItems] = useState(ARCHITECTURAL_SKY_ITEMS);
  const [activeCategory, setActiveCategory] = useState('All Projects');
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrifting, setIsDrifting] = useState(true);

  // Load dynamic projects if present in database
  useEffect(() => {
    fetch('/api/projects')
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((proj, idx) => ({
            id: proj._id || proj.slug || `db-${idx}`,
            title: proj.title,
            category: proj.category?.includes('Villa') ? 'Villas' :
                      proj.category?.includes('Penthouse') ? 'Penthouses' : 'Commercial',
            location: proj.locationArea || 'Dubai, UAE',
            material: proj.materialsSupplied?.join(', ') || 'Architectural Surface',
            description: proj.description || 'Verified Classical Decor ID project execution.',
            image: proj.coverImage || proj.gallery?.[0] || ARCHITECTURAL_SKY_ITEMS[idx % ARCHITECTURAL_SKY_ITEMS.length].image,
            cloudinary: proj.cloudinaryImages?.[0]?.secure_url || null,
            floatClass: `sky-float-airy-${(idx % 3) + 1}`,
            aspect: idx % 2 === 0 ? 'tall' : 'standard'
          }));
          setItems([...mapped, ...ARCHITECTURAL_SKY_ITEMS]);
        }
      })
      .catch(() => {});
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All Projects') return items;
    return items.filter(item => item.category === activeCategory);
  }, [items, activeCategory]);

  // Duplicate items for seamless continuous CSS drift track
  const duplicatedItems = useMemo(() => {
    return [...filteredItems, ...filteredItems];
  }, [filteredItems]);

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
        isFullscreen ? 'h-screen w-screen py-10' : 'py-14 sm:py-20'
      }`}
      style={{
        background: 'linear-gradient(180deg, #FAF6EE 0%, #F1F6FA 22%, #E7F0F7 50%, #EDF4F9 78%, #FAF6EE 100%)'
      }}
      aria-label="Floating Architectural Sky Portfolio"
    >
      {/* 1. SOFT SUNNY DUBAI SKY & ETHEREAL CLOUDS (হালকা ও স্নিগ্ধ রোদমাখা আকাশ) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Warm Golden Sun Aura at the top */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[350px] rounded-full opacity-60 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(229, 169, 36, 0.22) 0%, rgba(250, 246, 238, 0.05) 60%, transparent 80%)'
          }}
        />

        {/* Soft daylight sky cloud drift layer 1 */}
        <div className="absolute top-8 left-0 right-0 h-48 opacity-45 sky-cloud-gentle-1 pointer-events-none">
          <svg viewBox="0 0 1440 220" className="w-[125%] h-full fill-white/80 filter blur-xl">
            <path d="M0,64L60,85.3C120,107,240,149,360,149.3C480,149,600,107,720,106.7C840,107,960,149,1080,144C1200,139,1320,85,1380,58.7L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
          </svg>
        </div>

        {/* Soft daylight sky cloud drift layer 2 */}
        <div className="absolute bottom-6 left-0 right-0 h-44 opacity-40 sky-cloud-gentle-2 pointer-events-none">
          <svg viewBox="0 0 1440 220" className="w-[130%] h-full fill-amber-100/40 filter blur-2xl">
            <path d="M0,128L60,117.3C120,107,240,85,360,96C480,107,600,149,720,160C840,171,960,149,1080,133.3C1200,117,1320,107,1380,101.3L1440,96L1440,220L1380,220C1320,220,1200,220,1080,220C960,220,840,220,720,220C600,220,480,220,360,220C240,220,120,220,60,220L0,220Z" />
          </svg>
        </div>
      </div>

      {/* 2. SECTION HEADER (Clean, Light, Luxury Editorial Tone) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-amber-300/60 shadow-xs text-[10px] font-mono uppercase tracking-[0.2em] text-amber-900 font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A924]" />
              <span>Architectural Sky Showcase · Dubai & UAE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 mt-2.5 tracking-tight">
              Floating Masterpieces.
            </h2>
            <p className="font-sans text-stone-600 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Explore completed residential villas, high-rise penthouses, and commercial spaces effortlessly floating under the open Dubai sky.
            </p>
          </div>

          {/* Controls: Category Filter + Play/Pause + Fullscreen */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Drift Play/Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsDrifting(!isDrifting)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/85 hover:bg-white border border-stone-200/90 text-[11px] font-semibold text-stone-700 shadow-xs backdrop-blur-md transition active:scale-95"
              title={isDrifting ? "Pause automatic floating" : "Resume automatic floating"}
            >
              {isDrifting ? (
                <>
                  <Pause className="w-3 h-3 text-[#E5A924]" />
                  <span>Drift: On</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-stone-500" />
                  <span>Paused</span>
                </>
              )}
            </button>

            {/* Fullscreen Immersion Button */}
            <button
              type="button"
              onClick={toggleFullScreen}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-[11px] shadow-sm transition active:scale-95"
              title="Expand to Fullscreen View"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-[#E5A924]" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-[#E5A924]" />
                  <span>Fullscreen View</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Category Pills & Manual Navigation Arrows */}
        <div className="mt-3 flex items-center justify-between flex-wrap gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-1.5" role="tablist">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all backdrop-blur-md ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-white/80 border border-stone-200/80 text-stone-600 hover:bg-white hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleManualScroll(-350)}
              className="w-8 h-8 rounded-xl bg-white/90 hover:bg-white border border-stone-200/90 text-stone-700 flex items-center justify-center shadow-xs transition active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleManualScroll(350)}
              className="w-8 h-8 rounded-xl bg-white/90 hover:bg-white border border-stone-200/90 text-stone-700 flex items-center justify-center shadow-xs transition active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. LIGHTWEIGHT, BUTTER-SMOOTH FLOATING SKY STREAM (GPU ACCELERATED) */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 w-full overflow-x-auto scrollbar-none py-6 sm:py-8 select-none"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div
          className={`flex items-center gap-6 sm:gap-8 px-4 sm:px-8 ${
            isDrifting ? 'sky-drift-track' : 'w-max'
          }`}
        >
          {duplicatedItems.map((item, index) => {
            const isTall = item.aspect === 'tall';

            return (
              <div
                key={`${item.id}-${index}`}
                className={`shrink-0 group cursor-pointer transition-all duration-300 ${item.floatClass}`}
                style={{
                  width: isTall ? '280px' : '320px'
                }}
                onClick={() => setActiveLightbox(item)}
              >
                {/* Clean, Elegant, Weightless Card Frame */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-stone-200/80 shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08)] group-hover:shadow-[0_20px_40px_-8px_rgba(229,169,36,0.28)] group-hover:border-[#E5A924] group-hover:-translate-y-2 transition-all duration-300">
                  {/* Image Container */}
                  <div
                    className={`relative overflow-hidden rounded-xl bg-stone-100 ${
                      isTall ? 'h-[330px] sm:h-[370px]' : 'h-[270px] sm:h-[300px]'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                      onError={(e) => {
                        if (item.cloudinary && e.target.src !== item.cloudinary) {
                          e.target.src = item.cloudinary;
                        }
                      }}
                    />

                    {/* Subtle top category tag */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-900/85 backdrop-blur-md text-[#E5A924] shadow-xs">
                        {item.category}
                      </span>

                      <span className="w-7 h-7 rounded-full bg-white/85 text-stone-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <Eye className="w-3.5 h-3.5 text-stone-900" />
                      </span>
                    </div>

                    {/* Gradient scrim for text readability */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent pointer-events-none" />

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-0 inset-x-0 p-3 sm:p-3.5 text-white pointer-events-none">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-amber-300/90 mb-0.5">
                        <MapPin className="w-3 h-3 text-[#E5A924] shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <h3 className="font-serif text-sm sm:text-base font-semibold text-white group-hover:text-amber-200 transition-colors truncate">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Clean Bottom Card Footer */}
                  <div className="pt-2.5 pb-1 px-1 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wide truncate max-w-[190px]">
                      {item.material}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-800 group-hover:translate-x-0.5 transition-transform shrink-0">
                      <span>View</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#E5A924]" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. LIGHTBOX THEATER MODAL (Clean, Crisp, Distraction-Free) */}
      {activeLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-stone-950/90 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 max-w-6xl mx-auto w-full">
            <div>
              <span className="text-[10px] font-mono text-[#E5A924] uppercase tracking-[0.2em] block">
                {activeLightbox.category} · {activeLightbox.location}
              </span>
              <h4 className="font-serif text-lg sm:text-2xl font-bold text-white">
                {activeLightbox.title}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setActiveLightbox(null)}
              aria-label="Close modal"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Stage */}
          <div className="relative flex-1 flex items-center justify-center py-4 max-w-6xl mx-auto w-full overflow-hidden">
            <button
              type="button"
              onClick={() => navigateLightbox(-1)}
              aria-label="Previous"
              className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#E5A924] hover:text-stone-950 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition shadow-lg active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <img
              src={activeLightbox.image}
              alt={activeLightbox.title}
              className="max-h-[68vh] sm:max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              onError={(e) => {
                if (activeLightbox.cloudinary && e.target.src !== activeLightbox.cloudinary) {
                  e.target.src = activeLightbox.cloudinary;
                }
              }}
            />

            <button
              type="button"
              onClick={() => navigateLightbox(1)}
              aria-label="Next"
              className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#E5A924] hover:text-stone-950 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition shadow-lg active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Footer with actions */}
          <div className="max-w-6xl mx-auto w-full pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="font-mono text-xs text-[#E5A924]">
                Material Specification: {activeLightbox.material}
              </p>
              <p className="font-sans text-xs text-stone-300 mt-0.5 max-w-xl">
                {activeLightbox.description}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={getWhatsAppInquiryLink({ category: `Project Specification: ${activeLightbox.title}` })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-sans text-xs font-bold shadow-md hover:bg-[#20bd59] transition"
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
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E5A924] text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-[#f3be43] transition shadow-md"
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
