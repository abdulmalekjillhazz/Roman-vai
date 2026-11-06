import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AudioLines, BrickWall, Building2, Columns3, GalleryVerticalEnd, Grid2X2,
  Grid3X3, Layers3, Mountain, PanelsTopLeft, Shapes, TreeDeciduous,
  ArrowUpRight, ChevronLeft, ChevronRight, MessageCircle, X,
  Sparkles, CheckCircle2, Search, SlidersHorizontal, ArrowLeft
} from 'lucide-react';
import SEOHead from '../components/public/SEOHead.jsx';
import FallbackImage from '../components/public/FallbackImage.jsx';
import useModalDialog from '../hooks/useModalDialog.js';
import { CLIENT_INFO } from '../config/clientInfo.js';

const MANIFEST_URL = '/assets/decorforall/gallery-categories.json';

const CATEGORY_ICONS = {
  'spc-flooring': GalleryVerticalEnd,
  'lvt-flooring': Grid2X2,
  'flexible-stone': Mountain,
  'wpc-chipboard-panel-sheet': PanelsTopLeft,
  'wall-panel': Shapes,
  'pu-stone': BrickWall,
  'molding': Columns3,
  'columns-partition': Columns3,
  'acoustic-panel': AudioLines,
  'pvc-marble-sheet': Layers3,
  '3d-velvet-fabric-roll': Sparkles,
  '3d-soft-stone-roll': Mountain,
  'flexible-3d-sheet': TreeDeciduous,
  'aluminium-profiles': Columns3,
  'silicon': CheckCircle2
};

const CATEGORY_DESCRIPTIONS = {
  'spc-flooring': 'Stone Polymer Composite 100% waterproof luxury rigid core flooring planks with authentic wood grain texture.',
  'lvt-flooring': 'High-traffic Luxury Vinyl Tile (LVT) flooring in natural polished stone, concrete, and timber looks.',
  'flexible-stone': 'Ultra-thin, bendable natural stone veneer sheets for curved architectural columns, facades, and interior walls.',
  'wpc-chipboard-panel-sheet': 'Heavy-duty 5mm and 8mm calibrated WPC chipboard sheets and fluted panels for custom joinery and cabinetry.',
  'wall-panel': 'Architectural fluted, slatted, and 3D textured interior wall panels for luxury villa and commercial feature walls.',
  'pu-stone': 'Ultra-lightweight high-density polyurethane faux rock and volcanic stone relief panels with 3D geological textures.',
  'molding': 'High-density polystyrene ceiling cornices, crown moldings, and neoclassical wainscoting wall frames.',
  'columns-partition': 'Architectural vertical louver screens and fluted room divider columns for elegant spatial separation.',
  'acoustic-panel': 'Sound-absorbing architectural wood slat acoustic panels with premium black recycled PET felt backing.',
  'pvc-marble-sheet': 'Ultra-glossy monolithic UV-coated marble effect sheets for continuous bookmatched feature walls.',
  '3d-velvet-fabric-roll': 'Luxurious 3D embossed acoustic velvet fabric rolls featuring geometric relief patterns for lavish spaces.',
  '3d-soft-stone-roll': 'Continuous rollable 3D soft stone veneer textured sheets for seamless jointless curved claddings.',
  'flexible-3d-sheet': 'Flexible textured architectural relief sheets featuring wave carvings and geometric diamond facets.',
  'aluminium-profiles': 'Architectural-grade extruded aluminum LED channel profiles, edge capping, and stair bullnosings.',
  'silicon': 'Heavy-duty STARO hybrid polymer structural adhesives and neutral silicone for instant heavy grab.'
};

