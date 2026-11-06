import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AudioLines, BrickWall, Building2, Columns3, GalleryVerticalEnd, Grid2X2,
  Grid3X3, Layers3, Mountain, PanelsTopLeft, Shapes, TreeDeciduous,
  ArrowUpRight, ChevronLeft, ChevronRight, MessageCircle, X
} from 'lucide-react';
import SEOHead from '../components/public/SEOHead.jsx';
import FallbackImage from '../components/public/FallbackImage.jsx';
import useModalDialog from '../hooks/useModalDialog.js';
import { CLIENT_INFO } from '../config/clientInfo.js';

const MANIFEST_URL = '/assets/decorforall/gallery-categories.json';
const CATEGORY_ICONS = {
  'flexible-stone': Mountain, 'pu-stone': BrickWall, 'wpc-panels': PanelsTopLeft,
  'decorative-wall-panels': Shapes, 'pvc-marble': Layers3, 'acoustic-panels': AudioLines,
  'spc-straight': GalleryVerticalEnd, 'spc-herringbone': Grid3X3, 'spc-marble-lvt': Grid2X2,
  'profiles-skirting': Columns3, woodworking: TreeDeciduous, projects: Building2
};
const CATEGORY_DESCRIPTIONS = {
  'flexible-stone': 'Stone textures for feature walls, columns and interior details.',
  'pu-stone': 'Sculpted textures for walls with depth and character.',
  'wpc-panels': 'Linear and fluted finishes for interior walls.',
  'decorative-wall-panels': 'Panels, louvers and mouldings for a considered finish.',
  'pvc-marble': 'Marble-inspired surfaces for feature walls and interior cladding.',
  'acoustic-panels': 'Slatted panel styles for warm, layered spaces.',
  'spc-straight': 'Wood-inspired plank designs for a clean flooring finish.',
  'spc-herringbone': 'Classic patterns that make the floor part of the design.',
  'spc-marble-lvt': 'Stone-inspired and LVT flooring finishes.',
  'profiles-skirting': 'Finishing details for edges, transitions and wall bases.',
  woodworking: 'Decorative sheets for custom interior features.',
  projects: 'A closer look at materials in interior spaces.'
};

