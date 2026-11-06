import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import FallbackImage from './FallbackImage.jsx';

const SLIDES = [
  ['project-completed-luxury-villa-wall-cladding-01', 'Illuminated feature walls'],
  ['project-completed-modern-living-room-accent-wall-02', 'Timber-look TV wall'],
  ['project-completed-commercial-office-feature-wall-03', 'Layered wall finishes'],
  ['project-completed-luxury-spc-flooring-installation-04', 'Illuminated wall details'],
  ['project-completed-herringbone-parquet-residential-05', 'Herringbone hallway'],
  ['project-completed-hotel-lobby-marble-flooring-06', 'Illuminated staircase'],
  ['project-completed-executive-penthouse-flooring-07', 'Interior flooring detail'],
  ['project-completed-duplex-apartment-hardwood-look-08', 'Timber-look stair finish'],
  ['project-completed-exterior-architectural-facade-09', 'Exterior wall cladding'],
  ['spc-herringbone-flooring-luxury-villa-salon-parquetry-09', 'Herringbone living-room floor']
];
export default function MaterialHero({ onOpenQuote }) {
  const [active, setActive] = useState(0);
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
    update(); preference.addEventListener('change', update); document.addEventListener('visibilitychange', visibility);
    return () => { preference.removeEventListener('change', update); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    if (paused || reducedMotion || interacting || !visible) return;
    const timer = window.setInterval(() => { if (Date.now() >= pauseUntil.current) setActive(index => (index + 1) % SLIDES.length); }, 5500);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, interacting, visible]);
  function navigate(index) { pauseUntil.current = Date.now() + 16000; setActive((index + SLIDES.length) % SLIDES.length); }
  const [file, label] = SLIDES[active];
  return <section aria-label="Material inspiration" aria-roledescription="carousel" className="mx-auto max-w-[1440px] px-3 pt-4 sm:px-6 lg:px-8" onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
    <div className="material-hero relative isolate overflow-hidden rounded-2xl bg-stone-900 sm:rounded-3xl" style={{ touchAction: 'pan-y' }}
      onPointerDown={event => { if (event.target.closest('a,button')) return; pointerStart.current = { x: event.clientX, y: event.clientY }; }}
      onPointerUp={event => { const start = pointerStart.current; pointerStart.current = null; if (!start) return; const dx = event.clientX - start.x; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(event.clientY - start.y)) navigate(active + (dx < 0 ? 1 : -1)); }} onPointerCancel={() => { pointerStart.current = null; }}>
      <FallbackImage key={file} src={`/assets/decorforall/${file}.webp`} alt={label} fetchPriority={active === 0 ? 'high' : 'auto'} loading={active === 0 ? 'eager' : 'lazy'} draggable={false} width={1440} height={900} className="hero-image absolute inset-0 h-full w-full select-none object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/5" /><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-10 lg:p-14">
        <div className="flex items-center justify-between gap-3 text-white"><span className="text-[10px] font-medium uppercase tracking-[0.22em] sm:text-xs">Architectural materials · Dubai, UAE</span><span className="hidden text-[10px] uppercase tracking-[0.18em] text-white/80 sm:block">The art of the finish</span></div>
        <div className="max-w-2xl pb-8 pt-12 text-white"><p className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[#e6d5b2]"><span className="h-px w-8 bg-[#d4b77a]" />{label}</p><h1 className="font-serif text-[clamp(2.7rem,6.2vw,5.5rem)] font-semibold leading-[1.01] tracking-[-0.035em]">Surfaces that make<br />an <span className="italic text-[#eadbc0]">entrance.</span></h1><p className="mt-5 max-w-md text-sm leading-6 text-white/90 sm:text-base sm:leading-7">Considered wall finishes, flooring and architectural details. For the spaces you have in mind.</p>
          <div className="mt-7 flex flex-wrap gap-3"><a href="#product-catalog" className="inline-flex min-h-12 items-center gap-3 rounded-lg bg-[#e7d5b2] px-5 text-xs font-bold text-stone-900 transition hover:bg-[#f3e5cb]">Explore Materials <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a><button type="button" onClick={() => onOpenQuote('Material samples')} className="min-h-12 rounded-lg border border-white/60 bg-black/15 px-5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/15">Request Samples</button></div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-white/25 pt-4"><div className="flex items-center" aria-label="Select material view">{SLIDES.map(([itemFile, itemLabel], index) => <button key={itemFile} type="button" aria-label={`View ${itemLabel.toLowerCase()}`} aria-pressed={active === index} onClick={() => navigate(index)} className="flex h-9 w-6 items-center justify-center sm:w-7"><span className={`block h-1 rounded-full transition-all ${active === index ? 'w-5 bg-[#e7d5b2]' : 'w-1.5 bg-white/60'}`} /></button>)}</div><div className="flex gap-1.5">{!reducedMotion && <button type="button" aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setPaused(value => !value)} className="hero-control">{paused ? <Play size={15} /> : <Pause size={15} />}</button>}<button type="button" aria-label="Previous material view" onClick={() => navigate(active - 1)} className="hero-control hidden sm:flex"><ChevronLeft size={18} /></button><button type="button" aria-label="Next material view" onClick={() => navigate(active + 1)} className="hero-control hidden sm:flex"><ChevronRight size={18} /></button></div></div>
      </div>
    </div>
  </section>;
}
