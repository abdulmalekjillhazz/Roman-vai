import React, { useEffect, useMemo, useState } from 'react';
import {
  AudioLines,
  BrickWall,
  Building2,
  Columns3,
  GalleryVerticalEnd,
  Grid2X2,
  Grid3X3,
  Layers3,
  Mountain,
  PanelsTopLeft,
  Shapes,
  TreeDeciduous,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import SEOHead from '../components/public/SEOHead.jsx';
import { CLIENT_INFO } from '../config/clientInfo.js';

const MANIFEST_URL = '/assets/decorforall/gallery-categories.json';
const IMAGE_LIMIT = 100;
const CATEGORY_ICONS = {
  'flexible-stone': Mountain,
  'pu-stone': BrickWall,
  'wpc-panels': PanelsTopLeft,
  'decorative-wall-panels': Shapes,
  'pvc-marble': Layers3,
  'acoustic-panels': AudioLines,
  'spc-straight': GalleryVerticalEnd,
  'spc-herringbone': Grid3X3,
  'spc-marble-lvt': Grid2X2,
  'profiles-skirting': Columns3,
  woodworking: TreeDeciduous,
  projects: Building2
};
const CATEGORY_DESCRIPTIONS = {
  'flexible-stone': 'Natural stone-inspired finishes for feature walls, columns and distinctive interior details.',
  'pu-stone': 'Sculpted stone textures that bring depth and character to statement walls.',
  'wpc-panels': 'Modern linear and fluted finishes for adding warmth and dimension to interior walls.',
  'decorative-wall-panels': 'Decorative panels and mouldings for walls with a more considered finish.',
  'pvc-marble': 'Polished marble-inspired surfaces for elegant feature walls and interior cladding.',
  'acoustic-panels': 'Textured and slatted panel styles for warm, layered interior spaces.',
  'spc-straight': 'Wood-inspired plank designs for a clean, timeless flooring look.',
  'spc-herringbone': 'Classic herringbone patterns that make floors a defining part of the room.',
  'spc-marble-lvt': 'Stone-inspired and LVT flooring looks for distinctive interior schemes.',
  'profiles-skirting': 'Profiles and skirting details for a neat, coordinated finish.',
  woodworking: 'Decorative wood-look sheets for custom interior features and details.',
  projects: 'Completed spaces that show how interior surface materials come together.'
};

export default function SiteImageGalleryPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch(MANIFEST_URL, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Image library request failed (${response.status}).`);
        return response.json();
      })
      .then(manifest => {
        const curatedCategories = manifest.categories || [];
        const total = curatedCategories.reduce((sum, category) => sum + category.images.length, 0);
        if (total !== IMAGE_LIMIT) {
          console.warn(`[DST Deco gallery] Expected ${IMAGE_LIMIT} curated images, found ${total}.`);
        }
        setCategories(curatedCategories);
      })
      .catch(fetchError => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Could not load the image library.');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const selectedCategory = categories.find(category => category.id === selectedCategoryId);
  const allImages = useMemo(
    () => categories.flatMap(category => category.images.map((image, index) => ({
      ...image,
      categoryTitle: category.title,
      key: `${category.id}-${image.src}-${index}`
    }))),
    [categories]
  );
  const filteredImages = selectedCategory?.images || allImages;
  const pageCount = Math.ceil(filteredImages.length / 24);
  const visibleImages = useMemo(
    () => filteredImages.slice((currentPage - 1) * 24, currentPage * 24),
    [currentPage, filteredImages]
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId]);

  useEffect(() => {
    if (!activeImage) return undefined;
    function handleKeyDown(event) {
      if (event.key === 'Escape') setActiveImage(null);
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const index = visibleImages.findIndex(image => image.src === activeImage.src);
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (index + direction + visibleImages.length) % visibleImages.length;
        if (visibleImages[nextIndex]) setActiveImage(visibleImages[nextIndex]);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, visibleImages]);

  function selectCategory(categoryId) {
    setSelectedCategoryId(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function quoteUrl(categoryTitle = '') {
    const message = categoryTitle
      ? `Hello DST Deco, I am interested in ${categoryTitle}. Could you share details and a quotation?`
      : 'Hello DST Deco, I would like to explore your interior materials and request a quotation.';
    return `https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div className="relative min-h-full">
      <SEOHead
        title="Interior Materials & Finishes Gallery | Classical Decor ID"
        description="Explore flooring, wall panels, stone finishes and interior materials supplied by Classical Decor ID across the UAE."
        canonicalPath="/gallery"
      />

      {/* Two-Column Layout: Sidebar is sticky within the gallery container and NEVER overlaps the footer */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:px-6 md:py-10 flex flex-col md:flex-row items-start gap-6 lg:gap-8">
        {!loading && !error && categories.length > 0 && (
          <aside
            aria-label="Image categories"
            className="sticky top-24 self-start hidden w-[74px] shrink-0 flex-col rounded-3xl border border-white/90 bg-gradient-to-b from-white via-[#fcfaf5] to-[#f0eadd] p-2 floating-card md:flex max-h-[calc(100vh-130px)] z-20"
          >
            <button
              type="button"
              title="Product range"
              aria-current={!selectedCategory ? 'page' : undefined}
              onClick={() => selectCategory('')}
              className={`group mb-1 flex min-h-11 shrink-0 items-center justify-center rounded-xl text-left text-xs font-bold transition-all duration-200 ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-[#f7e9c5] to-[#fffaf0] text-[#815b11] shadow-[inset_0_0_0_1px_rgba(197,139,18,0.22),0_3px_0_#d8bd84,0_8px_14px_-10px_rgba(80,60,24,0.6)]'
                  : 'text-brand-muted hover:-translate-y-0.5 hover:bg-white/90 hover:text-brand-charcoal hover:shadow-[0_4px_10px_-7px_rgba(47,37,21,0.55)]'
              }`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                !selectedCategory
                  ? 'bg-gradient-to-br from-[#f4c85e] via-[#dfaa34] to-[#b77d1d] text-white shadow-[0_3px_0_#91651b,0_7px_12px_-7px_rgba(91,61,17,0.8),inset_0_1px_0_rgba(255,255,255,0.55)]'
                  : 'bg-gradient-to-br from-white to-[#e9e1d1] text-[#786b54] shadow-[0_2px_0_#cfc4b0,0_5px_9px_-7px_rgba(47,37,21,0.6),inset_0_1px_0_white] group-hover:-translate-y-0.5'
              }`}>
                <Grid2X2 size={17} strokeWidth={2.2} />
              </span>
            </button>

            <div className="mb-2 mt-1 hidden border-t border-brand-sand/70 md:block" />
            <nav className="flex-1 space-y-1 overflow-y-auto overscroll-contain pb-1 [scrollbar-width:thin] [scrollbar-color:#d6cbb7_transparent]">
              {categories.map(category => {
                const Icon = CATEGORY_ICONS[category.id] || Grid2X2;
                const active = selectedCategoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    title={category.title}
                    aria-label={category.title}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`group relative flex min-h-11 w-full shrink-0 items-center justify-center rounded-xl text-left text-xs font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-[#f7e9c5] to-[#fffaf0] text-[#815b11] shadow-[inset_0_0_0_1px_rgba(197,139,18,0.22),0_3px_0_#d8bd84,0_8px_14px_-10px_rgba(80,60,24,0.6)]'
                        : 'text-brand-muted hover:-translate-y-0.5 hover:bg-white/90 hover:text-brand-charcoal hover:shadow-[0_4px_10px_-7px_rgba(47,37,21,0.55)]'
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-br from-[#f4c85e] via-[#dfaa34] to-[#b77d1d] text-white shadow-[0_3px_0_#91651b,0_7px_12px_-7px_rgba(91,61,17,0.8),inset_0_1px_0_rgba(255,255,255,0.55)]'
                        : 'bg-gradient-to-br from-white to-[#e9e1d1] text-[#786b54] shadow-[0_2px_0_#cfc4b0,0_5px_9px_-7px_rgba(47,37,21,0.6),inset_0_1px_0_white] group-hover:-translate-y-0.5'
                    }`}>
                      <Icon size={17} strokeWidth={2.1} />
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        <div className="flex-1 min-w-0 w-full">
          {!loading && !error && categories.length > 0 && (
            <nav
              aria-label="Image categories"
              className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:hidden"
            >
              <button
                type="button"
                aria-current={!selectedCategory ? 'page' : undefined}
                onClick={() => selectCategory('')}
                className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold floating-pill ${
                  !selectedCategory
                    ? 'border-brand-charcoal bg-brand-charcoal text-white shadow-sm'
                    : 'border-brand-sand bg-white text-brand-charcoal hover:border-brand-gold'
                }`}
              >
                <Grid2X2 size={15} />
                Product range
              </button>
              {categories.map(category => {
                const Icon = CATEGORY_ICONS[category.id] || Grid2X2;
                const active = selectedCategoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => selectCategory(category.id)}
                    className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold floating-pill ${
                      active
                        ? 'border-brand-charcoal bg-brand-charcoal text-white shadow-sm'
                        : 'border-brand-sand bg-white text-brand-charcoal hover:border-brand-gold'
                    }`}
                  >
                    <Icon size={15} />
                    {category.title}
                  </button>
                );
              })}
            </nav>
          )}

          {loading ? (
            <p className="py-16 text-center text-brand-muted">Loading image library...</p>
          ) : error ? (
            <p role="alert" className="py-16 text-center text-red-700">{error}</p>
          ) : selectedCategory ? (
            <section aria-labelledby="selected-product-title">
              <div className="grid overflow-hidden rounded-3xl border border-white/80 bg-white/95 floating-card md:grid-cols-[1fr_1.05fr]">
                <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">Explore the range</p>
                  <h1 id="selected-product-title" className="mt-3 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
                    {selectedCategory.title}
                  </h1>
                  <p className="mt-4 max-w-xl leading-relaxed text-brand-muted font-sans text-sm">
                    {CATEGORY_DESCRIPTIONS[selectedCategory.id]}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href={quoteUrl(selectedCategory.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-gold px-5 text-sm font-bold text-brand-charcoal shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-goldHover"
                    >
                      <MessageCircle size={17} />
                      Request a quote
                    </a>
                    <button
                      type="button"
                      onClick={() => selectCategory('')}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-sand bg-white px-5 text-sm font-semibold text-brand-charcoal transition hover:border-brand-gold"
                    >
                      View all products
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  <p className="mt-5 text-xs font-medium text-brand-muted">UAE supply · Trade enquiries · Direct WhatsApp support</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveImage({ ...selectedCategory.images[0], categoryTitle: selectedCategory.title })}
                  className="group relative min-h-64 overflow-hidden bg-stone-100 text-left sm:min-h-80 md:min-h-[420px]"
                  aria-label={`View ${selectedCategory.title} product image`}
                >
                  <img
                    src={selectedCategory.images[0]?.src}
                    alt={selectedCategory.images[0]?.alt || selectedCategory.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-4 left-4 rounded-full border border-white/50 bg-black/45 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                    View finish
                  </span>
                </button>
              </div>

              <div className="mb-5 mt-10">
                <h2 className="font-display text-2xl font-bold text-brand-charcoal">Explore the finishes</h2>
                <p className="mt-1 text-sm text-brand-muted">See how the collection looks across different designs and spaces.</p>
              </div>
              {visibleImages.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {visibleImages.map(image => (
                    <button
                      key={image.key || `${selectedCategory.id}-${image.src}`}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className="group min-w-0 overflow-hidden rounded-2xl border border-white/90 bg-white/95 text-left floating-card focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      aria-label={`View ${selectedCategory.title} product image`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="py-16 text-center text-brand-muted">No product images are available in this category.</p>
              )}
              {pageCount > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="min-h-11 rounded-xl border border-brand-sand bg-white px-5 text-sm font-semibold floating-pill disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium text-brand-muted">Page {currentPage} of {pageCount}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(page => Math.min(pageCount, page + 1))}
                    disabled={currentPage === pageCount}
                    className="min-h-11 rounded-xl border border-brand-sand bg-white px-5 text-sm font-semibold floating-pill disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </section>
          ) : (
            <div>
              <section className="relative isolate grid overflow-hidden rounded-3xl bg-[#171717] text-white floating-banner md:min-h-[400px] md:grid-cols-[1fr_0.9fr]">
                <div className="relative z-10 flex flex-col items-start justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#edbd53]">Interior decor materials · UAE</p>
                  <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
                    The right materials make a space unforgettable.
                  </h1>
                  <p className="mt-5 max-w-xl text-sm leading-6 text-stone-300 sm:text-base">
                    Explore flooring, wall panels, stone finishes and architectural details for your next interior project.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href="#product-range"
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#e5a924] px-5 text-sm font-bold text-[#171717] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f0bd4b]"
                    >
                      Explore products
                      <ArrowRight size={17} />
                    </a>
                    <a
                      href={quoteUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      <MessageCircle size={17} />
                      Request a quote
                    </a>
                  </div>
                  <p className="mt-6 text-xs font-medium tracking-wide text-stone-400">UAE supply · Trade enquiries · Direct WhatsApp support</p>
                </div>
                <div className="relative min-h-64 md:min-h-full">
                  {categories.slice(0, 3).map((category, index) => (
                    <img
                      key={category.id}
                      src={category.images[0]?.src}
                      alt={category.images[0]?.alt || category.title}
                      className={`absolute h-[76%] rounded-2xl border border-white/20 object-cover shadow-2xl ${
                        index === 0
                          ? 'left-[7%] top-[12%] z-20 w-[62%]'
                          : index === 1
                            ? 'right-[5%] top-[8%] z-10 w-[43%] opacity-90'
                            : 'bottom-[7%] right-[8%] z-30 h-[42%] w-[39%] shadow-xl'
                      }`}
                    />
                  ))}
                  <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_55%_48%,rgba(229,169,36,0.22),transparent_60%)]" />
                </div>
              </section>

              <section id="product-range" className="scroll-mt-24 pt-12 sm:pt-16">
                <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">Our range</p>
                    <h2 className="mt-2 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">Everything for a complete interior</h2>
                  </div>
                  <p className="max-w-md text-sm leading-relaxed text-brand-muted">
                    Find the right finish for your space, then talk to our team about supply and trade pricing.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map(category => {
                    const Icon = CATEGORY_ICONS[category.id] || Grid2X2;
                    return (
                      <article key={category.id} className="group overflow-hidden rounded-2xl border border-white/90 bg-white/95 floating-card">
                        <button
                          type="button"
                          onClick={() => selectCategory(category.id)}
                          className="flex h-full w-full flex-col text-left focus:outline-none"
                        >
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                            <img
                              src={category.images[0]?.src}
                              alt={category.images[0]?.alt || category.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            />
                            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                              {category.images.length} photos
                            </span>
                          </div>
                          <div className="flex flex-1 flex-col justify-between p-5">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                                  <Icon size={16} />
                                </span>
                                <h3 className="font-display text-lg font-bold text-brand-charcoal group-hover:text-amber-800 transition">
                                  {category.title}
                                </h3>
                              </div>
                              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-brand-muted">
                                {CATEGORY_DESCRIPTIONS[category.id]}
                              </p>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-700">
                              <span>Browse collection</span>
                              <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                            </div>
                          </div>
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-scaleUp"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white hover:bg-black transition"
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src={activeImage.src}
              alt={activeImage.alt || activeImage.categoryTitle}
              className="max-h-[75vh] w-full object-contain bg-stone-950"
            />
            <div className="flex items-center justify-between p-4 bg-white">
              <span className="font-bold text-sm text-stone-900">{activeImage.categoryTitle}</span>
              <a
                href={quoteUrl(activeImage.categoryTitle)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-4 py-2 text-xs font-bold text-white shadow-sm transition"
              >
                <MessageCircle size={15} />
                WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