export default function SiteImageGalleryPage({ onOpenQuote }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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
      .catch(fetchError => {
        if (!controller.signal.aborted) setError(fetchError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retry]);

  const selectedCategory = categories.find(category => category.id === selectedCategoryId);

  const allImages = useMemo(() => categories.flatMap(category => category.images.map(image => ({
    ...image,
    categoryId: category.id,
    categoryTitle: category.title,
    key: `${category.id}-${image.src}`
  }))), [categories]);

  const filteredImages = useMemo(() => {
    let images = selectedCategoryId
      ? allImages.filter(image => image.categoryId === selectedCategoryId)
      : allImages;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      images = images.filter(image =>
        (image.title || '').toLowerCase().includes(q) ||
        (image.alt || '').toLowerCase().includes(q) ||
        (image.categoryTitle || '').toLowerCase().includes(q)
      );
    }

    return images;
  }, [allImages, selectedCategoryId, searchQuery]);

  const visibleImages = filteredImages.slice(0, visibleLimit);

  function selectCategory(categoryId) {
    setSelectedCategoryId(categoryId);
    setVisibleLimit(24);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }

  function quoteUrl(image) {
    const context = [image?.categoryTitle, image?.title || image?.alt].filter(Boolean).join(' — ');
    return `https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent(
      `Hello Classical Decor ID, I am specifying materials in UAE and interested in ${context || selectedCategory?.title || 'your material collection'}. Please share specifications, samples and wholesale pricing.`
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
    if (Math.abs(dx) > Math.abs(event.clientY - dragStart.current.y)) {
      setDragOffset(Math.max(-80, Math.min(80, dx)));
    }
  }

  function handlePointerEnd(event) {
    const drag = dragStart.current;
    dragStart.current = null;
    setDragOffset(0);
    if (!drag || event.type === 'pointercancel') return;
    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(event.clientY - drag.y)) {
      moveActiveImage(dx < 0 ? 1 : -1);
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <SEOHead
        title="Architectural Material Gallery | Classical Decor ID Dubai"
        description="Explore 100+ high-definition finishes: flexible stone, PU faux rock, fluted wall panels, and SPC flooring. Fast physical sample delivery across Dubai & UAE."
        canonicalPath="/gallery"
      />

      {/* Luxury Gallery Top Header */}
      <section className="border-b border-stone-200/80 bg-gradient-to-b from-[#f5ede0]/60 to-transparent pt-8 pb-6 sm:pt-12 sm:pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-800/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">
                <Sparkles className="h-3 w-3 text-[#d4b77a]" />
                Architectural Finishes Specification Library
              </div>
              <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
                {selectedCategory?.title || 'The Material Library.'}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                {selectedCategory
                  ? CATEGORY_DESCRIPTIONS[selectedCategory.id]
                  : 'High-definition architectural textures, physical sample references, and engineering specifications for interior designers and contractors in Dubai and UAE.'}
              </p>
            </div>

            {/* Quick Action Badges / Sample CTA */}
            <div className="flex flex-wrap items-center gap-3">
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => selectCategory('')}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-stone-400 hover:bg-stone-50"
                >
                  <ArrowLeft size={16} />
                  All Collections
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenQuote?.(selectedCategory?.title ? `${selectedCategory.title} Sample Request` : 'Material Sample Box')}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4b77a] via-[#E5A924] to-[#f3e5cb] px-5 text-xs font-bold uppercase tracking-wider text-stone-950 shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles size={15} />
                Request Sample Kit
              </button>
            </div>
          </div>

          {/* Quick Search & Mobile Category Scroller */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
              <input
                type="search"
                aria-label="Search material finishes"
                placeholder="Search finish (e.g. Travertine, Slate, Herringbone, Walnut)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="floating-input min-h-11 w-full rounded-xl border border-stone-300 bg-white pl-10 pr-4 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-700"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
              <SlidersHorizontal size={14} className="text-[#8a6b36]" />
              <span>
                {filteredImages.length} {filteredImages.length === 1 ? 'Finish Available' : 'Finishes Available in UAE'}
              </span>
            </div>
          </div>

          {/* Horizontal Mobile Category Pills */}
          {!loading && !error && categories.length > 0 && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none md:hidden">
              <button
                type="button"
                onClick={() => selectCategory('')}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  !selectedCategoryId
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'border border-stone-300 bg-white text-stone-700'
                }`}
              >
                All Collections ({categories.length})
              </button>
              {categories.map(category => {
                const Icon = CATEGORY_ICONS[category.id] || Grid2X2;
                const active = selectedCategoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => selectCategory(category.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition ${
                      active
                        ? 'bg-gradient-to-r from-[#292524] to-[#1c1917] text-[#e7d5b2] border border-[#d4b77a]/60 shadow-md'
                        : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Icon size={14} className={active ? 'text-[#E5A924]' : 'text-stone-500'} />
                    <span>{category.title}</span>
                    <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-600">
                      {category.images.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="mx-auto flex w-full max-w-7xl items-start gap-6 px-4 pt-8 sm:px-6 lg:gap-8 lg:px-8">
        
        {/* Desktop Luxury Sticky Sidebar */}
        {!loading && !error && categories.length > 0 && (
          <aside
            aria-label="Material categories"
            className="sticky top-24 hidden max-h-[calc(100dvh-120px)] w-60 shrink-0 flex-col self-start rounded-2xl border border-stone-200/90 bg-white/90 p-3.5 shadow-sm backdrop-blur-md md:flex"
          >
            <div className="px-2 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                Material Categories
              </span>
            </div>

            <button
              type="button"
              title="All collections"
              aria-label="All collections"
              aria-pressed={!selectedCategoryId}
              onClick={() => selectCategory('')}
              className={`flex min-h-11 shrink-0 items-center justify-between rounded-xl px-3 text-xs font-semibold transition ${
                !selectedCategoryId
                  ? 'bg-gradient-to-r from-stone-900 to-stone-800 text-white shadow-md'
                  : 'text-stone-700 hover:bg-stone-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Grid2X2 size={17} className={!selectedCategoryId ? 'text-[#E5A924]' : 'text-stone-500'} />
                <span>All Collections</span>
              </div>
              <span className={`text-[10px] rounded-full px-2 py-0.5 ${!selectedCategoryId ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                {categories.length}
              </span>
            </button>

            <div className="my-2 border-t border-stone-200" />

            <nav className="min-h-0 space-y-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]">
              {categories.map(category => {
                const Icon = CATEGORY_ICONS[category.id] || Grid2X2;
                const active = selectedCategoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    title={category.title}
                    aria-label={category.title}
                    aria-pressed={active}
                    onClick={() => selectCategory(category.id)}
                    className={`group flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#1c1917] text-[#e7d5b2] shadow-md border-l-2 border-[#E5A924]'
                        : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon size={16} className={`shrink-0 ${active ? 'text-[#E5A924]' : 'text-stone-400 group-hover:text-stone-700'}`} />
                      <span className="truncate">{category.title}</span>
                    </div>
                    <span className={`shrink-0 text-[10px] font-mono rounded-full px-1.5 py-0.5 ${active ? 'bg-white/15 text-[#e7d5b2]' : 'bg-stone-100 text-stone-500'}`}>
                      {category.images.length}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Gallery Grid Area */}
        <div className="min-w-0 flex-1">
          {loading ? (
            <div role="status" className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <span className="sr-only">Loading material gallery</span>
              {[0, 1, 2, 3, 4, 5].map(key => (
                <div key={key} className="aspect-[4/3] rounded-2xl bg-stone-200 motion-safe:animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
              <p role="alert" className="text-sm text-stone-700">{error}</p>
              <button
                type="button"
                onClick={() => setRetry(value => value + 1)}
                className="mt-4 min-h-11 rounded-xl bg-stone-900 px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-stone-800"
              >
                Try Again
              </button>
            </div>
          ) : selectedCategory ? (
            /* Selected Category: Finish Swatches */
            <section aria-label={`${selectedCategory.title} finishes`}>
              <div className="mb-4 flex items-center justify-between border-b border-stone-200 pb-3">
                <p className="text-xs font-semibold text-stone-500">
                  Showing {visibleImages.length} of {filteredImages.length} finishes in {selectedCategory.title}
                </p>
                <button
                  type="button"
                  onClick={() => onOpenQuote?.(`${selectedCategory.title} Full Specification Sheet`)}
                  className="text-xs font-semibold text-[#8a6b36] hover:underline"
                >
                  Download Specs PDF / Quote
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {visibleImages.map((image, index) => (
                  <button
                    key={image.key}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    aria-label={`View finish: ${image.title || image.alt || selectedCategory.title}`}
                    className="floating-card group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 text-left transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <FallbackImage
                        src={image.src}
                        alt={image.alt || image.title || selectedCategory.title}
                        loading={index < 2 ? 'eager' : 'lazy'}
                        fetchPriority={index === 0 ? 'high' : 'auto'}
                        decoding="async"
                        cloudinaryWidth={480}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 motion-reduce:transform-none"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="rounded-lg bg-black/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                          Inspect 3D Finish
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                          {selectedCategory.title}
                        </span>
                        <h2 className="mt-1 text-xs sm:text-sm font-semibold leading-snug text-stone-900 group-hover:text-amber-900">
                          {image.title || image.alt || selectedCategory.title}
                        </h2>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2 text-[11px] text-stone-500">
                        <span>UAE Ready Stock</span>
                        <ArrowUpRight size={14} className="text-amber-800 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {visibleLimit < filteredImages.length && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleLimit(limit => limit + 24)}
                    className="min-h-12 rounded-xl border border-stone-300 bg-white px-8 text-xs font-bold uppercase tracking-wider text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-50"
                  >
                    Load More Finishes ({filteredImages.length - visibleLimit} Remaining)
                  </button>
                </div>
              )}
            </section>
          ) : (
            /* All Collections View */
            <section aria-label="Material collections" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => {
                const Icon = CATEGORY_ICONS[category.id] || Grid2X2;
                return (
                  <article
                    key={category.id}
                    className="floating-card group min-w-0 overflow-hidden rounded-2xl border border-stone-200/90 transition-all duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => selectCategory(category.id)}
                      className="flex h-full w-full flex-col text-left focus:outline-none"
                      aria-label={`Explore ${category.title} collection`}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                        <FallbackImage
                          src={category.images[0].src}
                          alt={category.images[0].alt || category.title}
                          loading={index < 2 ? 'eager' : 'lazy'}
                          fetchPriority={index === 0 ? 'high' : 'auto'}
                          decoding="async"
                          cloudinaryWidth={480}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 motion-reduce:transform-none"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        
                        {/* Gold Finish Count Pill */}
                        <div className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-[#e7d5b2] backdrop-blur-md">
                          {category.images.length} Finishes
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e7d5b2]">
                            <Icon size={14} className="text-[#E5A924]" />
                            <span>Collection</span>
                          </div>
                          <h2 className="mt-1 text-base sm:text-lg font-bold text-white group-hover:text-[#f5ede0]">
                            {category.title}
                          </h2>
                        </div>
                      </div>

                      <div className="flex w-full flex-1 flex-col justify-between p-4 sm:p-5">
                        <p className="text-xs leading-relaxed text-stone-600 line-clamp-2">
                          {CATEGORY_DESCRIPTIONS[category.id] || 'High-end architectural surface finish.'}
                        </p>
                        
                        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs font-semibold text-amber-900">
                          <span>View Full Material Specs</span>
                          <ArrowUpRight size={16} className="text-amber-800 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      </div>
                    </button>
                  </article>
                );
              })}
            </section>
          )}

          {/* Ultra-Luxury Architectural B2B Call to Action Section */}
          <section className="mt-16 overflow-hidden rounded-3xl border border-stone-800 bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#141414] p-8 text-white shadow-2xl sm:p-12 lg:p-14">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d4b77a]/40 bg-[#d4b77a]/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e6d5b2]">
                  <Sparkles className="h-3.5 w-3.5 text-[#E5A924]" />
                  Architectural Trade Service · Dubai & UAE
                </div>

                <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  Designing a Villa or Commercial Project in Dubai?
                </h2>

                <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-stone-300">
                  Request a curated physical sample box with your selected flexible stone, SPC flooring, or fluted panels delivered directly to your design studio, firm, or site across Dubai and Abu Dhabi.
                </p>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-stone-300">
                  <span className="flex items-center gap-1.5 text-[#e6d5b2]">
                    <CheckCircle2 className="h-4 w-4 text-[#E5A924]" />
                    Complimentary for Fit-Out & Design Studios
                  </span>
                  <span className="flex items-center gap-1.5 text-[#e6d5b2]">
                    <CheckCircle2 className="h-4 w-4 text-[#E5A924]" />
                    24h Express UAE Delivery
                  </span>
                  <span className="flex items-center gap-1.5 text-[#e6d5b2]">
                    <CheckCircle2 className="h-4 w-4 text-[#E5A924]" />
                    Civil Defence Ready Spec Sheets
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3.5 sm:flex-row lg:flex-col lg:items-end">
                <button
                  type="button"
                  onClick={() => onOpenQuote?.('Curated Sample Box - Gallery')}
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#e7d5b2] via-[#f3e5cb] to-[#d4b77a] px-8 text-xs font-bold uppercase tracking-wider text-stone-900 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[#e7d5b2]/30 active:scale-[0.98] sm:w-auto"
                >
                  Order Physical Sample Box
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                <a
                  href={`https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent(
                    'Hello Classical Decor ID, I am specifying materials for an interior project in UAE. Please connect me with an architectural materials consultant.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/30 bg-white/10 px-8 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366]/20 active:scale-[0.98] sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  Chat with Materials Consultant
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* High-Resolution VIP Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 backdrop-blur-md sm:p-6"
          onClick={() => setActiveImage(null)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-image-title"
            tabIndex={-1}
            className="floating-modal relative flex max-h-[calc(100dvh-24px)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-stone-800 bg-[#141414] text-white shadow-2xl sm:max-h-[calc(100dvh-48px)]"
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition hover:bg-black hover:border-white/40"
              aria-label="Close image"
            >
              <X size={20} />
            </button>

            <div
              className="relative min-h-0 touch-pan-y select-none overflow-hidden bg-stone-950 flex items-center justify-center"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
            >
              <FallbackImage
                src={activeImage.src}
                alt={activeImage.alt || activeImage.categoryTitle}
                cloudinaryWidth={1400}
                draggable={false}
                className="max-h-[66dvh] w-full object-contain"
                style={{ transform: `translateX(${dragOffset}px)` }}
              />

              {filteredImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onPointerDown={event => event.stopPropagation()}
                    onClick={() => moveActiveImage(-1)}
                    aria-label="Previous gallery image"
                    className="hero-control absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onPointerDown={event => event.stopPropagation()}
                    onClick={() => moveActiveImage(1)}
                    aria-label="Next gallery image"
                    className="hero-control absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Footer Actions */}
            <div className="flex shrink-0 flex-col gap-4 border-t border-stone-800 bg-stone-900/95 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E5A924]">
                  {activeImage.categoryTitle}
                </span>
                <h2
                  id="gallery-image-title"
                  className="mt-1 text-sm sm:text-base font-semibold leading-relaxed text-white"
                >
                  {activeImage.title || activeImage.alt || activeImage.categoryTitle}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const title = activeImage.title || activeImage.alt || activeImage.categoryTitle;
                    setActiveImage(null);
                    onOpenQuote?.(`${activeImage.categoryTitle} - ${title}`);
                  }}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4b77a] to-[#E5A924] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 transition hover:scale-105 active:scale-95"
                >
                  <Sparkles size={16} />
                  Request Sample
                </button>

                <a
                  href={quoteUrl(activeImage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 transition hover:bg-[#20ba59]"
                >
                  <MessageCircle size={17} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
