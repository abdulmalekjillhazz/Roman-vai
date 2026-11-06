import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import FallbackImage from './FallbackImage.jsx';

const SLIDES = [
  {
    file: 'project-completed-luxury-villa-wall-cladding-01',
    label: 'Illuminated feature walls',
    project: 'Dubai Hills Villa Cladding',
    specs: 'Flexible Stone • Warm Travertine Texture • Fire-Rated'
  },
  {
    file: 'project-completed-modern-living-room-accent-wall-02',
    label: 'Timber-look TV wall',
    project: 'Emirates Hills Residence',
    specs: 'WPC Fluted Louvers • Matte Walnut Finish'
  },
  {
    file: 'project-completed-commercial-office-feature-wall-03',
    label: 'Layered wall finishes',
    project: 'DIFC Executive Office',
    specs: 'Acoustic Wood Slats • Charcoal Sound Dampening'
  },
  {
    file: 'project-completed-luxury-spc-flooring-installation-04',
    label: 'Illuminated wall details',
    project: 'Palm Jumeirah Penthouse',
    specs: 'PU Faux Rock • Deep Relief Architectural Stone'
  },
  {
    file: 'project-completed-herringbone-parquet-residential-05',
    label: 'Herringbone hallway',
    project: 'Jumeirah Golf Estates Villa',
    specs: 'SPC Herringbone • Ultra-Matte Nordic Oak'
  },
  {
    file: 'project-completed-hotel-lobby-marble-flooring-06',
    label: 'Illuminated staircase',
    project: 'Downtown Dubai Boutique Hotel',
    specs: 'PVC Marble Continuous Bookmatched Slab'
  },
  {
    file: 'project-completed-executive-penthouse-flooring-07',
    label: 'Interior flooring detail',
    project: 'Bluewaters Penthouse',
    specs: 'Wide Plank SPC 6.5mm • Waterproof IXPE Core'
  },
  {
    file: 'project-completed-duplex-apartment-hardwood-look-08',
    label: 'Timber-look stair finish',
    project: 'Dubai Marina Duplex',
    specs: 'Seamless Stair Bullnose Profiles • Flush Transition'
  },
  {
    file: 'project-completed-exterior-architectural-facade-09',
    label: 'Exterior wall cladding',
    project: 'Al Barari Private Villa',
    specs: 'UV-Stabilized Exterior Flexible Rock Cladding'
  },
  {
    file: 'spc-herringbone-flooring-luxury-villa-salon-parquetry-09',
    label: 'Herringbone living-room floor',
    project: 'Meydan Luxury Residence',
    specs: 'Heavy Commercial AC5 Wear Layer • Silent Step'
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
    }, 5500);
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
      className="mx-auto max-w-[1440px] px-3 pt-4 sm:px-6 lg:px-8"
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
      }}
    >
      <div
        className="material-hero relative isolate min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] overflow-hidden rounded-2xl bg-stone-950 sm:rounded-3xl shadow-2xl"
        style={{ touchAction: 'pan-y' }}
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
        {/* Cinematic Multi-Layer Slides with Smooth Crossfade & Ken Burns Micro-Zoom */}
        {SLIDES.map((slide, index) => {
          const isCurrent = index === active;
          const isPrev = index === prevActive;
          // Keep active, previous active, and slide 0 (for LCP) in DOM to ensure zero-delay crossfade
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
                alt={`${slide.label} - ${slide.project}`}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                loading={index === 0 ? 'eager' : 'lazy'}
                draggable={false}
                width={1440}
                height={900}
                className={`h-full w-full select-none object-cover transition-transform duration-[6000ms] ease-out motion-reduce:transform-none ${
                  isCurrent && !reducedMotion ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Multi-layered architectural shadow gradient overlays for pristine readability */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-radial-gradient from-transparent via-transparent to-black/40" />

        {/* Content Container */}
        <div className="relative z-20 flex h-full min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] flex-col justify-between p-6 sm:p-10 lg:p-14">
          
          {/* Top Bar: Dubai B2B Eyebrow & Numbered Counter */}
          <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#E5A924] animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e6d5b2] sm:text-xs">
                Architectural Materials · Dubai & UAE
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-[11px] uppercase tracking-[0.18em] text-white/70 sm:inline-block">
                {currentSlide.project}
              </span>
              <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1 font-mono text-xs backdrop-blur-md">
                <span className="font-bold text-[#E5A924]">{String(active + 1).padStart(2, '0')}</span>
                <span className="text-white/40">/</span>
                <span className="text-white/60">{String(SLIDES.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Central Hero Headline & Specifications */}
          <div className="max-w-2xl py-8 text-white">
            {/* Animated Project & Material Pill */}
            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-[#d4b77a]/40 bg-[#d4b77a]/15 px-3.5 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#E5A924]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f5ebd7] sm:text-xs">
                {currentSlide.label}
              </span>
              <span className="hidden text-white/40 sm:inline">•</span>
              <span className="hidden text-[10px] text-white/80 sm:inline">{currentSlide.specs}</span>
            </div>

            <h1 className="font-serif text-[clamp(2.7rem,5.8vw,5.2rem)] font-semibold leading-[1.02] tracking-[-0.03em] drop-shadow-lg">
              Surfaces that make<br />
              an <span className="italic text-[#eadbc0]">entrance.</span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base sm:leading-7 drop-shadow">
              Considered wall finishes, luxury SPC flooring, and architectural details engineered for high-end residential villas and commercial spaces across the UAE.
            </p>

            {/* CTAs with Gold Specular Elevation */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#product-catalog"
                className="group inline-flex min-h-12 items-center gap-3 rounded-xl bg-gradient-to-r from-[#e7d5b2] via-[#f3e5cb] to-[#d4b77a] px-6 text-xs font-bold uppercase tracking-wider text-stone-900 shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-[#e7d5b2]/30 active:scale-[0.98]"
              >
                Explore Materials
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <button
                type="button"
                onClick={() => onOpenQuote?.('Material Samples')}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-black/30 px-6 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 hover:border-[#E5A924] hover:bg-white/15 hover:text-[#f3e5cb] active:scale-[0.98]"
              >
                Request Sample Box
              </button>
            </div>
          </div>

          {/* Bottom Controls Bar: Dynamic Progress Bar & Capsule Switchers */}
          <div className="space-y-4 border-t border-white/20 pt-4">
            {/* Live Progress Bar for Active Slide */}
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
              <div
                key={active}
                className={`h-full bg-gradient-to-r from-[#d4b77a] via-[#E5A924] to-[#f3e5cb] ${
                  paused || reducedMotion ? 'w-full opacity-60' : 'animate-hero-progress'
                }`}
                style={{
                  animationDuration: '5500ms',
                  animationPlayState: paused ? 'paused' : 'running'
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Slide Capsule Indicators */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none" aria-label="Select material slide">
                {SLIDES.map((item, index) => (
                  <button
                    key={item.file}
                    type="button"
                    aria-label={`View slide ${index + 1}: ${item.label}`}
                    aria-pressed={active === index}
                    onClick={() => navigate(index)}
                    className="group relative flex h-7 items-center justify-center px-1 focus-visible:outline-none"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-500 ${
                        active === index
                          ? 'w-7 sm:w-10 bg-gradient-to-r from-[#d4b77a] to-[#E5A924] shadow-sm shadow-[#E5A924]/60'
                          : 'w-2 sm:w-3 bg-white/40 group-hover:bg-white/70'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Navigation Arrows & Play/Pause */}
              <div className="flex items-center gap-2">
                {!reducedMotion && (
                  <button
                    type="button"
                    aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                    onClick={() => setPaused(value => !value)}
                    className="hero-control"
                  >
                    {paused ? <Play size={15} /> : <Pause size={15} />}
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Previous material view"
                  onClick={() => navigate(active - 1)}
                  className="hero-control"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next material view"
                  onClick={() => navigate(active + 1)}
                  className="hero-control"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
