'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles, Maximize2, Minimize2, ChevronLeft, ChevronRight,
  X, MapPin, ArrowUpRight, Play, Pause, Layers, ExternalLink, MessageCircle
} from 'lucide-react';
import { CLIENT_INFO } from '../../config/clientInfo.js';
import { getWhatsAppInquiryLink } from '../../utils/whatsappHelper.js';

// Curated high-resolution architectural masterpieces for the floating sky experience
const DEFAULT_SKY_ITEMS = [
  {
    id: 'sky-villa-cladding',
    title: 'Luxury Villa Curved Facade',
    category: 'Luxury Villas',
    location: 'Emirates Hills, Dubai',
    material: 'Flexible Stone & Curvature Veneer',
    description: 'Bespoke continuous curved facade cladded with 2mm flexible sandstone veneer, engineered for intense desert UV resistance.',
    image: '/assets/decorforall/project-completed-luxury-villa-wall-cladding-01.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793947953/dst_deco/wall-products/project-completed-luxury-villa-wall-cladding-01.jpg',
    width: 380,
    height: 480,
    tilt: -2.5,
    floatClass: 'sky-float-1',
    depth: 1.15,
    tag: 'Architectural Facade'
  },
  {
    id: 'sky-herringbone-parquet',
    title: 'Executive Penthouse Chevron Parquetry',
    category: 'Penthouses',
    location: 'Downtown Dubai / Burj District',
    material: '100% Waterproof SPC Rigid Core Parquet',
    description: 'Precision French herringbone parquetry with acoustic dampening IXPE underlay designed for high-altitude luxury apartments.',
    image: '/assets/decorforall/project-completed-herringbone-parquet-residential-05.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955830/dst_deco/gallery/projects/project-completed-herringbone-parquet-residential-05.webp',
    width: 360,
    height: 440,
    tilt: 2.8,
    floatClass: 'sky-float-2',
    depth: 0.95,
    tag: 'Flooring'
  },
  {
    id: 'sky-office-feature-wall',
    title: 'Corporate Headquarters Feature Wall',
    category: 'Commercial & Facades',
    location: 'DIFC Financial Centre, Dubai',
    material: 'Acoustic Wood Slat Louvers on Black Felt',
    description: 'Certified acoustic slat wall millwork on recycled black PET felt backing, dampening reverberation in executive conference suites.',
    image: '/assets/decorforall/project-completed-commercial-office-feature-wall-03.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793947944/dst_deco/wall-products/project-completed-commercial-office-feature-wall-03.jpg',
    width: 410,
    height: 500,
    tilt: -1.8,
    floatClass: 'sky-float-3',
    depth: 1.25,
    tag: 'Acoustics'
  },
  {
    id: 'sky-penthouse-grand-lounge',
    title: 'Royal Penthouse Grand Lounge',
    category: 'Penthouses',
    location: 'Palm Jumeirah, Dubai',
    material: 'Heavy Commercial Hardwood SPC Plank',
    description: 'Zero-expansion architectural flooring engineered for humid coastal waterfront villas and panoramic skyline penthouses.',
    image: '/assets/decorforall/project-completed-executive-penthouse-flooring-07.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955832/dst_deco/gallery/projects/project-completed-executive-penthouse-flooring-07.webp',
    width: 390,
    height: 460,
    tilt: 3.2,
    floatClass: 'sky-float-4',
    depth: 1.05,
    tag: 'Rigid Core'
  },
  {
    id: 'sky-hotel-lobby-marble',
    title: '5-Star Hotel Lobby Grand Floor',
    category: 'Commercial & Facades',
    location: 'Business Bay Canal, Dubai',
    material: 'SPC Polished Large Format Marble Tile',
    description: 'Mirror-finish bookmatched marble look with commercial AC5 wear layer and anti-slip R10 safety rating.',
    image: '/assets/decorforall/project-completed-hotel-lobby-marble-flooring-06.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955831/dst_deco/gallery/projects/project-completed-hotel-lobby-marble-flooring-06.webp',
    width: 370,
    height: 470,
    tilt: -3.0,
    floatClass: 'sky-float-5',
    depth: 0.9,
    tag: 'Polished Marble'
  },
  {
    id: 'sky-desert-gold-stone',
    title: 'Desert Gold Mountain Villa Accent',
    category: 'Luxury Villas',
    location: 'Al Barari Oasis, Dubai',
    material: 'Desert Gold Translucent Flexible Stone',
    description: 'Warm earth-toned natural quartzite sheet with backlit translucency option for dramatic architectural feature walls.',
    image: '/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955743/dst_deco/gallery/flexible-stone/flexible-stone-desert-gold-accent-wall-10.webp',
    width: 420,
    height: 510,
    tilt: 2.0,
    floatClass: 'sky-float-1',
    depth: 1.3,
    tag: 'Natural Stone'
  },
  {
    id: 'sky-exterior-facade-rock',
    title: 'Architectural Cliff Facade Panel',
    category: 'Commercial & Facades',
    location: 'Dubai Hills Estate',
    material: 'High-Density PU Mountain Rock Panel',
    description: 'Ultra-lightweight volcanic rock profile weighing only 3.8kg per panel, delivering monolithic boulder aesthetics.',
    image: '/assets/decorforall/project-completed-exterior-architectural-facade-09.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955834/dst_deco/gallery/projects/project-completed-exterior-architectural-facade-09.webp',
    width: 380,
    height: 460,
    tilt: -2.2,
    floatClass: 'sky-float-2',
    depth: 1.0,
    tag: 'Lightweight Rock'
  },
  {
    id: 'sky-modern-living-accent',
    title: 'Private Villa 3D Fluted Wall',
    category: 'Luxury Villas',
    location: 'Jumeirah Golf Estates, Dubai',
    material: 'WPC Fluted Slat & Integrated LED Profile',
    description: 'Seamless integration of hidden indirect LED channels with fluted walnut acoustic louvers for high-end residential interiors.',
    image: '/assets/decorforall/project-completed-modern-living-room-accent-wall-02.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955828/dst_deco/gallery/projects/project-completed-modern-living-room-accent-wall-02.webp',
    width: 360,
    height: 450,
    tilt: 2.5,
    floatClass: 'sky-float-3',
    depth: 1.1,
    tag: 'Fluted Louvers'
  },
  {
    id: 'sky-duplex-flooring',
    title: 'Panoramic Duplex Timber Flooring',
    category: 'Penthouses',
    location: 'City Walk, Dubai',
    material: 'LVT Luxury Vinyl Tile Planks',
    description: 'Scratch-resistant, pet-proof, and commercial heavy-traffic certified luxury vinyl with deep embossed woodgrain.',
    image: '/assets/decorforall/project-completed-duplex-apartment-hardwood-look-08.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955834/dst_deco/gallery/projects/project-completed-duplex-apartment-hardwood-look-08.webp',
    width: 390,
    height: 470,
    tilt: -1.5,
    floatClass: 'sky-float-4',
    depth: 0.95,
    tag: 'Luxury Vinyl'
  },
  {
    id: 'sky-mountain-cliff-stone',
    title: 'Mountain Cliff Geological Feature',
    category: 'Commercial & Facades',
    location: 'Meydan Luxury Club, Dubai',
    material: 'Volcanic PU Stone Relief Facets',
    description: 'Deep 3D geological crag profiles with high thermal insulation and zero structural weight burden.',
    image: '/assets/decorforall/big-pu-stone-mountain-cliff-facade-03.webp',
    cloudinary: 'https://res.cloudinary.com/bxpvt42p/image/upload/v1793955761/dst_deco/gallery/pu-stone/big-pu-stone-mountain-cliff-facade-03.webp',
    width: 400,
    height: 490,
    tilt: 1.9,
    floatClass: 'sky-float-5',
    depth: 1.2,
    tag: 'Geological Relief'
  }
];

