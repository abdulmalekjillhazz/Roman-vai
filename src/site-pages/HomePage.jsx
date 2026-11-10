import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight, Search, Layers, MapPin, MessageCircle, Sparkles,
  SlidersHorizontal, X
} from 'lucide-react';
import SEOHead from '../components/public/SEOHead.jsx';
import ProductCard from '../components/public/ProductCard.jsx';
import ProductModal from '../components/public/ProductModal.jsx';
import MaterialHero from '../components/public/MaterialHero.jsx';
import FallbackImage from '../components/public/FallbackImage.jsx';
import FAQSection from '../components/public/FAQSection.jsx';
import cloudCatalog from '../../data/products_cloudinary.json';
import localCatalog from '../../data/products_data.json';
import { CLIENT_INFO } from '../config/clientInfo.js';

const INITIAL_CATALOG = cloudCatalog.length ? cloudCatalog : localCatalog;

// Frontend-only order for the official catalog; API data remains untouched.
const CATEGORY_ORDER = [
  'spc-flooring',
  'lvt-flooring',
  'flexible-stone',
  'wpc-chipboard-panel-sheet',
  'wall-panel',
  'pu-stone',
  'molding',
  'columns-partition',
  'acoustic-panel',
  'pvc-marble-sheet',
  '3d-velvet-fabric-roll',
  '3d-soft-stone-roll',
  'flexible-3d-sheet',
  'aluminium-profiles',
  'silicon'
];
const CATEGORY_ORDER_INDEX = new Map(CATEGORY_ORDER.map((slug, index) => [slug, index]));

const MATERIAL_STUDIES = [
  { file: 'project-completed-luxury-villa-wall-cladding-01', title: 'Flexible Stone & Facades', detail: 'Curved Surfaces', slug: 'flexible-stone' },
  { file: 'project-completed-herringbone-parquet-residential-05', title: 'SPC Rigid Parquetry', detail: 'Waterproof Flooring', slug: 'spc-flooring' },
  { file: 'project-completed-commercial-office-feature-wall-03', title: 'Acoustic Slat Louvers', detail: 'Acoustic Millwork', slug: 'acoustic-panel' }
];

const GROUPS = [
  { id: 'all', label: 'All Materials' },
  { id: 'wall-products', label: 'Walls & Surfaces' },
  { id: 'flooring-products', label: 'Flooring' },
  { id: 'details', label: 'Profiles & Fixing' }
];

