import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SEOHead from '../components/public/SEOHead.jsx';
import ProductCard from '../components/public/ProductCard.jsx';
import ProductModal from '../components/public/ProductModal.jsx';
import { CLIENT_INFO } from '../config/clientInfo.js';

const FILTER_TABS = [
  { id: 'all', label: 'All products' },
  { id: 'wall', label: 'Wall panels & stone', categorySlug: 'wall-products' },
  { id: 'flooring', label: 'Flooring', categorySlug: 'flooring-products' },
  { id: 'profiles', label: 'Profiles & fixing', categorySlug: 'aluminum-profiles' },
  { id: 'new', label: 'New arrivals' }
];

const CATEGORY_TAB = {
  'wall-products': 'wall',
  'flooring-products': 'flooring',
  'aluminum-profiles': 'profiles',
  'fixing-materials': 'profiles',
  woodworking: 'profiles'
};

export default function HomePage({ onOpenQuote }) {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;
    setLoading(true);
    setLoadError('');
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

    async function loadProducts() {
      try {
        const res = await axios.get(`${apiBase}/products`, { signal: controller.signal });
        if (Array.isArray(res.data) && res.data.length > 0) {
          if (!isCancelled) setProducts(res.data);
          return;
        }
        throw new Error('Empty or invalid response from API');
      } catch (apiErr) {
        if (controller.signal.aborted || isCancelled) return;
        // Resilient fallback to static catalog so site never fails on serverless/static deployments
        try {
          const fallbackRes = await fetch('/data/products_data.json', { signal: controller.signal });
          const fallbackData = await fallbackRes.json();
          if (Array.isArray(fallbackData) && !isCancelled) {
            setProducts(fallbackData);
            return;
          }
        } catch (fbErr) {
          if (!controller.signal.aborted && !isCancelled) {
            console.error('Failed to load products:', apiErr, fbErr);
            setLoadError('We could not load the product range right now. Please try again or contact our team.');
          }
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [reloadKey]);

  useEffect(() => {
    setActiveTab(CATEGORY_TAB[categorySlug] || 'all');
  }, [categorySlug]);

  function handleTabChange(tab) {
    setActiveTab(tab.id);
    if (tab.categorySlug) {
      navigate(`/category/${tab.categorySlug}`);
    } else if (tab.id === 'all') {
      navigate('/');
    }
  }

  // Filter products by tab and search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeTab === 'all') return true;
      if (activeTab === 'new') return p.isNew === true;
      if (activeTab === 'wall') return p.category === 'wall-products';
      if (activeTab === 'flooring') return p.category === 'flooring-products';
      if (activeTab === 'profiles')
        return (
          p.category === 'aluminum-profiles' ||
          p.category === 'fixing-materials' ||
          p.category === 'woodworking'
        );

      return true;
    });
  }, [products, activeTab, search]);

  // Section 1: Wall Panels & Stone (7 items)
  const wallProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.category === 'wall-products' &&
        (search.trim() === '' ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase())))
    );
  }, [products, search]);

  // Section 2: Flooring & Skirting (3 items)
  const flooringProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.category === 'flooring-products' &&
        (search.trim() === '' ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase())))
    );
  }, [products, search]);

  // Section 3: Profiles & Fixing (2 items)
  const profileProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (p.category === 'aluminum-profiles' ||
          p.category === 'fixing-materials' ||
          p.category === 'woodworking') &&
        (search.trim() === '' ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase())))
    );
  }, [products, search]);

  return (
    <div className="bg-[#FAF7F0] min-h-screen pb-20">
      <SEOHead
        title={`${CLIENT_INFO.brandName} | Luxury Interior Materials Supplier in Dubai, UAE`}
        description="Discover premium wall panels, flooring, stone finishes, and architectural materials from Classical Decor ID for residential, hospitality, and commercial projects across Dubai and the UAE."
        canonicalPath="/"
      />

      {/* Floating Announcement Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="bg-[#141414] text-white py-5 px-6 sm:px-8 rounded-2xl border border-stone-800/80 floating-banner flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-sans font-bold text-base sm:text-xl text-white tracking-tight">
              Premium interior materials for Dubai and UAE projects
            </h1>
            <p className="font-sans text-xs sm:text-sm text-stone-400 mt-1">
              Architectural surfaces, wall finishes, flooring, and finishing materials trusted by designers, contractors, and developers.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Link
              to="/gallery"
              className="inline-flex min-h-10 items-center rounded-xl bg-brand-gold px-4 text-xs font-bold text-brand-charcoal transition hover:bg-amber-400 shadow-md hover:-translate-y-0.5"
            >
              Explore materials
            </Link>
            <button
              type="button"
              onClick={() => onOpenQuote('General product inquiry')}
              className="inline-flex min-h-10 items-center rounded-xl border border-white/25 px-4 text-xs font-bold text-white transition hover:bg-white/10 hover:-translate-y-0.5"
            >
              Ask our team
            </button>
          </div>
        </div>
      </section>

      {/* Trust + Conversion Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/80 p-5 floating-card">
            <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-amber-700 font-bold">Trade pricing</p>
            <h2 className="mt-3 font-display text-2xl text-stone-900">Commercial-grade supply</h2>
            <p className="mt-2 text-sm text-stone-600">Direct rates for contractors, designers, developers, and fit-out teams across the UAE.</p>
          </div>
          <div className="rounded-2xl border border-white/80 p-5 floating-card">
            <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-amber-700 font-bold">Fast delivery</p>
            <h2 className="mt-3 font-display text-2xl text-stone-900">Quick UAE turnaround</h2>
            <p className="mt-2 text-sm text-stone-600">Flexible stock, project support, and prompt coordination for time-sensitive installations.</p>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-[#141414] p-5 floating-banner text-white">
            <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-amber-300 font-bold">Need samples?</p>
            <h2 className="mt-3 font-display text-2xl text-white">Request a quote today</h2>
            <p className="mt-2 text-sm text-stone-300">Get expert guidance for product selection, finish matching, and specification support.</p>
            <button
              type="button"
              onClick={() => onOpenQuote('Luxury catalog and sample inquiry')}
              className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-brand-gold px-4 text-xs font-bold text-brand-charcoal transition hover:bg-amber-400 shadow-md hover:-translate-y-0.5"
            >
              Request trade pricing
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-[28px] border border-white/90 p-5 floating-card sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.22em] text-amber-700 font-bold">Why project teams choose us</p>
              <h2 className="mt-2 font-display text-2xl text-stone-900 sm:text-3xl">A practical, premium supply partner for modern builds</h2>
            </div>
            <button
              type="button"
              onClick={() => onOpenQuote('Project consultation')}
              className="inline-flex min-h-10 items-center rounded-xl border border-stone-300 px-4 text-xs font-bold text-stone-800 transition hover:border-amber-500 hover:bg-stone-50 shadow-xs"
            >
              Book a consultation
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'Product matching', text: 'Help narrowing the right finish, texture, and thickness for each room and budget.', badge: 'Spec support' },
              { title: 'Fast response', text: 'Clear communication for RFQs, sample requests, and urgent project updates.', badge: 'UAE support' },
              { title: 'Trade-friendly flow', text: 'Built for contractors, developers, and fit-out teams who need reliable supply coordination.', badge: 'B2B ready' },
              { title: 'Install-ready guidance', text: 'Practical advice on finishing, fixing methods, and material selection for long-term performance.', badge: 'Expert help' }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-stone-200/80 bg-[#FAF7F0]/60 p-4 floating-pill hover:-translate-y-1">
                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.18em] text-amber-700">
                  {item.badge}
                </span>
                <h3 className="mt-3 font-sans text-base font-bold text-stone-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs and Floating Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4">
          {/* Pill Tabs with Floating Elevation */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-sans transition-all duration-200 tracking-tight floating-pill ${
                    isActive
                      ? 'bg-[#18181b] text-white font-bold shadow-[0_8px_20px_rgba(0,0,0,0.25)] -translate-y-0.5'
                      : 'bg-white text-stone-700 border border-stone-200/90 hover:border-stone-400 font-medium'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box with Deep Floating Luxury Shadow */}
          <div className="relative w-full lg:w-80 shrink-0">
            <span className="absolute left-3.5 top-3 text-stone-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
              placeholder="Search surfaces (e.g. Stone, WPC, Marble...)"
              className="w-full bg-white border border-stone-200/90 rounded-2xl pl-10 pr-9 py-2.5 text-xs font-sans text-stone-900 placeholder-gray-200 focus:outline-none floating-input"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear product search"
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Catalog Grid Section (12 Core Categories) */}
      <main id="product-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {loading ? (
          <div className="py-24 text-center text-stone-500 font-sans text-sm">
            Loading products...
          </div>
        ) : loadError ? (
          <div role="alert" className="my-8 rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
            <p className="font-semibold text-stone-900">{loadError}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setReloadKey(key => key + 1)}
                className="min-h-10 rounded-lg bg-stone-900 px-4 text-sm font-semibold text-white hover:bg-stone-700"
              >
                Try again
              </button>
              <a
                href={`https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent('Hello, I would like to ask about your interior materials.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-800 hover:border-amber-500"
              >
                Contact us on WhatsApp
              </a>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="my-8 rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <h2 className="font-sans text-lg font-bold text-stone-900">Our product range is being updated</h2>
            <p className="mt-2 text-sm text-stone-600">Contact our team for current product details and availability.</p>
            <a
              href={`https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent('Hello, could you share your current product range?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-brand-gold px-4 text-sm font-bold text-brand-charcoal"
            >
              Ask our team
            </a>
          </div>
        ) : activeTab === 'all' && search.trim() === '' ? (
          /* Render 3 Distinct Sections with clean 12 categories */
          <div className="space-y-10">
            {/* Section 1: Wall Panels, Stone & Marble (7 Categories) */}
            <section>
              <div className="flex items-baseline justify-between mb-3.5">
                <h2 className="font-sans font-bold text-base sm:text-lg text-stone-900">
                  Wall panels, stone & marble
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {wallProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelectProduct={setSelectedProduct}
                  />
                ))}
              </div>
            </section>

            {/* Section 2: Luxury Flooring & Skirting (3 Categories) */}
            <section>
              <div className="flex items-baseline justify-between mb-3.5">
                <h2 className="font-sans font-bold text-base sm:text-lg text-stone-900">
                  Flooring & skirting
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {flooringProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelectProduct={setSelectedProduct}
                  />
                ))}
              </div>
            </section>

            {/* Section 3: Architectural Profiles & Fixing (2 Categories) */}
            <section>
              <div className="flex items-baseline justify-between mb-3.5">
                <h2 className="font-sans font-bold text-base sm:text-lg text-stone-900">
                  Profiles & fixing materials
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {profileProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelectProduct={setSelectedProduct}
                  />
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* Filtered or Search View */
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sans font-bold text-base sm:text-lg text-stone-900">
                {activeTab === 'new'
                  ? 'New arrivals'
                  : activeTab === 'wall'
                  ? 'Wall panels, stone & marble'
                  : activeTab === 'flooring'
                  ? 'Flooring & skirting'
                  : activeTab === 'profiles'
                  ? 'Profiles & fixing materials'
                  : 'Products'}
              </h2>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
                <p className="font-sans text-base font-bold text-stone-800">
                  No matching architectural surfaces found
                </p>
                <p className="font-sans text-xs text-stone-500 mt-1">
                Try a different product name or material, or contact our team for help.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelectProduct={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Luxury Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
