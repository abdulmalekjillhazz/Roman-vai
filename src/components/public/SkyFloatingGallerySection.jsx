'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  Sparkles, Maximize2, Minimize2, ChevronLeft, ChevronRight,
  X, MapPin, ArrowUpRight, MessageCircle, Eye
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

function mapProjectsToItems(data) {
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
    isFeatured: Boolean(proj.isFeatured),
    isFromAdmin: true
  }));
  return [...mapped, ...ARCHITECTURAL_SKY_ITEMS.filter(item => !mapped.some(m => m.title === item.title))];
}

export default function SkyFloatingGallerySection({ onOpenQuote, initialProjects = null, embedded = false }) {
  const containerRef = useRef(null);
  const [items, setItems] = useState(() =>
    Array.isArray(initialProjects) && initialProjects.length > 0
      ? mapProjectsToItems(initialProjects)
      : ARCHITECTURAL_SKY_ITEMS
  );
  const [activeCategory, setActiveCategory] = useState('All Projects');
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load dynamic projects only if not already provided by SSR
  useEffect(() => {
    if (Array.isArray(initialProjects) && initialProjects.length > 0) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3500);
    fetch('/api/projects', { cache: 'no-store', signal: controller.signal })
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(mapProjectsToItems(data));
        }
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [initialProjects]);

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

  return (
    <section
      id="sky-portfolio"
      ref={containerRef}
      className={`relative w-full overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'h-screen w-screen overflow-y-auto bg-[#FAF6EE] py-6'
          : embedded
          ? 'py-2'
          : 'pt-6 pb-10 sm:pt-16 sm:pb-20 border-t border-brand-sand/60 bg-[radial-gradient(circle_at_8%_10%,rgba(229,169,36,0.16),transparent_28%),linear-gradient(135deg,#fbf8f1_0%,#eef4f5_52%,#fbf8f1_100%)]'
      }`}
      aria-label="Architectural Portfolio Showcase"
    >
      {/* 2. SECTION HEADER & FILTER BAR */}
      <div className={`relative z-10 ${embedded ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} mb-4 sm:mb-6`}>
        {!embedded && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-8 mb-5 sm:mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-stone-950 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] text-[#F4C45A] font-bold shadow-lg shadow-stone-900/10">
                <Sparkles className="w-3 h-3 text-[#E5A924]" />
                <span>Architectural Showcase · Dubai &amp; UAE</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold text-stone-950 mt-2.5 sm:mt-4 tracking-[-0.04em] leading-[0.96]">
                Spaces with a point of view.
              </h2>
              <p className="font-sans text-stone-600 text-xs sm:text-sm mt-3 sm:mt-4 max-w-xl leading-relaxed">
                A visual record of material, light, and craft across completed villas, penthouses, and commercial interiors in the UAE.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-5 rounded-2xl border border-stone-200/80 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-sm">
              <div>
                <span className="block font-serif text-2xl font-semibold text-stone-950">IMAGE-FIRST</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-500">Editorial stories</span>
              </div>
              <div className="h-10 w-px bg-stone-200" />
              <div>
                <span className="block font-serif text-3xl font-semibold text-stone-950">UAE</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-500">Material stories</span>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Category Filter Tabs + Fullscreen Toggle */}
        <div className="flex items-center justify-between gap-3 border-b border-stone-200/70 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1 pr-2" role="tablist">
            {categories.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex min-h-11 items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-white border border-stone-200/90 text-stone-700 hover:border-[#E5A924] hover:text-stone-950'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={toggleFullScreen}
            aria-label={isFullscreen ? 'Exit fullscreen portfolio' : 'Open fullscreen portfolio'}
            className="inline-flex min-h-11 items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-sm transition active:scale-95 shrink-0"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-[#E5A924]" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#E5A924]" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. IMAGE-FIRST EDITORIAL FEATURE + PROJECT INDEX */}
      <div className={`relative z-10 ${embedded ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} pt-2 pb-4`}>
        {filteredItems[0] && (
          <>
            <button
              type="button"
              onClick={() => setActiveLightbox(filteredItems[0])}
              aria-label={`Open featured project ${filteredItems[0].title}`}
              className="group relative block min-h-[25rem] w-full overflow-hidden rounded-[1.75rem] bg-stone-900 text-left shadow-[0_30px_80px_-24px_rgba(15,23,42,0.48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A924] focus-visible:ring-offset-4 sm:min-h-[36rem] lg:min-h-[44rem]"
            >
              <Image
                src={filteredItems[0].image}
                alt={filteredItems[0].title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/5" />
              <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-9 sm:bottom-9">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#F4C45A]/50 bg-stone-950/50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#F4C45A] backdrop-blur-md">
                    01 Â· {filteredItems[0].category}
                  </span>
                  {filteredItems[0].isFeatured && <span className="rounded-full bg-[#E5A924] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-950">Featured</span>}
                </div>
                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-200"><MapPin className="h-3.5 w-3.5 text-[#F4C45A]" /> {filteredItems[0].location}</p>
                    <h3 className="max-w-3xl font-serif text-4xl font-semibold leading-[0.96] tracking-[-0.04em] sm:text-6xl">{filteredItems[0].title}</h3>
                  </div>
                  <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-stone-950 shadow-xl transition-transform duration-500 group-hover:rotate-45 sm:flex"><ArrowUpRight className="h-5 w-5" /></span>
                </div>
              </div>
            </button>

            <div className="mt-12 border-y border-stone-300/80 py-5 sm:mt-20 sm:py-7">
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">Project index</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">{filteredItems.length} visual stories</span>
              </div>
              <div className="divide-y divide-stone-200/90">
                {filteredItems.map((item, index) => (
                  <button
                    key={`index-${item.id}`}
                    type="button"
                    onClick={() => setActiveLightbox(item)}
                    aria-label={`Open project ${item.title}`}
                    className="group flex w-full items-center gap-3 py-3 text-left transition-colors hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A924] sm:gap-5 sm:py-4"
                  >
                    <span className="w-8 font-mono text-[10px] text-stone-400 sm:w-10">{String(index + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1 font-serif text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{item.title}</span>
                    <span className="hidden max-w-[15rem] truncate font-mono text-[10px] uppercase tracking-[0.14em] text-stone-500 sm:block">{item.category} · {item.location}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#E5A924] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="hidden grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-7">
          {filteredItems.map((item, index) => {
            // Bento-asymmetric rhythm: Lead project spans 7 cols, second spans 5 cols, then spacious 6-col editorial spreads
            const colSpanClass =
              index === 0
                ? 'md:col-span-2 lg:col-span-7'
                : index === 1
                ? 'md:col-span-2 lg:col-span-5'
                : 'lg:col-span-6';
            const aspectClass =
              index === 0
                ? 'aspect-[16/10]'
                : index === 1
                ? 'aspect-[16/10] lg:aspect-[5/4]'
                : 'aspect-[16/10]';
            const projectNumber = String(index + 1).padStart(2, '0');

            return (
              <article
                key={`${item.id}-${index}`}
                onClick={() => setActiveLightbox(item)}
                tabIndex="0"
                role="button"
                aria-label={`Open ${item.title} portfolio story`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveLightbox(item);
                  }
                }}
                className={`group cursor-pointer flex flex-col bg-white/90 rounded-[1.65rem] p-2.5 sm:p-3 border border-stone-200/90 shadow-[0_18px_45px_-14px_rgba(15,23,42,0.18)] hover:shadow-[0_30px_70px_-18px_rgba(15,23,42,0.28)] hover:border-[#E5A924] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A924] focus-visible:ring-offset-4 transition-all duration-500 motion-reduce:transition-none ${colSpanClass}`}
              >
                {/* Large Editorial Image Stage */}
                <div className={`relative overflow-hidden rounded-[1.25rem] bg-stone-100 w-full ${aspectClass}`}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={index === 0 ? '(max-width: 1024px) 100vw, 60vw' : '(max-width: 1024px) 100vw, 48vw'}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 motion-reduce:transition-none"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-stone-950/10 opacity-75 transition-opacity duration-500 group-hover:opacity-95" />

                  {/* Top Architectural Drafting Tags */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-950/85 backdrop-blur-md text-[#E5A924] border border-amber-400/30 shadow-xs">
                        {projectNumber} · {item.category}
                      </span>
                      {item.isFeatured && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                    </div>

                    <span className="w-10 h-10 rounded-full bg-white/95 text-stone-900 flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Eye className="w-4 h-4 text-stone-900" />
                    </span>
                  </div>
                </div>

                {/* Editorial Case Study Body */}
                <div className="flex flex-1 flex-col justify-between pt-5 pb-1 px-2">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <span className="inline-flex items-center gap-1.5 text-amber-800 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-[#E5A924] shrink-0" />
                        <span>{item.location}</span>
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
                        {item.material}
                      </span>
                    </div>

                    <h3 className="mt-2 font-serif text-2xl sm:text-[26px] font-semibold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug tracking-[-0.02em]">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-2.5 text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-stone-400">
                      Case Study & Material Specs
                    </span>
                    <span className="inline-flex items-center gap-1 text-amber-900 group-hover:translate-x-0.5 transition-transform">
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-4 h-4 text-[#E5A924]" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
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