function ProductSkeletonCard({ isFeatured = false }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-white p-0 ${
        isFeatured ? 'sm:col-span-2 md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <div
        className={`w-full skeleton-shimmer ${
          isFeatured ? 'aspect-[16/9] md:aspect-[16/11]' : 'aspect-[16/10] sm:aspect-[4/3]'
        }`}
      />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="h-3 w-24 rounded-md skeleton-shimmer" />
        <div className="h-5 w-3/4 rounded-md skeleton-shimmer" />
        {isFeatured && <div className="h-3 w-5/6 rounded-md skeleton-shimmer" />}
        <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
          <div className="h-3 w-32 rounded-md skeleton-shimmer" />
          <div className="h-4 w-4 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ onOpenQuote, categorySlug }) {
  const [products, setProducts] = useState(INITIAL_CATALOG);
  const [isFetching, setIsFetching] = useState(false);
  const [activeGroup, setActiveGroup] = useState(categorySlug || 'all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadedFaqs, setLoadedFaqs] = useState([]);

  useEffect(() => {
    setActiveGroup(categorySlug || 'all');
  }, [categorySlug]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    if (!products.length) setIsFetching(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || '/api'}/products`, { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Catalog unavailable')))
      .then(data => {
        if (Array.isArray(data) && data.every(item => item?.name && item?.category)) setProducts(data);
      })
      .catch(() => { /* Maintain static catalog during network outage */ })
      .finally(() => {
        setIsFetching(false);
        window.clearTimeout(timeout);
      });
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, []);

  // Instant sub-millisecond filtering with zero freezing
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const groupMatches =
        activeGroup === 'all' ||
        product.category === activeGroup ||
        product.categoryGroup === activeGroup ||
        product.slug === activeGroup ||
        (activeGroup === 'details' && ['aluminum-profiles', 'fixing-materials', 'woodworking-details'].includes(product.category));

      if (!groupMatches) return false;

      if (!search.trim()) return true;
      const query = search.toLowerCase().trim();
      const textToSearch = `${product.name} ${product.description || ''} ${product.categoryName || ''} ${product.material || ''}`.toLowerCase();
      return textToSearch.includes(query);
    });
  }, [products, activeGroup, search]);

  // Sort only the visible copy; keep API and catalog data unchanged.
  const orderedProducts = useMemo(() => {
    const getOrder = product => {
      const slug = product.slug || product.id || '';
      if (CATEGORY_ORDER_INDEX.has(slug)) return CATEGORY_ORDER_INDEX.get(slug);
      const normalizedName = (product.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return CATEGORY_ORDER_INDEX.get(normalizedName) ?? Number.MAX_SAFE_INTEGER;
    };
    return [...filteredProducts].sort((a, b) => getOrder(a) - getOrder(b));
  }, [filteredProducts]);

  return (
    <div className="bg-[#FAF6EE] min-h-screen">
      <SEOHead
        title={`${CLIENT_INFO.brandName} | Architectural Materials & Finishes, Dubai`}
        description="Explore 15 official architectural surfaces: flexible stone, PU stone, WPC panels, SPC flooring, and aluminum profiles. Direct B2B supplier in Dubai and UAE."
        canonicalPath={categorySlug ? `/category/${categorySlug}` : '/'}
        faqs={loadedFaqs}
      />

      {/* 1. Full-Bleed Hero Presentation */}
      {!categorySlug && (
        <>
          <MaterialHero onOpenQuote={onOpenQuote} />
          
          {/* Quick Study Highlight Strip */}
          <section aria-label="Material highlights" className="mx-auto grid max-w-7xl gap-4 px-4 pb-8 pt-6 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8">
            {MATERIAL_STUDIES.map(study => (
              <Link
                href={`/product/${study.slug}`}
                key={study.title}
                className="group flex min-w-0 items-center gap-4 rounded-2xl border border-stone-200/80 bg-white/80 p-3 shadow-xs transition-all duration-300 hover:border-[#E5A924] hover:bg-white hover:shadow-md sm:last:col-span-2 lg:last:col-span-1"
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
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand-bronzeDark">
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

      {/* 2. Main Architectural Material Catalog (Full-Width Clean Layout) */}
      <section id="product-catalog" aria-labelledby="catalog-title" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 pt-10 sm:px-6 lg:px-8 sm:pb-28">
        
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-stone-200/80 pb-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-800/5 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-900">
              <Sparkles className="h-3 w-3 text-[#E5A924]" />
              Official Architectural Specifications · Dubai & UAE
            </div>
            <h2 id="catalog-title" className="mt-3 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Find your finish.
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm leading-relaxed text-stone-600 font-sans">
            Engineered architectural surfaces for luxury residential villas, commercial developments, and hospitality projects. Instant UAE supply and physical sample boxes.
          </p>
        </div>

        {/* Top Category Filter Pills & Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter materials by category">
            {GROUPS.map(group => {
              const isSelected = activeGroup === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveGroup(group.id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'border border-stone-200/90 bg-white/80 text-stone-700 hover:border-[#E5A924] hover:bg-white hover:text-stone-950 shadow-xs'
                  }`}
                >
                  <span>{group.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
            <input
              type="search"
              aria-label="Search materials and finishes"
              placeholder="Search finishes (e.g. Travertine, Oak)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="floating-input min-h-11 w-full rounded-xl border-none bg-white pl-10 pr-10 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search input"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Clean Header Bar - Zero Numbers */}
        <div className="mb-6 flex items-center justify-between text-xs font-medium text-stone-500">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-brand-bronzeDark" />
            <span className="font-semibold text-stone-700">Official Material Collections</span>
          </div>
          {activeGroup !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveGroup('all')}
              className="text-xs font-bold text-brand-bronzeDark hover:underline"
            >
              Show All Materials
            </button>
          )}
        </div>

        {/* Full-Width Products Grid with Dynamic Bento Layout & Skeleton Loading State */}
        {isFetching ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 grid-flow-dense">
            <ProductSkeletonCard isFeatured={true} />
            <ProductSkeletonCard />
            <ProductSkeletonCard />
            <ProductSkeletonCard />
            <ProductSkeletonCard />
            <ProductSkeletonCard />
          </div>
        ) : filteredProducts.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 grid-flow-dense">
            {orderedProducts.map((product, index) => {
              const isBentoEligible = !search.trim() && !categorySlug && activeGroup === 'all';
              const isFeatured = isBentoEligible && (index === 0 || (index > 0 && index % 7 === 0));
              return (
                <ProductCard
                  key={product._id || product.id || product.slug}
                  product={product}
                  isFeatured={isFeatured}
                  priority={Boolean(categorySlug) ? index < 2 : index === 0}
                  onSelectProduct={setSelectedProduct}
                />
              );
            })}
          </div>
        ) : (
          <div role="status" className="rounded-2xl border border-stone-200 bg-white/80 py-16 text-center">
            <h3 className="font-display text-lg font-bold text-stone-900">No matching materials found</h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-500">Try searching with another name or explore the full collection.</p>
            <button
              type="button"
              onClick={() => { setSearch(''); setActiveGroup('all'); }}
              className="mt-4 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-stone-800"
            >
              Show All Materials
            </button>
          </div>
        )}

        {/* Physical Sample Dispatch Box Banner */}
        <div className="mt-16 rounded-3xl border border-stone-800/80 bg-gradient-to-r from-stone-950 via-[#181818] to-stone-950 p-7 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl text-center sm:text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[#E5A924]">
              COMPLIMENTARY TRADE SAMPLE DISPATCH · DUBAI & UAE
            </span>
            <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold text-white">
              Experience the tactile texture on-site.
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-300 font-sans">
              Feel the weight, authentic stone relief, and luxury matte finishes before specifying your project. We deliver tailored architectural sample boxes with specification sheets directly to your design studio, contractor site, or private villa within 24–48 hours across the UAE.
            </p>
          </div>
          <div className="flex shrink-0 flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onOpenQuote?.('VIP Material Sample Box')}
              className="btn-luxury-gold inline-flex min-h-12 w-full sm:w-auto items-center justify-center rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-950 transition active:scale-95 shadow-lg"
            >
              Request Free Sample Box
            </button>
            <a
              href={`https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Classical Decor ID, I would like to request a tailored architectural material sample box for our UAE project.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/20 active:scale-95"
            >
              Direct WhatsApp Desk
            </a>
          </div>
        </div>

      </section>

      {/* 3. Frequently Asked Questions (Database-driven & GEO Optimized) */}
      <FAQSection onOpenQuote={onOpenQuote} onFaqsLoaded={setLoadedFaqs} />

      {/* 4. Trade Services Section */}
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
                <Icon aria-hidden="true" className="mb-4 h-6 w-6 text-brand-bronzeDark" strokeWidth={1.5} />
                <h3 className="font-display text-sm font-semibold text-stone-900">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-stone-600 font-sans">{text}</p>
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