const CATEGORIES = [
  'All Sky Works',
  'Luxury Villas',
  'Penthouses',
  'Commercial & Facades'
];

export default function SkyFloatingGallerySection({ onOpenQuote }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [items, setItems] = useState(DEFAULT_SKY_ITEMS);
  const [activeCategory, setActiveCategory] = useState('All Sky Works');
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrifting, setIsDrifting] = useState(true);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const animationFrameRef = useRef(null);

  // Fetch dynamic projects if available in backend
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((proj, idx) => ({
            id: proj._id || proj.slug || `db-${idx}`,
            title: proj.title,
            category: proj.category?.includes('Villa') ? 'Luxury Villas' :
                      proj.category?.includes('Penthouse') ? 'Penthouses' : 'Commercial & Facades',
            location: proj.locationArea || 'Dubai, UAE',
            material: proj.materialsSupplied?.join(', ') || 'Architectural Surface',
            description: proj.description || 'Verified Classical Decor ID architectural project execution in the UAE.',
            image: proj.coverImage || proj.gallery?.[0] || DEFAULT_SKY_ITEMS[idx % DEFAULT_SKY_ITEMS.length].image,
            cloudinary: proj.cloudinaryImages?.[0]?.secure_url || null,
            width: 380,
            height: 470,
            tilt: ((idx % 5) - 2) * 1.5,
            floatClass: `sky-float-${(idx % 5) + 1}`,
            depth: 0.9 + (idx % 4) * 0.15,
            tag: proj.category || 'Portfolio'
          }));
          // Merge dynamic projects at front with defaults
          setItems([...mapped, ...DEFAULT_SKY_ITEMS]);
        }
      })
      .catch(() => {});
  }, []);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'All Sky Works') return items;
    return items.filter(item => item.category === activeCategory);
  }, [items, activeCategory]);

  // Smooth mouse parallax over the virtual sky
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseParallax({ x, y });
  };

  // Auto-drifting loop in the sky
  useEffect(() => {
    let lastTime = performance.now();

    const step = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isDrifting && !isDragging) {
        setScrollOffset(prev => {
          const speed = 28; // pixels per second
          const newOffset = prev + speed * dt;
          const maxScroll = (filteredItems.length * 400);
          return newOffset >= maxScroll ? 0 : newOffset;
        });
      }
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isDrifting, isDragging, filteredItems.length]);

  // Drag to pan freely across the sky
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartScroll.current = scrollOffset;
  };

  const handleMouseMoveGlobal = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX.current;
    setScrollOffset(Math.max(0, dragStartScroll.current - delta * 1.5));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag for mobile devices
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartX.current = e.touches[0].clientX;
      dragStartScroll.current = scrollOffset;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const delta = e.touches[0].clientX - dragStartX.current;
    setScrollOffset(Math.max(0, dragStartScroll.current - delta * 1.5));
  };

  // Fullscreen browser toggle
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
      onMouseMove={handleMouseMove}
      className={`relative w-full overflow-hidden select-none transition-all duration-700 bg-radial from-[#0c1322] via-[#080d18] to-[#04060b] text-white ${
        isFullscreen ? 'h-screen w-screen' : 'min-h-[820px] lg:min-h-[920px] py-16 sm:py-24'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #172238 0%, #0c1220 45%, #05080f 85%, #020307 100%)'
      }}
      aria-label="Celestial Floating Architectural Gallery"
    >
      {/* 1. SKY ATMOSPHERE: Celestial Auroras & Glowing Sun/Moon Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Golden Celestial Sun Glow in the upper sky */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] sm:w-[950px] h-[520px] rounded-full sky-gold-pulse pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(229, 169, 36, 0.22) 0%, rgba(212, 175, 55, 0.08) 50%, transparent 80%)'
          }}
        />

        {/* Deep Cyan / Indigo Atmospheric Cloud Glow */}
        <div
          className="absolute top-1/3 -left-48 w-[600px] h-[600px] rounded-full blur-[90px] opacity-25 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute bottom-10 -right-48 w-[700px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(229, 169, 36, 0.20) 0%, transparent 75%)'
          }}
        />

        {/* Floating Translucent Clouds drifting across the sky */}
        <div className="absolute top-12 left-0 right-0 h-96 opacity-35 sky-cloud-drift-1 pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-[140%] h-full fill-white/10 filter blur-2xl">
            <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,240C1248,245,1344,203,1392,181.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-80 opacity-25 sky-cloud-drift-2 pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-[150%] h-full fill-amber-100/10 filter blur-3xl">
            <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,186.7C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        {/* Ambient Twinkling Cosmic Embers & Stardust */}
        {[
          { top: '15%', left: '12%', delay: '0s', size: 2 },
          { top: '28%', left: '84%', delay: '1.2s', size: 3 },
          { top: '45%', left: '22%', delay: '2.5s', size: 2.5 },
          { top: '65%', left: '78%', delay: '0.8s', size: 2 },
          { top: '20%', left: '48%', delay: '1.9s', size: 3.5 },
          { top: '75%', left: '35%', delay: '3.1s', size: 2 },
          { top: '38%', left: '62%', delay: '2.2s', size: 2.5 },
          { top: '82%', left: '90%', delay: '1.5s', size: 3 }
        ].map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-200 sky-star-twinkle shadow-[0_0_8px_#E5A924]"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay
            }}
          />
        ))}
      </div>

      {/* 2. SECTION HEADER & FLOATING SKY CONTROLS */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 pointer-events-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-[11px] font-mono uppercase tracking-[0.22em] text-[#E5A924] font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A924] animate-spin-slow" />
              <span>Celestial Sky Showcase · Dubai & UAE Architectural Portfolio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white mt-3 tracking-tight drop-shadow-md">
              Floating in the Sky.
            </h2>
            <p className="font-sans text-stone-300 text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed">
              Experience Classical Decor ID&apos;s verified completed architectural masterpieces floating freely across an infinite Dubai sky. Drag, hover, and immerse yourself in real-world surface executions.
            </p>
          </div>

          {/* Interactive Sky Command Bar */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Drift Play / Pause */}
            <button
              type="button"
              onClick={() => setIsDrifting(!isDrifting)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold backdrop-blur-md transition active:scale-95 text-stone-200"
              title={isDrifting ? "Pause sky drift" : "Resume sky drift"}
            >
              {isDrifting ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#E5A924]" />
                  <span>Floating Drift: Active</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-stone-300" />
                  <span>Drift Paused</span>
                </>
              )}
            </button>

            {/* Native Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullScreen}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E5A924] hover:bg-[#f0b533] text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition active:scale-95"
              title="Enter full-screen sky view"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Sky View</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>Full Screen Sky View</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Category Filters Pills floating in sky */}
        <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex flex-wrap items-center gap-2" role="tablist">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all backdrop-blur-md ${
                    isActive
                      ? 'bg-white text-stone-950 font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      : 'bg-white/5 border border-white/10 text-stone-300 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-stone-400">
            <span>✨ Drag or scroll horizontally to explore</span>
          </div>
        </div>
      </div>

      {/* 3. INFINITE 3D FLOATING SKY CANVAS ("আকাশে আকাশে সব ভেসে বেড়াচ্ছে") */}
      <div
        className="relative z-10 w-full overflow-hidden cursor-grab active:cursor-grabbing py-8 sm:py-12"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMoveGlobal}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div
          ref={trackRef}
          className="flex items-center gap-8 sm:gap-12 px-6 sm:px-12 transition-transform duration-100 ease-out will-change-transform"
          style={{
            transform: `translateX(-${scrollOffset}px)`
          }}
        >
          {filteredItems.map((item, index) => {
            // Calculate dynamic 3D tilt & parallax based on mouse
            const parallaxX = mouseParallax.x * 20 * item.depth;
            const parallaxY = mouseParallax.y * 18 * item.depth;
            const dynamicRotate = item.tilt + (mouseParallax.x * 3);

            return (
              <div
                key={`${item.id}-${index}`}
                className={`relative shrink-0 group transition-all duration-500 ${item.floatClass}`}
                style={{
                  width: `${item.width}px`,
                  transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0px) rotate(${dynamicRotate}deg)`,
                  zIndex: Math.round(item.depth * 10)
                }}
              >
                {/* Frosted Glass Floating Card Container */}
                <div
                  onClick={() => setActiveLightbox(item)}
                  className="relative rounded-3xl overflow-hidden bg-stone-900/60 border border-white/20 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] group-hover:border-[#E5A924] group-hover:shadow-[0_30px_70px_rgba(229,169,36,0.35)] transition-all duration-500 cursor-pointer"
                  style={{ height: `${item.height}px` }}
                >
                  {/* High Resolution Architectural Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    onError={(e) => {
                      if (item.cloudinary && e.target.src !== item.cloudinary) {
                        e.target.src = item.cloudinary;
                      }
                    }}
                  />

                  {/* Ethereal Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:via-black/20 transition-all duration-300" />

                  {/* Top Badge: Material Spec & Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#E5A924] border border-amber-400/30 shadow-md">
                      {item.tag}
                    </span>
                    <button
                      type="button"
                      aria-label="Expand image"
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-[#E5A924] hover:text-stone-950 text-white flex items-center justify-center backdrop-blur-md transition shadow-md pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLightbox(item);
                      }}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom Architectural Info Banner */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 bg-gradient-to-t from-black via-black/85 to-transparent">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300/90 mb-1.5">
                      <MapPin className="w-3 h-3 text-[#E5A924] shrink-0" />
                      <span>{item.location}</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#E5A924] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="font-sans text-[11px] text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                        {item.material}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E5A924] group-hover:translate-x-1 transition-transform">
                        <span>Inspect Finish</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ambient Soft Underglow for Floating Depth */}
                <div
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(229,169,36,0.6) 0%, transparent 70%)'
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SKY NAVIGATION CONTROLS (Left & Right Gliders) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScrollOffset(prev => Math.max(0, prev - 450))}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E5A924] hover:text-stone-950 text-white border border-white/15 flex items-center justify-center backdrop-blur-md transition active:scale-90"
            aria-label="Scroll sky left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setScrollOffset(prev => prev + 450)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E5A924] hover:text-stone-950 text-white border border-white/15 flex items-center justify-center backdrop-blur-md transition active:scale-90"
            aria-label="Scroll sky right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenQuote?.('VIP Architectural Portfolio Consultation')}
            className="btn-luxury-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-950" />
            <span>Request Finish Specifications</span>
          </button>
        </div>
      </div>

      {/* 5. FULL-SCREEN THEATRICAL CINEMA LIGHTBOX ("FULL SCREEN IMAGES") */}
      {activeLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5A924] animate-ping" />
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-[#E5A924] uppercase tracking-[0.2em] block">
                  {activeLightbox.category} · {activeLightbox.location}
                </span>
                <h4 className="font-serif text-lg sm:text-2xl font-bold text-white truncate">
                  {activeLightbox.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={getWhatsAppInquiryLink({ category: `Project Specification: ${activeLightbox.title} (${activeLightbox.material})` })}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold font-sans transition shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setActiveLightbox(null)}
                aria-label="Close fullscreen theater"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Fullscreen Image Stage */}
          <div className="relative flex-1 flex items-center justify-center py-4 max-w-7xl mx-auto w-full overflow-hidden">
            <button
              type="button"
              onClick={() => navigateLightbox(-1)}
              aria-label="Previous project"
              className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-[#E5A924] hover:text-stone-950 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition shadow-2xl active:scale-90"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="relative max-h-full max-w-full flex items-center justify-center">
              <img
                src={activeLightbox.image}
                alt={activeLightbox.title}
                className="max-h-[70vh] sm:max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/15"
                onError={(e) => {
                  if (activeLightbox.cloudinary && e.target.src !== activeLightbox.cloudinary) {
                    e.target.src = activeLightbox.cloudinary;
                  }
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => navigateLightbox(1)}
              aria-label="Next project"
              className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-[#E5A924] hover:text-stone-950 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition shadow-2xl active:scale-90"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Specifications & Actions */}
          <div className="max-w-7xl mx-auto w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="font-mono text-xs text-[#E5A924] font-semibold">
                Architectural Specification: {activeLightbox.material}
              </p>
              <p className="font-sans text-xs text-stone-300 mt-1 max-w-2xl">
                {activeLightbox.description}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveLightbox(null);
                  onOpenQuote?.(activeLightbox.title);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E5A924] text-stone-950 font-bold text-xs uppercase tracking-wider hover:bg-[#f3be43] transition shadow-lg"
              >
                Request Material Sample
              </button>
              <a
                href={getWhatsAppInquiryLink({ category: `Project Specification: ${activeLightbox.title}` })}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold font-sans"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
