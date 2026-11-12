import React, { useState, useMemo } from 'react';
import { Search, RefreshCw, Edit3, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle, Layers, Sparkles, Box, ShieldCheck } from 'lucide-react';

export default function ProductInventory({ products = [], loading = false, fetchProducts, editProduct, deleteProduct }) {
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in-stock' | 'out-of-stock'

  // Summary Metrics for quick admin pulse
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter(p => p.inStock).length;
    const outOfStock = total - inStock;
    const totalPhotos = products.reduce((acc, p) => acc + (p.images?.length || 0), 0);
    return { total, inStock, outOfStock, totalPhotos };
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Stock status filter
      if (stockFilter === 'in-stock' && !p.inStock) return false;
      if (stockFilter === 'out-of-stock' && p.inStock) return false;

      // Search keyword filter
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      const name = (p.name || '').toLowerCase();
      const sku = (p.sku || p.id || '').toLowerCase();
      const cat = (p.categoryName || p.category || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const mat = (p.specifications?.material || '').toLowerCase();

      return name.includes(q) || sku.includes(q) || cat.includes(q) || desc.includes(q) || mat.includes(q);
    });
  }, [products, search, stockFilter]);

  return (
    <div className="space-y-6">
      {/* 1. TOP KPI DASHBOARD TILES (3D Soft Depth & Metallic Accents) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Catalog Items */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 sm:p-5 border border-stone-200/90 shadow-[0_8px_20px_-6px_rgba(28,25,23,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(229,169,36,0.22)] transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-stone-500">
              Active Materials
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#E5A924] shadow-xs">
              <Box size={16} />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {stats.total}
            </span>
            <span className="text-[11px] font-mono text-stone-500">models</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-amber-900/80">
            <Sparkles size={12} className="text-[#E5A924]" />
            <span>Official UAE Catalog</span>
          </div>
        </div>

        {/* In-Stock Live Status */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 sm:p-5 border border-stone-200/90 shadow-[0_8px_20px_-6px_rgba(28,25,23,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(34,197,94,0.18)] transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-emerald-800">
              Ready Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700 tracking-tight">
              {stats.inStock}
            </span>
            <span className="text-[11px] font-mono text-emerald-600/80">available</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>24-48h Dispatch in UAE</span>
          </div>
        </div>

        {/* Out-of-Stock Alert */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 sm:p-5 border border-stone-200/90 shadow-[0_8px_20px_-6px_rgba(28,25,23,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(239,68,68,0.16)] transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-stone-500">
              Restock Needed
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-xs">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {stats.outOfStock}
            </span>
            <span className="text-[11px] font-mono text-stone-500">items</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
            <span className={`w-2 h-2 rounded-full ${stats.outOfStock > 0 ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span>{stats.outOfStock > 0 ? 'Requires warehouse restock' : 'Zero depleted items'}</span>
          </div>
        </div>

        {/* High-Res Visual Assets */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 sm:p-5 border border-stone-200/90 shadow-[0_8px_20px_-6px_rgba(28,25,23,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(28,25,23,0.14)] transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-stone-500">
              Gallery Media
            </span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shadow-xs">
              <ImageIcon size={16} />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {stats.totalPhotos}
            </span>
            <span className="text-[11px] font-mono text-stone-500">photos</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-stone-600">
            <ShieldCheck size={12} className="text-amber-800" />
            <span>Cloudinary Optimized Assets</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN INVENTORY CONTAINER (Elevated Glass & 3D Layered Depth) */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-[0_14px_35px_-8px_rgba(28,25,23,0.08)] overflow-hidden">
        {/* Header & Controls Toolbar */}
        <div className="p-4 sm:p-6 border-b border-stone-200/80 bg-gradient-to-b from-stone-50/70 via-white to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Material Catalog Inventory
                </h2>
                <span className="rounded-full bg-amber-50 border border-amber-300/70 px-3 py-0.5 text-xs font-mono font-bold text-amber-900 shadow-2xs">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1 font-sans">
                Review live material specifications, update stock availability, and manage high-resolution finishes.
              </p>
            </div>

            {/* Tactile 3D Refresh Action */}
            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading}
              className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-800 shadow-[0_3px_10px_rgba(0,0,0,0.05)] hover:border-[#E5A924] hover:shadow-[0_6px_16px_rgba(229,169,36,0.2)] hover:bg-stone-50 transition-all duration-200 active:translate-y-0.5 active:shadow-inner disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-[#E5A924]' : 'text-stone-500'} />
              <span>{loading ? 'Refreshing...' : 'Refresh Inventory'}</span>
            </button>
          </div>

          {/* Search Bar + Tactile Filter Controls */}
          <div className="mt-5 flex flex-col md:flex-row gap-3">
            {/* 3D Inset Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by finish name (e.g. Travertine, SPC, Walnut, Oak), SKU, or spec..."
                className="min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50/80 pl-10 pr-12 py-2.5 text-xs text-stone-900 placeholder-stone-400 shadow-inner focus:bg-white focus:outline-none focus:border-[#E5A924] focus:ring-4 focus:ring-amber-400/15 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-xs text-stone-400 transition hover:bg-stone-200 hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Tactile 3D Filter Pills */}
            <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:shrink-0">
              <button
                type="button"
                onClick={() => setStockFilter('all')}
                className={`inline-flex min-h-11 items-center justify-center rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200 active:translate-y-0.5 sm:px-4 ${
                  stockFilter === 'all'
                    ? 'bg-stone-900 text-white shadow-[0_4px_12px_rgba(28,25,23,0.25)] border border-stone-900'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50 shadow-2xs'
                }`}
              >
                All Finishes ({stats.total})
              </button>
              <button
                type="button"
                onClick={() => setStockFilter('in-stock')}
                className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200 active:translate-y-0.5 sm:px-4 ${
                  stockFilter === 'in-stock'
                    ? 'bg-emerald-700 text-white shadow-[0_4px_12px_rgba(4,120,87,0.3)] border border-emerald-700'
                    : 'bg-emerald-50/80 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 shadow-2xs'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                In Stock ({stats.inStock})
              </button>
              <button
                type="button"
                onClick={() => setStockFilter('out-of-stock')}
                className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200 active:translate-y-0.5 sm:px-4 ${
                  stockFilter === 'out-of-stock'
                    ? 'bg-red-700 text-white shadow-[0_4px_12px_rgba(185,28,28,0.3)] border border-red-700'
                    : 'bg-red-50/80 border border-red-200 text-red-800 hover:bg-red-100 shadow-2xs'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Out of Stock ({stats.outOfStock})
              </button>
            </div>
          </div>
        </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-20 text-center text-xs text-brand-muted flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-brand-gold" />
          <span>Loading catalog inventory...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-stone-500 px-4">
          <Layers size={32} className="mx-auto mb-2 text-stone-400 stroke-1" />
          <p className="text-sm font-bold text-stone-700">No products match your search</p>
          <p className="text-xs text-stone-500 mt-1">Try clearing your search term or stock filter.</p>
          {(search || stockFilter !== 'all') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setStockFilter('all'); }}
              className="mt-3 text-xs font-bold text-brand-gold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ============================================================== */}
          {/* MOBILE CARD VIEW: Under `md` breakpoint (320px - 767px)        */}
          {/* Ultra-clean, tactile cards with 3D depth and clear hierarchy   */}
          {/* ============================================================== */}
          <div className="block md:hidden divide-y divide-stone-200/70">
            {filteredProducts.map(p => {
              const mainThumb = p.thumbnail || p.images?.[0];
              const sku = p.sku || p.id;
              const photoCount = p.images?.length || 0;
              const thickness = p.specifications?.thickness;
              const dimensions = p.specifications?.dimensions;

              return (
                <div key={p.id || p._id || p.slug} className="p-4 sm:p-5 hover:bg-amber-50/25 transition-all duration-200">
                  {/* Card Header: Thumbnail + Identity */}
                  <div className="flex gap-3.5 items-start">
                    {/* Thumbnail Image Container */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-xs">
                      {mainThumb ? (
                        <img
                          src={mainThumb}
                          alt={p.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-stone-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <span
                        className="absolute bottom-0 right-0 rounded-tl bg-amber-500 px-1 py-0.5 text-[8px] font-black text-stone-950"
                        title="Primary Thumbnail"
                      >
                        ★
                      </span>
                    </div>

                    {/* Product Name, Category & SKU */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-stone-100 border border-stone-200/80 text-stone-700 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
                          {p.categoryName || p.category}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.inStock
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-[0_1px_4px_rgba(16,185,129,0.12)]'
                            : 'bg-red-50 text-red-800 border border-red-200/90 shadow-[0_1px_4px_rgba(239,68,68,0.12)]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-stone-900 mt-1.5 line-clamp-1 break-words">
                        {p.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-stone-600 font-semibold">SKU:</span>
                        <span className="font-mono text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/80 whitespace-nowrap">
                          {sku}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Description */}
                  {p.description && (
                    <p className="mt-2.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  )}

                  {/* Specs & Images Pill Strip */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-stone-600">
                    <span className="bg-amber-50/80 border border-amber-200/70 text-amber-900 rounded-lg px-2.5 py-1 font-bold inline-flex items-center gap-1 shadow-2xs">
                      📸 {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                    </span>
                    {thickness && (
                      <span className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 truncate max-w-[170px]" title={thickness}>
                        Thick: <strong className="text-stone-800">{thickness}</strong>
                      </span>
                    )}
                    {dimensions && (
                      <span className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 truncate max-w-[170px]" title={dimensions}>
                        Dim: <strong className="text-stone-800">{dimensions}</strong>
                      </span>
                    )}
                  </div>

                  {/* Touch Action Buttons (3D Tactile Buttons) */}
                  <div className="mt-4 pt-3.5 border-t border-stone-200/70 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => editProduct(p)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E5A924] to-amber-500 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-[0_3px_10px_rgba(229,169,36,0.3)] hover:shadow-[0_5px_15px_rgba(229,169,36,0.4)] active:translate-y-0.5 transition-all"
                    >
                      <Edit3 size={14} />
                      <span>Edit & Manage Finishes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProduct(p.id || p._id)}
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs font-bold text-red-600 shadow-2xs hover:bg-red-50 hover:border-red-200 active:translate-y-0.5 transition-all"
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                      <span className="sr-only sm:not-sr-only">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ============================================================== */}
          {/* DESKTOP TABLE VIEW: Medium & Larger screens (`md:block`)        */}
          {/* Full tabular overview with clean spacing & 3D luxury styling    */}
          {/* ============================================================== */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[1040px]">
              <thead className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-stone-200 font-mono uppercase tracking-wider text-[11px] border-b-2 border-[#E5A924]">
                <tr>
                  <th className="py-4 px-4 w-40 whitespace-nowrap">SKU / ID</th>
                  <th className="py-4 px-3 w-16">Thumb</th>
                  <th className="py-4 px-5 min-w-[340px]">Material Name &amp; Specifications</th>
                  <th className="py-4 px-3 w-36 whitespace-nowrap">Category</th>
                  <th className="py-4 px-3 w-48 whitespace-nowrap">Thickness &amp; Size</th>
                  <th className="py-4 px-3 w-28 text-center whitespace-nowrap">Gallery</th>
                  <th className="py-4 px-3 w-32 text-center whitespace-nowrap">Availability</th>
                  <th className="py-4 px-5 w-32 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70">
                {filteredProducts.map(p => {
                  const mainThumb = p.thumbnail || p.images?.[0];
                  const sku = p.sku || p.id;
                  const photoCount = p.images?.length || 0;

                  return (
                    <tr
                      key={p.id || p._id || p.slug}
                      className="group hover:bg-gradient-to-r hover:from-amber-50/40 hover:via-white hover:to-white transition-all duration-200"
                    >
                      {/* SKU / ID (Preserves full string without vertical breaking) */}
                      <td className="py-4 px-4 font-mono font-bold text-stone-900 text-xs whitespace-nowrap">
                        <span className="bg-stone-100 border border-stone-200/90 text-stone-800 rounded-lg px-2.5 py-1.5 inline-block shadow-2xs group-hover:border-amber-300 transition-colors">
                          {sku}
                        </span>
                      </td>

                      {/* Thumbnail with Star Badge */}
                      <td className="py-4 px-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-xs">
                          {mainThumb ? (
                            <img
                              src={mainThumb}
                              alt={p.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-stone-400">
                              <ImageIcon size={18} />
                            </div>
                          )}
                          <span
                            className="absolute bottom-0 right-0 rounded-tl bg-amber-500 px-1 py-0.5 text-[8px] font-black text-stone-950"
                            title="Primary Catalog Thumbnail"
                          >
                            ★
                          </span>
                        </div>
                      </td>

                      {/* Material Name & Description (Generous width & clear readable layout) */}
                      <td className="py-4 px-5">
                        <div className="font-serif font-bold text-stone-900 text-sm group-hover:text-amber-900 transition-colors">
                          {p.name}
                        </div>
                        {p.description ? (
                          <div className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed max-w-xl" title={p.description}>
                            {p.description}
                          </div>
                        ) : (
                          <div className="text-[11px] text-stone-400 italic mt-0.5">No description provided</div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <span className="inline-block bg-stone-100 border border-stone-200/80 text-stone-700 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                          {p.categoryName || p.category}
                        </span>
                      </td>

                      {/* Specifications */}
                      <td className="py-4 px-3 font-mono text-stone-600 text-[11px] whitespace-nowrap">
                        <div className="truncate max-w-[180px]" title={p.specifications?.thickness}>
                          Thick: <span className="font-semibold text-stone-900">{p.specifications?.thickness || 'N/A'}</span>
                        </div>
                        <div className="truncate max-w-[180px] text-stone-500 mt-1" title={p.specifications?.dimensions}>
                          Dim: <span className="text-stone-700">{p.specifications?.dimensions || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Photo Count with Gallery Badge */}
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span className="font-mono text-stone-800 bg-amber-50/80 border border-amber-200/80 px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs">
                          📸 {photoCount}
                        </span>
                      </td>

                      {/* Stock Status with Pulse Dot */}
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                          p.inStock
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-[0_2px_8px_rgba(16,185,129,0.15)]'
                            : 'bg-red-50 text-red-800 border border-red-200 shadow-[0_2px_8px_rgba(239,68,68,0.15)]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>

                      {/* 3D Action Buttons */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => editProduct(p)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#E5A924] to-amber-500 px-3 py-1.5 text-[11px] font-bold text-stone-950 shadow-[0_2px_8px_rgba(229,169,36,0.25)] hover:shadow-[0_4px_12px_rgba(229,169,36,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner transition-all duration-150"
                          >
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id || p._id)}
                            className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-red-600 shadow-2xs hover:bg-red-50 hover:border-red-200 hover:text-red-700 active:translate-y-0 transition-all duration-150"
                            title="Delete Material"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      </div>
    </div>
  );
}
