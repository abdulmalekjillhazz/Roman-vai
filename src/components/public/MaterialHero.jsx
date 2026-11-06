import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import FallbackImage from './FallbackImage.jsx';

const SLIDES = [
  {
    file: 'project-completed-luxury-villa-wall-cladding-01',
    eyebrow: 'Flexible Stone Cladding · Dubai Hills Villa',
    title: 'Surfaces that make an entrance.',
    description: 'Natural bendable stone veneers and curved architectural columns engineered for luxury villas across Dubai and the UAE.',
    specs: 'Natural Travertine Texture • Ultra-Thin 3mm • Fire-Rated',
    actionText: 'Explore Flexible Stone',
    actionTopic: 'Flexible Stone Samples'
  },
  {
    file: 'project-completed-modern-living-room-accent-wall-02',
    eyebrow: 'WPC Fluted Panels · Emirates Hills Residence',
    title: 'Linear warmth. Architectural depth.',
    description: 'Precision-extruded wood-plastic composite fluted panels and TV feature walls with rich acoustic dampening.',
    specs: 'Matte Walnut Finish • 100% Moisture Proof • Termite Resistant',
    actionText: 'Explore Wall Panels',
    actionTopic: 'WPC Wall Panel Samples'
  },
  {
    file: 'project-completed-commercial-office-feature-wall-03',
    eyebrow: 'Acoustic Wood Slats · DIFC Executive Headquarters',
    title: 'Acoustic elegance for executive spaces.',
    description: 'Natural wood veneer slats backed by recycled PET sound-absorbing felt, built for corporate boardrooms and luxury offices.',
    specs: 'High Sound Absorption NRC 0.85 • Class A Flame Retardant',
    actionText: 'Explore Acoustic Slats',
    actionTopic: 'Acoustic Slat Samples'
  },
  {
    file: 'project-completed-luxury-spc-flooring-installation-04',
    eyebrow: 'PU Faux Rock · Palm Jumeirah Beachfront Villa',
    title: 'Geological drama. Featherweight form.',
    description: 'Ultra-lightweight high-density polyurethane faux rock with deep 3D volcanic stone relief textures for statement walls.',
    specs: '3D Deep Relief • Lightweight 3.5kg/panel • Seamless Jointing',
    actionText: 'Explore PU Stone',
    actionTopic: 'PU Rock Samples'
  },
  {
    file: 'project-completed-herringbone-parquet-residential-05',
    eyebrow: 'SPC Herringbone · Jumeirah Golf Estates',
    title: 'Timeless European parquetry underfoot.',
    description: 'Classic herringbone SPC rigid core flooring combining old-world craftsmanship with modern waterproof endurance.',
    specs: 'Ultra-Matte Nordic Oak • Heavy Commercial AC5 • Silent IXPE Underlay',
    actionText: 'Explore Herringbone',
    actionTopic: 'Herringbone Flooring Samples'
  },
  {
    file: 'project-completed-hotel-lobby-marble-flooring-06',
    eyebrow: 'PVC Monolithic Marble · Downtown Boutique Hotel',
    title: 'Continuous marble grandeur.',
    description: 'High-gloss UV-coated monolithic PVC marble slabs for bookmatched feature walls, staircases, and lobby cladding.',
    specs: 'Continuous Bookmatched Grain • Scratch-Resistant UV Shield',
    actionText: 'Explore PVC Marble',
    actionTopic: 'PVC Marble Samples'
  },
  {
    file: 'project-completed-executive-penthouse-flooring-07',
    eyebrow: 'Wide Plank SPC · Bluewaters Luxury Penthouse',
    title: 'Quiet luxury in wide format planks.',
    description: 'Extra-wide waterproof SPC rigid core planks with synchronized deep wood grain embossing and integrated acoustic backing.',
    specs: '6.5mm Rigid Core • 100% Waterproof • Zero Formaldehyde',
    actionText: 'Explore SPC Flooring',
    actionTopic: 'SPC Flooring Samples'
  },
  {
    file: 'project-completed-duplex-apartment-hardwood-look-08',
    eyebrow: 'Architectural Profiles · Dubai Marina Duplex',
    title: 'The art of the seamless transition.',
    description: 'Integrated aluminum LED profiles, stair bullnose transitions, and waterproof polymer skirtings for flawless architectural detailing.',
    specs: 'Anodized Architectural Aluminum • Flush LED Channels',
    actionText: 'Explore Profiles',
    actionTopic: 'Architectural Profile Samples'
  },
  {
    file: 'project-completed-exterior-architectural-facade-09',
    eyebrow: 'Exterior Flexible Veneer · Al Barari Private Villa',
    title: 'Engineered for the Arabian climate.',
    description: 'Weather-tested flexible stone veneers and exterior rock cladding built to endure intense UV exposure, desert heat, and humidity.',
    specs: 'UV-Stabilized • Thermal Expansion Resistant • Non-Combustible',
    actionText: 'Explore Exterior Stone',
    actionTopic: 'Exterior Stone Samples'
  },
  {
    file: 'spc-herringbone-flooring-luxury-villa-salon-parquetry-09',
    eyebrow: 'Commercial Grade Parquetry · Meydan Luxury Residence',
    title: 'Built for a five-star first impression.',
    description: 'High-traffic commercial AC5 parquetry engineered for grand residential salons, luxury hotels, and prestigious retail destinations.',
    specs: 'Commercial Grade AC5 • High-Traffic Scratch Guard • Silent Step',
    actionText: 'Explore Parquetry',
    actionTopic: 'Parquetry Flooring Samples'
  }
];

