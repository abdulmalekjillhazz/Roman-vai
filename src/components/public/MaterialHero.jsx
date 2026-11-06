import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import FallbackImage from './FallbackImage.jsx';
import { CLIENT_INFO } from '../../config/clientInfo.js';
import { MATERIAL_HERO_SLIDES } from '../../config/materialHeroSlides.js';

const AUTOPLAY_MS = 5000;

export default function MaterialHero({ onOpenQuote }) {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const [imageOverrides, setImageOverrides] = useState({});
  const pointerStart = useRef(null);
  const previousTimer = useRef(null);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

  const handleNavigate = useCallback((index) => {
    const target = (index + MATERIAL_HERO_SLIDES.length) % MATERIAL_HERO_SLIDES.length;
    if (target === active) return;
    setPrevious(active);
    setActive(target);
    window.clearTimeout(previousTimer.current);
    previousTimer.current = window.setTimeout(() => setPrevious(null), 1000);
  }, [active]);

  // Detect user motion preferences & tab visibility
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setVisible(!document.hidden);

    updateMotion();
    preference.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);

    return () => {
      preference.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiBase}/hero-slides`, { cache: 'no-store', signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Hero images could not be loaded (${response.status}).`);
        return response.json();
      })
      .then(data => {
        if (data.slides && typeof data.slides === 'object') setImageOverrides(data.slides);
      })
      .catch(error => {
        if (error.name !== 'AbortError') console.warn('Using default hero images:', error.message);
      });

    return () => controller.abort();
  }, [apiBase]);

  // Bulletproof Continuous Autoplay Engine: Auto-cycles photo & text continuously
  useEffect(() => {
    if (isPaused || reducedMotion || !visible) return;

    const timer = window.setInterval(() => handleNavigate(active + 1), AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [active, handleNavigate, isPaused, reducedMotion, visible]);

  useEffect(() => () => window.clearTimeout(previousTimer.current), []);

  const currentSlide = MATERIAL_HERO_SLIDES[active];

  return (
    <section
      aria-label="Architectural Material Collection Showcase"
      aria-roledescription="carousel"
      className="relative w-full h-screen min-h-[660px] max-h-[1080px] lg:h-[100dvh] overflow-hidden bg-stone-950 select-none"
      onPointerDown={event => {
        if (event.target.closest('a, button')) return;
        pointerStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={event => {
        const start = pointerStart.current;
        pointerStart.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(event.clientY - start.y)) {
          handleNavigate(active + (dx < 0 ? 1 : -1));
        }
      }}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
    >
      {/* =========================================================================
          1. FULL-BLEED SLIDE IMAGES WITH CINEMATIC KEN BURNS MOTION
          ========================================================================= */}
      {MATERIAL_HERO_SLIDES.map((slide, index) => {
        const isCurrent = index === active;
        const shouldRenderImage = isCurrent || index === previous;

        return (
          <div
            key={slide.file}
            aria-hidden={!isCurrent}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {shouldRenderImage && (
              <FallbackImage
                src={imageOverrides[slide.file] || `/assets/decorforall/${slide.file}.webp`}
                alt={`${slide.title} - ${slide.eyebrow}`}
                fetchPriority={isCurrent && index === 0 ? 'high' : 'auto'}
                loading="eager"
                draggable={false}
                width={1920}
                height={1080}
                className={`h-full w-full object-cover transition-transform ${
                  isCurrent && !reducedMotion ? 'animate-ken-burns' : 'scale-100'
                }`}
              />
            )}
          </div>
        );
      })}

      {/* =========================================================================
          2. MULTI-LAYERED ARCHITECTURAL LUXURY LIGHTING VIGNETTES
          ========================================================================= */}
      {/* Top subtle vignette for transparent floating navbar readability */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-black/85 via-black/35 to-transparent" />
      {/* Left directional vignette for text contrast while keeping right textures vibrant */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/35 to-transparent sm:from-black/85 sm:via-black/45 sm:to-transparent" />
      {/* Bottom vignette for sleek timeline & indicator contrast */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

      {/* =========================================================================
          3. MAIN CONTENT CONTAINER (FLOATING OVER HERO)
          ========================================================================= */}
      <div className="relative z-20 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-10 lg:px-8">
        
        {/* Top Architectural Dispatch Indicator */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/45 px-3.5 py-1.5 backdrop-blur-xl shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-[#E5A924] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f5ebd7] sm:text-xs">
              Architectural Materials · Dubai & UAE Projects
            </span>
          </div>
        </div>

        {/* Dedicated Sheer Architectural Showcase Panel (Ultra-Subtle Glass - Image Shines Through Crystal Clear) */}
        <div className="my-auto max-w-2xl pt-4 pb-4">
          <div
            className="rounded-3xl border border-white/15 bg-black/20 sm:bg-black/25 p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-sm transition-all"
          >
            {/* Dynamic Text Group (Smoke Mist Condensation on Every Auto/Manual Slide Change) */}
            <div key={active} className="space-y-3.5">
              {/* 1. Slide Project Tag */}
              <div className="smoke-in-1 inline-flex items-center gap-2 rounded-full border border-[#d4b77a]/50 bg-[#d4b77a]/20 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5ebd7] sm:text-xs shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#E5A924]" />
                <span>{currentSlide.eyebrow}</span>
              </div>

              {/* 2. Dynamic Headline */}
              <h1 className="smoke-in-2 font-serif text-3xl font-semibold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-5.5xl">
                {currentSlide.title}
              </h1>

              {/* 3. Dynamic Description */}
              <p className="smoke-in-3 mt-4 text-xs leading-relaxed text-stone-200 sm:text-sm sm:leading-6">
                {currentSlide.description}
              </p>

              {/* 4. Architectural Specifications Bar */}
              <div className="smoke-in-4 mt-5 border-t border-white/15 pt-3.5">
                <span className="text-[11px] sm:text-xs font-medium text-[#eedec2]">
                  Specification: {currentSlide.specs}
                </span>
              </div>
            </div>

            {/* 5. Luxury Call to Action Buttons (Stable & Permanently Clickable - Outside Smoke Effect) */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {/* Primary Metallic Gold CTA Button */}
              <a
                href="#product-catalog"
                className="btn-luxury-gold group inline-flex min-h-12 items-center gap-2.5 rounded-xl px-6 text-xs font-bold uppercase tracking-wider text-stone-950 active:scale-95 shadow-md transition-all"
              >
                <span>{currentSlide.actionText}</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Direct WhatsApp Concierge CTA Button */}
              <a
                href={`https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent(
                  `Hello Classical Decor ID, I am interested in ${currentSlide.eyebrow} (${currentSlide.actionTopic}). Please share specifications and wholesale trade pricing.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_25px_-4px_rgba(37,211,102,0.4)] hover:shadow-[0_14px_30px_-4px_rgba(37,211,102,0.65)] hover:from-[#20ba59] hover:to-[#0e7467] transition-all duration-300 active:scale-95"
              >
                <svg
                  className="w-4 h-4 fill-current shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.031 0C5.396 0 .029 5.367.029 12.002c0 2.118.553 4.187 1.603 6.007L0 24l6.167-1.618a11.97 11.97 0 005.864 1.518h.005c6.634 0 12.001-5.367 12.001-12.002C24.037 5.368 18.67 0 12.031 0zm0 21.897c-1.8 0-3.565-.484-5.105-1.4l-.366-.217-3.793.995 1.013-3.697-.238-.379a9.92 9.92 0 01-1.521-5.197c0-5.498 4.474-9.972 9.975-9.972 2.664 0 5.168 1.038 7.051 2.922a9.92 9.92 0 012.921 7.052c0 5.499-4.474 9.973-9.975 9.973zm5.467-7.464c-.299-.15-1.771-.874-2.046-.974-.275-.1-.475-.15-.675.15s-.774.974-.95 1.173c-.174.2-.349.225-.648.075-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.494-1.78-1.669-2.079-.175-.3-.019-.462.131-.611.135-.134.299-.349.449-.524.15-.175.2-.3.3-.5.1-.2.05-.374-.025-.524-.075-.15-.675-1.623-.925-2.222-.243-.583-.49-.504-.674-.513-.174-.009-.374-.01-.574-.01s-.524.075-.798.374c-.275.3-1.049 1.024-1.049 2.5 0 1.474 1.074 2.898 1.224 3.098.15.2 2.113 3.227 5.119 4.526.715.309 1.273.494 1.708.632.718.228 1.371.196 1.888.118.577-.087 1.771-.724 2.021-1.423.25-.699.25-1.298.175-1.423-.075-.125-.275-.2-.575-.35z" />
                </svg>
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. ARCHITECTURAL TIMELINE, LIVE PROGRESS & CONTROLS
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Slide Interactive Timeline with Live Progress */}
          <div
            className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none"
            aria-label="Select material slide"
          >
            {MATERIAL_HERO_SLIDES.map((item, index) => {
              const isSelected = active === index;

              return (
                <button
                  key={item.file}
                  type="button"
                  aria-label={`View slide ${index + 1}: ${item.title}`}
                  aria-pressed={isSelected}
                  onClick={() => handleNavigate(index)}
                  className="group relative flex h-7 items-center justify-center px-1 focus-visible:outline-none"
                >
                  <div className="relative h-1.5 rounded-full overflow-hidden bg-white/25 transition-all duration-300">
                    {isSelected ? (
                      <div className="w-10 sm:w-14 h-full bg-white/20">
                        <div
                          key={`${active}-${isPaused}`}
                          className="h-full bg-gradient-to-r from-[#e7d5b2] via-[#E5A924] to-[#f3e5cb] rounded-full shadow-sm"
                          style={{
                            animation: `progressFill ${AUTOPLAY_MS}ms linear forwards`,
                            animationPlayState: isPaused ? 'paused' : 'running'
                          }}
                        />
                      </div>
                    ) : (
                      <span className="block w-2.5 sm:w-3 h-full group-hover:w-4 group-hover:bg-white/70 transition-all duration-200" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Luxury Controls: Play/Pause and Next/Prev */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            
            {/* Status indicator pill */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-stone-300 backdrop-blur-md">
              <span className={`h-1.5 w-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
              <span>{isPaused ? 'Paused' : 'Live Auto'}</span>
            </div>

            {/* Play/Pause Button */}
            {!reducedMotion && (
              <button
                type="button"
                aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
                onClick={() => setIsPaused(val => !val)}
                className="hero-control"
                title={isPaused ? 'Play slideshow' : 'Pause slideshow'}
              >
                {isPaused ? <Play size={14} className="translate-x-0.5" /> : <Pause size={14} />}
              </button>
            )}

            {/* Previous Slide Button */}
            <button
              type="button"
              aria-label="Previous material slide"
              onClick={() => handleNavigate(active - 1)}
              className="hero-control"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Next Slide Button */}
            <button
              type="button"
              aria-label="Next material slide"
              onClick={() => handleNavigate(active + 1)}
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
