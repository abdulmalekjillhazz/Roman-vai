import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight, Search, Layers, MapPin, MessageCircle, Sparkles,
  Grid2X2, Mountain, PanelsTopLeft, Shapes, BrickWall, Columns3,
  AudioLines, Layers3, TreeDeciduous, CheckCircle2, GalleryVerticalEnd,
  SlidersHorizontal, X
} from 'lucide-react';
import SEOHead from '../components/public/SEOHead.jsx';
import ProductCard from '../components/public/ProductCard.jsx';
import ProductModal from '../components/public/ProductModal.jsx';
import MaterialHero from '../components/public/MaterialHero.jsx';
import FallbackImage from '../components/public/FallbackImage.jsx';
import cloudCatalog from '../../data/products_cloudinary.json';
import localCatalog from '../../data/products_data.json';
import { CLIENT_INFO } from '../config/clientInfo.js';

const INITIAL_CATALOG = cloudCatalog.length ? cloudCatalog : localCatalog;

const MATERIAL_STUDIES = [
  { file: 'project-completed-luxury-villa-wall-cladding-01', title: 'Flexible Stone & Facades', detail: 'Curved Surfaces', slug: 'flexible-stone' },
  { file: 'project-completed-herringbone-parquet-residential-05', title: 'SPC Rigid Parquetry', detail: 'Waterproof Flooring', slug: 'spc-flooring' },
  { file: 'project-completed-commercial-office-feature-wall-03', title: 'Acoustic Slat Louvers', detail: 'Acoustic Millwork', slug: 'acoustic-panel' }
];

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

const CATEGORY_GROUPS = [
  {
    title: 'Walls & 3D Surfaces',
    slugs: [
      'flexible-stone', 'wpc-chipboard-panel-sheet', 'wall-panel', 'pu-stone',
      'acoustic-panel', 'pvc-marble-sheet', '3d-velvet-fabric-roll',
      '3d-soft-stone-roll', 'flexible-3d-sheet', 'molding', 'columns-partition'
    ]
  },
  {
    title: 'Luxury Flooring',
    slugs: ['spc-flooring', 'lvt-flooring']
  },
  {
    title: 'Profiles & Installation',
    slugs: ['aluminium-profiles', 'silicon']
  }
];