export default function MaterialHero({ onOpenQuote }) {
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(true);
  const pauseUntil = useRef(0);
  const pointerStart = useRef(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    const visibility = () => setVisible(!document.hidden);
    update();
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      preference.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || interacting || !visible) return;
    const timer = window.setInterval(() => {
      if (Date.now() >= pauseUntil.current) {
        navigate((active + 1) % SLIDES.length);
      }
    }, 6000);
    return () => window.clearInterval(timer);
  }, [active, paused, reducedMotion, interacting, visible]);

  function navigate(index) {
    pauseUntil.current = Date.now() + 16000;
    const target = (index + SLIDES.length) % SLIDES.length;
    if (target === active) return;
    setPrevActive(active);
    setActive(target);
  }

  const currentSlide = SLIDES[active];

  return (
    <section
      aria-label="Material inspiration"
      aria-roledescription="carousel"
      className="relative w-full h-[88vh] min-h-[640px] max-h-[960px] overflow-hidden bg-stone-950 select-none"
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
      }}
      onPointerDown={event => {
        if (event.target.closest('a,button')) return;
        pointerStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={event => {
        const start = pointerStart.current;
        pointerStart.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(event.clientY - start.y)) {
          navigate(active + (dx < 0 ? 1 : -1));
        }
      }}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
    >
      {/* Full-Screen High-Resolution Crystal Clear Slides */}
      {SLIDES.map((slide, index) => {
        const isCurrent = index === active;
        const isPrev = index === prevActive;
        if (!isCurrent && !isPrev && index !== 0) return null;

        return (
          <div
            key={slide.file}
            aria-hidden={!isCurrent}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <FallbackImage
              src={`/assets/decorforall/${slide.file}.webp`}
              alt={`${slide.title} - ${slide.eyebrow}`}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              loading={index === 0 ? 'eager' : 'lazy'}
              draggable={false}
              width={1920}
              height={1080}
              className={`h-full w-full object-cover transition-transform duration-[7000ms] ease-out motion-reduce:transform-none ${
                isCurrent && !reducedMotion ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        );
      })}

      {/* Subtle localized gradient on the left side only - leaves the rest of the image vibrant and clear */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/25 to-transparent sm:from-black/70 sm:via-black/35 sm:to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Main Full-Screen Overlay Container */}
      <div className="relative z-20 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        
        {/* Top Eyebrow & Status Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#E5A924] animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f5ebd7] sm:text-xs">
              Architectural Materials · Dubai & UAE
            </span>
          </div>

          {/* Minimalist Slide Counter */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3.5 py-1 font-mono text-xs text-white backdrop-blur-md">
            <span className="font-bold text-[#E5A924]">{String(active + 1).padStart(2, '0')}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/60">{String(SLIDES.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Dedicated Frosted Glass Architectural Text Environment */}
        <div className="my-auto max-w-2xl pt-4 pb-6">
          <div
            key={currentSlide.file}
            className="animate-fadeIn rounded-3xl border border-white/20 bg-black/45 p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all"
          >
            {/* Slide Project Tag */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d4b77a]/40 bg-[#d4b77a]/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f5ebd7] sm:text-xs">
              <Sparkles className="h-3 w-3 text-[#E5A924]" />
              <span>{currentSlide.eyebrow}</span>
            </div>

            {/* Dynamic Headline */}
            <h1 className="font-serif text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-5.5xl">
              {currentSlide.title}
            </h1>

            {/* Dynamic Description */}
            <p className="mt-4 text-xs leading-relaxed text-stone-200 sm:text-sm sm:leading-6">
              {currentSlide.description}
            </p>

            {/* Architectural Specifications Pill */}
            <div className="mt-4 border-t border-white/15 pt-3">
              <span className="text-[11px] font-medium text-[#e6d5b2]">
                Specification: {currentSlide.specs}
              </span>
            </div>

            {/* Dynamic CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#product-catalog"
                className="group inline-flex min-h-12 items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#e7d5b2] via-[#f3e5cb] to-[#d4b77a] px-6 text-xs font-bold uppercase tracking-wider text-stone-900 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {currentSlide.actionText}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <button
                type="button"
                onClick={() => onOpenQuote?.(currentSlide.actionTopic)}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 hover:border-[#E5A924] hover:bg-white/20 hover:text-[#f3e5cb] active:scale-95"
              >
                Request Sample
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Minimalist Controls: Capsule Buttons & Arrows */}
        <div className="flex items-center justify-between gap-4">
          {/* Slide Capsule Indicators */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none" aria-label="Select material slide">
            {SLIDES.map((item, index) => (
              <button
                key={item.file}
                type="button"
                aria-label={`View slide ${index + 1}: ${item.title}`}
                aria-pressed={active === index}
                onClick={() => navigate(index)}
                className="group relative flex h-7 items-center justify-center px-0.5 focus-visible:outline-none"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    active === index
                      ? 'w-7 sm:w-9 bg-[#E5A924] shadow-sm shadow-[#E5A924]/60'
                      : 'w-2 bg-white/35 group-hover:bg-white/70'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            {!reducedMotion && (
              <button
                type="button"
                aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                onClick={() => setPaused(value => !value)}
                className="hero-control"
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            )}
            <button
              type="button"
              aria-label="Previous material slide"
              onClick={() => navigate(active - 1)}
              className="hero-control"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next material slide"
              onClick={() => navigate(active + 1)}
              className="hero-control"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
