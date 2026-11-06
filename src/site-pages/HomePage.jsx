import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, Layers, MapPin, MessageCircle } from 'lucide-react';
import SEOHead from '../components/public/SEOHead.jsx';
import ProductCard from '../components/public/ProductCard.jsx';
import ProductModal from '../components/public/ProductModal.jsx';
import MaterialHero from '../components/public/MaterialHero.jsx';
import FallbackImage from '../components/public/FallbackImage.jsx';
import cloudCatalog from '../../data/products_cloudinary.json';
import localCatalog from '../../data/products_data.json';
import { CLIENT_INFO } from '../config/clientInfo.js';

const GROUPS = [{ id: 'all', label: 'All materials' }, { id: 'wall-products', label: 'Walls & surfaces' }, { id: 'flooring-products', label: 'Flooring' }, { id: 'details', label: 'Profiles & fixing' }];
const INITIAL_CATALOG = cloudCatalog.length ? cloudCatalog : localCatalog;
const MATERIAL_STUDIES = [
  { file: 'project-completed-luxury-villa-wall-cladding-01', title: 'Texture in context', detail: 'Illuminated feature walls' },
  { file: 'project-completed-herringbone-parquet-residential-05', title: 'Pattern underfoot', detail: 'Herringbone flooring' },
  { file: 'project-completed-commercial-office-feature-wall-03', title: 'A considered detail', detail: 'Layered wall finishes' }
];

export default function HomePage({ onOpenQuote, categorySlug }) {
  // The static catalog renders on the first response, before the background API refresh.
  const [products, setProducts] = useState(INITIAL_CATALOG);
  const [activeGroup, setActiveGroup] = useState(categorySlug || 'all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => { setActiveGroup(categorySlug || 'all'); }, [categorySlug]);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || '/api'}/products`, { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Catalog unavailable')))
      .then(data => { if (Array.isArray(data) && data.every(item => item?.name && item?.category)) setProducts(data); })
      .catch(() => { /* Keep the static catalog available during an outage. */ })
      .finally(() => window.clearTimeout(timeout));
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, []);
  const filteredProducts = useMemo(() => products.filter(product => {
    const groupMatches = activeGroup === 'all' || product.category === activeGroup || (activeGroup === 'details' && ['aluminum-profiles', 'fixing-materials', 'woodworking'].includes(product.category));
    return groupMatches && `${product.name} ${product.description || ''} ${product.categoryName || ''}`.toLowerCase().includes(search.trim().toLowerCase());
  }), [products, activeGroup, search]);
  return (
    <div className="bg-brand-cream">
      <SEOHead title={`${CLIENT_INFO.brandName} | Architectural Materials, Dubai`} description="Explore flexible stone, wall panels, flooring and architectural details. Material samples and project support for designers and contractors in Dubai and the UAE." canonicalPath={categorySlug ? `/category/${categorySlug}` : '/'} />
      {!categorySlug && <>
        <MaterialHero onOpenQuote={onOpenQuote} />
        <section aria-label="Material applications" className="mx-auto grid max-w-7xl gap-4 px-4 pb-10 pt-5 sm:grid-cols-3 sm:px-6 lg:px-8">
          {MATERIAL_STUDIES.map(study => <Link href="/gallery" key={study.title} className="group flex min-w-0 items-center gap-4 rounded-xl border border-stone-200/80 bg-white/50 p-2.5 transition hover:border-stone-400">
            <FallbackImage src={`/assets/decorforall/${study.file}.webp`} alt={study.detail} loading="lazy" width={96} height={80} className="h-20 w-24 flex-none rounded-lg object-cover" />
            <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">{study.detail}</p><h2 className="mt-1 text-sm font-medium text-stone-900">{study.title}</h2></div><ArrowUpRight aria-hidden="true" className="ml-auto mr-2 h-4 w-4 flex-none text-stone-500" />
          </Link>)}
        </section>
      </>}
      <section id="product-catalog" aria-labelledby="catalog-title" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">The material collection</p><h2 id="catalog-title" className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Find your finish.</h2></div><p className="max-w-sm text-sm leading-6 text-stone-600">Walls, floors and the details that bring a space together. Explore a material to see finishes and specifications.</p></div>
        <div className="mb-8 flex flex-col justify-between gap-5 border-y border-stone-200 py-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-1.5" aria-label="Filter materials">{GROUPS.map(group => <button key={group.id} type="button" aria-pressed={activeGroup === group.id} onClick={() => setActiveGroup(group.id)} className={`min-h-11 rounded-full px-4 text-xs font-semibold transition ${activeGroup === group.id ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-200/60'}`}>{group.label}</button>)}</div>
          <div className="relative lg:w-64"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-stone-500" /><input type="search" aria-label="Search materials" placeholder="Search materials…" value={search} onChange={event => setSearch(event.target.value)} className="h-11 w-full rounded-lg border border-stone-300 bg-transparent pl-10 pr-3 text-sm placeholder:text-stone-500" /></div>
        </div>
        {filteredProducts.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-6">{filteredProducts.map((product, index) => <ProductCard key={product._id || product.id || product.slug} product={product} priority={index < 2} onSelectProduct={setSelectedProduct} />)}</div> : <div role="status" className="rounded-xl border border-stone-200 py-16 text-center"><h3 className="text-lg font-medium">No matching materials</h3><p className="mt-2 text-sm text-stone-600">Try another name or browse the full collection.</p><button onClick={() => { setSearch(''); setActiveGroup('all'); }} className="mt-4 min-h-11 px-5 text-sm font-semibold underline underline-offset-4">Show all materials</button></div>}
        <div className="mt-10 text-center"><Link href="/gallery" className="inline-flex min-h-12 items-center gap-3 border-b border-stone-700 px-1 text-sm font-semibold">Explore the material gallery <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div>
      </section>
      <section aria-labelledby="service-title" className="border-t border-stone-200 bg-[#eee9df]"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_2fr] lg:px-8 lg:py-16">
        <div><p className="eyebrow">For the way you work</p><h2 id="service-title" className="mt-3 max-w-xs font-serif text-3xl font-semibold sm:text-4xl">From material choice<br />to your next project.</h2></div>
        <div className="grid gap-7 sm:grid-cols-3">{[{ Icon: Layers, title: 'See it. Feel it.', text: 'Request samples to compare texture, colour and finish for your scheme.' }, { Icon: MessageCircle, title: 'Talk materials.', text: 'Discuss specifications and availability directly with our team.' }, { Icon: MapPin, title: 'Made for your brief.', text: 'Material supply for designers, contractors and project teams across the UAE.' }].map(({ Icon, title, text }) => <div key={title}><Icon aria-hidden="true" className="mb-4 h-6 w-6 text-[#8a6b36]" strokeWidth={1.5} /><h3 className="text-sm font-semibold">{title}</h3><p className="mt-2 text-xs leading-6 text-stone-600">{text}</p></div>)}</div>
      </div></section>
      <ProductModal product={selectedProduct} isOpen={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)} onOpenQuote={onOpenQuote} />
    </div>
  );
}