export default function SiteImageGalleryPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [visibleLimit, setVisibleLimit] = useState(24);
  const [activeImage, setActiveImage] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const dialogRef = useModalDialog(Boolean(activeImage), () => setActiveImage(null), event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      moveActiveImage(event.key === 'ArrowRight' ? 1 : -1);
    }
  });

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetch(MANIFEST_URL, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('The material gallery is unavailable right now. Please try again.');
        return response.json();
      })
      .then(manifest => {
        if (!Array.isArray(manifest.categories)) throw new Error('The material gallery is unavailable right now. Please try again.');
        setCategories(manifest.categories.filter(category => category.images?.length));
      })
      .catch(fetchError => { if (!controller.signal.aborted) setError(fetchError.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [retry]);

  const selectedCategory = categories.find(category => category.id === selectedCategoryId);
  const allImages = useMemo(() => categories.flatMap(category => category.images.map(image => ({
    ...image, categoryId: category.id, categoryTitle: category.title,
    key: `${category.id}-${image.src}`
  }))), [categories]);
  const filteredImages = useMemo(() => selectedCategoryId
    ? allImages.filter(image => image.categoryId === selectedCategoryId) : allImages, [allImages, selectedCategoryId]);
  const visibleImages = filteredImages.slice(0, visibleLimit);

  function selectCategory(categoryId) {
    setSelectedCategoryId(categoryId);
    setVisibleLimit(24);
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function quoteUrl(image) {
    const context = [image?.categoryTitle, image?.title || image?.alt].filter(Boolean).join(' — ');
    return `https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent(
      `Hello Classical Decor ID, I am interested in ${context || selectedCategory?.title || 'your material collection'}. Please share specifications and sample availability.`
    )}`;
  }
  function moveActiveImage(direction) {
    if (!activeImage || filteredImages.length < 2) return;
    const index = filteredImages.findIndex(image => image.key === activeImage.key);
    setActiveImage(filteredImages[(index + direction + filteredImages.length) % filteredImages.length]);
  }
  function handlePointerDown(event) {
    if (filteredImages.length < 2 || (event.pointerType === 'mouse' && event.button !== 0)) return;
    dragStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function handlePointerMove(event) {
    if (!dragStart.current) return;
    const dx = event.clientX - dragStart.current.x;
    if (Math.abs(dx) > Math.abs(event.clientY - dragStart.current.y)) setDragOffset(Math.max(-80, Math.min(80, dx)));
  }
  function handlePointerEnd(event) {
    const drag = dragStart.current;
    dragStart.current = null;
    setDragOffset(0);
    if (!drag || event.type === 'pointercancel') return;
    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(event.clientY - drag.y)) moveActiveImage(dx < 0 ? 1 : -1);
  }

  return (
    <div className="min-h-[60vh]">
      <SEOHead title="Material Gallery | Classical Decor ID" description="Explore wall panels, stone textures, flooring and architectural finishing details for projects in Dubai and the UAE." canonicalPath="/gallery" />
      <div className="mx-auto flex w-full max-w-7xl items-start gap-6 px-4 py-8 sm:px-6 lg:gap-9 lg:px-8 lg:py-12">
        {!loading && !error && categories.length > 0 && (
          <aside aria-label="Material categories" className="sticky top-24 hidden max-h-[calc(100dvh-120px)] w-[72px] shrink-0 flex-col self-start rounded-2xl border border-stone-200 bg-white p-2 md:flex xl:w-52">
            <button type="button" title="All materials" aria-label="All materials" aria-pressed={!selectedCategoryId} onClick={() => selectCategory('')} className={`flex min-h-11 shrink-0 items-center justify-center gap-3 rounded-xl px-2 text-xs font-semibold xl:justify-start ${!selectedCategoryId ? 'bg-[#eee3cc] text-[#62491d]' : 'text-stone-600 hover:bg-stone-50'}`}>
              <Grid2X2 size={19} className="shrink-0" /><span className="hidden xl:block">All materials</span>
            </button>
            <div className="my-2 border-t border-stone-200" />
            <nav className="min-h-0 space-y-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
              {categories.map(category => {
                const Icon = CATEGORY_ICONS[category.id] || Grid2X2;
                const active = selectedCategoryId === category.id;
                return <button key={category.id} type="button" title={category.title} aria-label={category.title} aria-pressed={active} onClick={() => selectCategory(category.id)} className={`flex min-h-11 w-full items-center justify-center gap-3 rounded-xl px-2 py-2 text-left text-xs font-medium transition-colors xl:justify-start ${active ? 'bg-[#eee3cc] text-[#62491d]' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'}`}>
                  <Icon size={19} className="shrink-0" /><span className="hidden xl:block">{category.title}</span>
                </button>;
              })}
            </nav>
          </aside>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-800">The material library</p>
          <div className="mb-7 mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl leading-tight text-stone-950 sm:text-5xl">{selectedCategory?.title || 'Find your finish.'}</h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600">{selectedCategory ? CATEGORY_DESCRIPTIONS[selectedCategory.id] : 'Explore surfaces, textures and details. Open a collection to see the materials up close.'}</p>
            </div>
            {selectedCategory && <button type="button" onClick={() => selectCategory('')} className="min-h-11 rounded-lg border border-stone-300 px-4 text-xs font-semibold text-stone-700 hover:bg-white">All collections</button>}
          </div>
          {!loading && !error && categories.length > 0 && <div className="mb-6 md:hidden">
            <label htmlFor="gallery-category" className="mb-2 block text-xs font-medium text-stone-600">Choose a material</label>
            <select id="gallery-category" value={selectedCategoryId} onChange={event => selectCategory(event.target.value)} className="min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-900">
              <option value="">All collections</option>
              {categories.map(category => <option key={category.id} value={category.id}>{category.title}</option>)}
            </select>
          </div>}
          {loading ? <div role="status" className="grid grid-cols-2 gap-4 lg:grid-cols-3"><span className="sr-only">Loading material gallery</span>{[0, 1, 2, 3, 4, 5].map(key => <div key={key} className="aspect-[4/3] rounded-2xl bg-stone-200 motion-safe:animate-pulse" />)}</div>
            : error ? <div className="rounded-2xl border border-stone-200 bg-white p-6"><p role="alert" className="text-sm text-stone-700">{error}</p><button type="button" onClick={() => setRetry(value => value + 1)} className="mt-4 min-h-11 rounded-xl bg-stone-900 px-5 text-sm text-white">Try again</button></div>
            : selectedCategory ? <section aria-label={`${selectedCategory.title} finishes`}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {visibleImages.map(image => <button key={image.key} type="button" onClick={() => setActiveImage(image)} aria-label={`View ${image.title || image.alt || selectedCategory.title}`} className="group overflow-hidden rounded-xl border border-stone-200 bg-white text-left">
                  <FallbackImage src={image.src} alt={image.alt || image.title || selectedCategory.title} loading="lazy" decoding="async" cloudinaryWidth={480} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none" />
                  <p className="px-3 py-3 text-xs leading-relaxed text-stone-700">{image.title || image.alt || selectedCategory.title}</p>
                </button>)}
              </div>
              {visibleLimit < filteredImages.length && <div className="mt-8 text-center"><button type="button" onClick={() => setVisibleLimit(limit => limit + 24)} className="min-h-11 rounded-xl border border-stone-300 bg-white px-6 text-sm font-semibold text-stone-800">Explore more finishes</button></div>}
            </section> : <section aria-label="Material collections" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(category => <article key={category.id} className="group min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <button type="button" onClick={() => selectCategory(category.id)} className="flex h-full w-full flex-col text-left" aria-label={`Explore ${category.title}`}>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100"><FallbackImage src={category.images[0].src} alt={category.images[0].alt || category.title} loading="lazy" decoding="async" cloudinaryWidth={480} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none" /></div>
                  <div className="flex w-full items-center justify-between gap-3 p-5"><h2 className="text-sm font-semibold text-stone-900">{category.title}</h2><ArrowUpRight size={18} className="shrink-0 text-amber-800" /></div>
                </button>
              </article>)}
            </section>}
        </div>
      </div>
      {activeImage && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-6" onClick={() => setActiveImage(null)}>
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="gallery-image-title" tabIndex={-1} className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-48px)]" onClick={event => event.stopPropagation()}>
          <button type="button" onClick={() => setActiveImage(null)} className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/75 text-white hover:bg-black" aria-label="Close image"><X size={20} /></button>
          <div className="relative min-h-0 touch-pan-y select-none overflow-hidden bg-stone-950" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd}>
            <FallbackImage src={activeImage.src} alt={activeImage.alt || activeImage.categoryTitle} cloudinaryWidth={1400} draggable={false} className="max-h-[68dvh] w-full object-contain" style={{ transform: `translateX(${dragOffset}px)` }} />
            {filteredImages.length > 1 && <>
              <button type="button" onPointerDown={event => event.stopPropagation()} onClick={() => moveActiveImage(-1)} aria-label="Previous gallery image" className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white hover:bg-black"><ChevronLeft size={22} /></button>
              <button type="button" onPointerDown={event => event.stopPropagation()} onClick={() => moveActiveImage(1)} aria-label="Next gallery image" className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white hover:bg-black"><ChevronRight size={22} /></button>
            </>}
          </div>
          <div className="flex shrink-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-800">{activeImage.categoryTitle}</p><h2 id="gallery-image-title" className="mt-1 text-sm font-semibold leading-relaxed text-stone-900">{activeImage.title || activeImage.alt || activeImage.categoryTitle}</h2></div>
            <a href={quoteUrl(activeImage)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#176846] px-4 py-3 text-xs font-semibold text-white hover:bg-[#125438]"><MessageCircle size={17} />Ask on WhatsApp</a>
          </div>
        </div>
      </div>}
    </div>
  );
}