export default function HomePage({ onOpenQuote, categorySlug }) {
  const [products, setProducts] = useState(INITIAL_CATALOG);
  const [activeCategory, setActiveCategory] = useState(categorySlug || 'all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setActiveCategory(categorySlug || 'all');
  }, [categorySlug]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || '/api'}/products`, { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Catalog unavailable')))
      .then(data => {
        if (Array.isArray(data) && data.every(item => item?.name && item?.category)) setProducts(data);
      })
      .catch(() => { /* Maintain static catalog during network outage */ })
      .finally(() => window.clearTimeout(timeout));
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, []);

  // Instant sub-millisecond filtering with zero freezing
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const slug = product.slug;
      const category = product.category;

      let categoryMatch = false;
      if (activeCategory === 'all') {
        categoryMatch = true;
      } else if (activeCategory === 'group-walls') {
        categoryMatch = CATEGORY_GROUPS[0].slugs.includes(slug) || category === 'wall-products';
      } else if (activeCategory === 'group-flooring') {
        categoryMatch = CATEGORY_GROUPS[1].slugs.includes(slug) || category === 'flooring-products';
      } else if (activeCategory === 'group-profiles') {
        categoryMatch = CATEGORY_GROUPS[2].slugs.includes(slug) || ['details', 'aluminum-profiles', 'fixing-materials'].includes(category);
      } else {
        categoryMatch = slug === activeCategory || category === activeCategory;
      }

      if (!categoryMatch) return false;

      if (!search.trim()) return true;
      const query = search.toLowerCase().trim();
      const textToSearch = `${product.name} ${product.description || ''} ${product.categoryName || ''} ${product.material || ''}`.toLowerCase();
      return textToSearch.includes(query);
    });
  }, [products, activeCategory, search]);

  return (
    <div className="bg-[#FAF6EE] min-h-screen">
      <SEOHead
        title={`${CLIENT_INFO.brandName} | Architectural Materials & Finishes, Dubai`}
        description="Explore 15 official architectural surfaces: flexible stone, PU stone, WPC panels, SPC flooring, and aluminum profiles. Direct B2B supplier in Dubai and UAE."
        canonicalPath={categorySlug ? `/category/${categorySlug}` : '/'}
      />

      {/* 1. Full-Bleed Hero Presentation */}
      {!categorySlug && (
        <>
          <MaterialHero onOpenQuote={onOpenQuote} />
          
          {/* Quick Study Highlight Strip */}
          <section aria-label="Material highlights" className="mx-auto grid max-w-7xl gap-4 px-4 pb-8 pt-6 sm:grid-cols-3 sm:px-6 lg:px-8">
            {MATERIAL_STUDIES.map(study => (
              <Link
                href={`/product/${study.slug}`}
                key={study.title}
                className="group flex min-w-0 items-center gap-4 rounded-2xl border border-stone-200/80 bg-white/80 p-3 shadow-xs transition-all duration-300 hover:border-[#E5A924] hover:bg-white hover:shadow-md"
              >
                <FallbackImage
                  src={`/assets/decorforall/${study.file}.webp`}
                  alt={study.detail}
                  loading="lazy"
                  width={96}
                  height={80}
                  className="h-20 w-24 flex-none rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8a6b36]">
                    {study.detail}
                  </p>
                  <h2 className="mt-1 font-display text-sm font-bold text-stone-900 group-hover:text-amber-900">
                    {study.title}
                  </h2>
                </div>
                <ArrowUpRight aria-hidden="true" className="ml-auto mr-1 h-4 w-4 flex-none text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#E5A924]" />
              </Link>
            ))}
          </section>
        </>
      )}

      {/* 2. Main Architectural Material Catalog with Desktop Sticky Sidebar */}
      <section id="product-catalog" aria-labelledby="catalog-title" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-stone-200/80 pb-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-800/5 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-900">
              <Sparkles className="h-3 w-3 text-[#E5A924]" />
              15 Official Material Specifications · Dubai & UAE
            </div>
            <h2 id="catalog-title" className="mt-2.5 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
              Find your finish.
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm leading-relaxed text-stone-600">
            Engineered architectural surfaces for luxury residential villas, commercial developments, and hospitality projects. Instant UAE supply and physical sample boxes.
          </p>
        </div>

        {/* Mobile Horizontal Category Scroller */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none md:hidden">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeCategory === 'all'
                ? 'bg-stone-900 text-white shadow-md'
                : 'border border-stone-300 bg-white text-stone-700'
            }`}
          >
            All Materials ({products.length})
          </button>
          
          <button
            type="button"
            onClick={() => setActiveCategory('group-walls')}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeCategory === 'group-walls'
                ? 'bg-stone-900 text-white shadow-md'
                : 'border border-stone-300 bg-white text-stone-700'
            }`}
          >
            Walls & Surfaces
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('group-flooring')}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeCategory === 'group-flooring'
                ? 'bg-stone-900 text-white shadow-md'
                : 'border border-stone-300 bg-white text-stone-700'
            }`}
          >
            Flooring
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('group-profiles')}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeCategory === 'group-profiles'
                ? 'bg-stone-900 text-white shadow-md'
                : 'border border-stone-300 bg-white text-stone-700'
            }`}
          >
            Profiles & Fixing
          </button>
        </div>

        {/* Main Catalog Layout: Sidebar + Products Grid */}
        <div className="flex flex-col md:flex-row items-start gap-8">
          
          {/* =====================================================================
              DESKTOP ARCHITECTURAL STICKY SIDEBAR (ZERO-LAG, FAST, HIGH-LUXURY)
              ===================================================================== */}
          <aside
            aria-label="Material category sidebar"
            className="sticky top-24 hidden w-64 lg:w-72 shrink-0 flex-col self-start rounded-2xl border border-stone-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-md md:flex max-h-[calc(100dvh-120px)]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/70">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-stone-500">
                Material Categories
              </span>
              <span className="font-mono text-[10px] font-bold text-[#E5A924]">
                15 COLLECTIONS
              </span>
            </div>

            {/* All Materials Master Button */}
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`mt-3 flex min-h-11 w-full items-center justify-between rounded-xl px-3.5 text-xs font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-stone-900 text-[#f5ebd7] shadow-md border-l-3 border-[#E5A924]'
                  : 'text-stone-700 hover:bg-stone-100/80 hover:text-stone-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Grid2X2 size={16} className={activeCategory === 'all' ? 'text-[#E5A924]' : 'text-stone-400'} />
                <span>All Materials</span>
              </div>
              <span className={`text-[10px] rounded-full px-2 py-0.5 font-mono ${
                activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                {products.length}
              </span>
            </button>

            {/* Scrollable Architectural List of 15 Official Collections */}
            <div className="mt-3 min-h-0 space-y-4 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]">
              {CATEGORY_GROUPS.map(group => (
                <div key={group.title} className="pt-1">
                  <p className="px-2 pb-1.5 text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-stone-400">
                    {group.title}
                  </p>
                  
                  <div className="space-y-1">
                    {group.slugs.map(slug => {
                      const prod = products.find(p => p.slug === slug);
                      if (!prod) return null;
                      const Icon = CATEGORY_ICONS[slug] || Grid2X2;
                      const isActive = activeCategory === slug;

                      return (
                        <button
                          key={slug}
                          type="button"
                          onClick={() => setActiveCategory(slug)}
                          className={`group flex min-h-10 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-stone-900 text-[#e7d5b2] shadow-sm border-l-2 border-[#E5A924]'
                              : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon size={15} className={`shrink-0 ${isActive ? 'text-[#E5A924]' : 'text-stone-400 group-hover:text-stone-700'}`} />
                            <span className="truncate">{prod.name}</span>
                          </div>
                          <span className={`shrink-0 text-[10px] font-mono rounded-full px-1.5 py-0.5 ${
                            isActive ? 'bg-white/20 text-[#e7d5b2]' : 'bg-stone-100 text-stone-500'
                          }`}>
                            ✓
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Trade Inquiries Box */}
            <div className="mt-4 pt-3 border-t border-stone-200/80">
              <button
                type="button"
                onClick={() => onOpenQuote?.('VIP Material Sample Box')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e7d5b2] via-[#E5A924] to-[#c48b12] py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 shadow-sm transition hover:scale-[1.02] active:scale-95"
              >
                <Sparkles size={14} />
                <span>Request Sample Kit</span>
              </button>
            </div>
          </aside>

          {/* =====================================================================
              RIGHT PRODUCT CATALOG GRID (INSTANT LOAD, ZERO FREEZE)
              ===================================================================== */}
          <div className="min-w-0 flex-1 w-full">
            
            {/* Search and Filter Status Bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white/70 p-3.5 rounded-2xl border border-stone-200/80 backdrop-blur-md">
              <div className="relative w-full max-w-sm">
                <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
                <input
                  type="search"
                  aria-label="Search materials and finishes"
                  placeholder="Search materials (e.g. Travertine, Herringbone, Fluted)..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="floating-input min-h-10 w-full rounded-xl border border-stone-300 bg-white pl-10 pr-8 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-700"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-medium text-stone-500">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal size={14} className="text-[#8a6b36]" />
                  <span>
                    Showing <strong className="text-stone-900">{filteredProducts.length}</strong> of {products.length} Materials
                  </span>
                </div>
                {activeCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className="text-xs font-bold text-[#8a6b36] hover:underline"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product._id || product.id || product.slug}
                    product={product}
                    priority={index < 3}
                    onSelectProduct={setSelectedProduct}
                  />
                ))}
              </div>
            ) : (
              <div role="status" className="rounded-2xl border border-stone-200 bg-white/80 py-16 text-center">
                <h3 className="font-display text-lg font-bold text-stone-900">No matching materials found</h3>
                <p className="mt-2 text-xs sm:text-sm text-stone-500">Try searching with another name or explore the full collection.</p>
                <button
                  type="button"
                  onClick={() => { setSearch(''); setActiveCategory('all'); }}
                  className="mt-4 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-stone-800"
                >
                  Show All 15 Materials
                </button>
              </div>
            )}

            {/* Physical Sample Dispatch Box Banner */}
            <div className="mt-12 rounded-3xl border border-stone-200/90 bg-gradient-to-r from-stone-900 to-stone-800 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="max-w-xl text-center sm:text-left">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#d4b77a]">
                  Architectural Sample Dispatch · Dubai & UAE
                </span>
                <h3 className="mt-1.5 font-serif text-xl sm:text-2xl font-semibold text-white">
                  Need physical material samples on-site?
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-stone-300">
                  Request a tailored sample box with custom finishes, thicknesses, and specification sheets delivered directly to your office or villa project.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => onOpenQuote?.('VIP Material Sample Box')}
                  className="btn-luxury-gold inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 transition active:scale-95 shadow-md"
                >
                  Request Sample Box
                </button>
                <a
                  href={`https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Classical Decor ID, I would like to request material samples and architectural specifications.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 active:scale-95"
                >
                  WhatsApp Support
                </a>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* 3. Trade Services Section */}
      <section aria-labelledby="service-title" className="border-t border-stone-200 bg-[#eee9df]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_2fr] lg:px-8 lg:py-16">
          <div>
            <p className="eyebrow">For the way you work</p>
            <h2 id="service-title" className="mt-3 max-w-xs font-serif text-3xl font-semibold sm:text-4xl">
              From material choice<br />to your next project.
            </h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-3">
            {[
              { Icon: Layers, title: 'See it. Feel it.', text: 'Request samples to compare texture, colour and finish for your scheme.' },
              { Icon: MessageCircle, title: 'Talk materials.', text: 'Discuss specifications and availability directly with our team.' },
              { Icon: MapPin, title: 'Made for your brief.', text: 'Material supply for designers, contractors and project teams across the UAE.' }
            ].map(({ Icon, title, text }) => (
              <div key={title}>
                <Icon aria-hidden="true" className="mb-4 h-6 w-6 text-[#8a6b36]" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-stone-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onOpenQuote={onOpenQuote}
      />
    </div>
  );
}
