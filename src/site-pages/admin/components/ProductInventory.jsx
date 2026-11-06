import React, { useState, useMemo } from 'react';
import { Search, RefreshCw, Edit3, Trash2, Image as ImageIcon, CheckCircle, XCircle, Layers } from 'lucide-react';

export default function ProductInventory({ products = [], loading = false, fetchProducts, editProduct, deleteProduct }) {
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in-stock' | 'out-of-stock'

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
    <div className="bg-white rounded-2xl border border-brand-sand overflow-hidden shadow-sm">
      {/* Header & Controls */}
      <div className="p-4 sm:p-6 border-b border-brand-sand/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg sm:text-xl font-bold text-brand-charcoal">Active Material Inventory</h2>
              <span className="rounded-full bg-brand-cream border border-brand-sand px-2.5 py-0.5 text-[11px] font-mono font-bold text-brand-charcoal">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">Manage material catalog, stock visibility, and finish specifications.</p>
          </div>

          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-brand-sand bg-brand-cream/60 px-3 py-2 text-xs font-bold text-brand-charcoal hover:bg-brand-cream transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh List'}</span>
          </button>
        </div>

        {/* Live Filter & Search Controls */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by material name, SKU, or finish..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50/70 pl-9 pr-3.5 py-2 text-xs text-brand-charcoal placeholder-stone-400 focus:bg-white focus:outline-none focus:border-brand-gold transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setStockFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                stockFilter === 'all'
                  ? 'bg-brand-charcoal text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStockFilter('in-stock')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition inline-flex items-center gap-1 ${
                stockFilter === 'in-stock'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In Stock
            </button>
            <button
              type="button"
              onClick={() => setStockFilter('out-of-stock')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition inline-flex items-center gap-1 ${
                stockFilter === 'out-of-stock'
                  ? 'bg-red-800 text-white font-bold'
                  : 'bg-red-50 text-red-800 hover:bg-red-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Out of Stock
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
          {/* Ultra-clean, zero-overflow, touch-first cards                  */}
          {/* ============================================================== */}
          <div className="block md:hidden divide-y divide-brand-sand/50">
            {filteredProducts.map(p => {
              const mainThumb = p.thumbnail || p.images?.[0];
              const sku = p.sku || p.id;
              const photoCount = p.images?.length || 0;
              const thickness = p.specifications?.thickness;
              const dimensions = p.specifications?.dimensions;

              return (
                <div key={p.id || p._id || p.slug} className="p-4 hover:bg-brand-cream/15 transition">
                  {/* Card Header: Thumbnail + Identity */}
                  <div className="flex gap-3 items-start">
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
                        <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          {p.categoryName || p.category}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.inStock
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-600' : 'bg-red-600'}`} />
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-sm text-brand-charcoal mt-1 line-clamp-1 break-words">
                        {p.name}
                      </h3>

                      <p className="font-mono text-[10px] text-stone-500 mt-0.5 truncate">
                        SKU: <span className="font-bold text-brand-charcoal">{sku}</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Description */}
                  {p.description && (
                    <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  )}

                  {/* Specs & Images Pill Strip */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-stone-600">
                    <span className="bg-brand-cream/80 border border-brand-sand/70 rounded-md px-2 py-1">
                      📸 {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                    </span>
                    {thickness && (
                      <span className="bg-stone-50 border border-stone-200 rounded-md px-2 py-1 truncate max-w-[170px]" title={thickness}>
                        Thick: {thickness}
                      </span>
                    )}
                    {dimensions && (
                      <span className="bg-stone-50 border border-stone-200 rounded-md px-2 py-1 truncate max-w-[170px]" title={dimensions}>
                        Dim: {dimensions}
                      </span>
                    )}
                  </div>

                  {/* Touch Action Buttons (Full width on mobile) */}
                  <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => editProduct(p)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-100 active:scale-98"
                    >
                      <Edit3 size={13} />
                      <span>Edit & Manage Finishes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProduct(p.id || p._id)}
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 active:scale-98"
                      title="Delete Product"
                    >
                      <Trash2 size={13} />
                      <span className="sr-only sm:not-sr-only">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ============================================================== */}
          {/* DESKTOP TABLE VIEW: Medium & Larger screens (`md:block`)        */}
          {/* Full tabular overview with sticky header & generous spacing     */}
          {/* ============================================================== */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[880px]">
              <thead className="bg-brand-cream/60 text-brand-charcoal font-bold uppercase tracking-wider text-[11px] border-b border-brand-sand">
                <tr>
                  <th className="p-4 w-28">SKU / ID</th>
                  <th className="p-4 w-20">Thumbnail</th>
                  <th className="p-4 min-w-[200px]">Material Name & Info</th>
                  <th className="p-4 w-36">Category</th>
                  <th className="p-4 w-44">Thickness & Size</th>
                  <th className="p-4 w-24 text-center">Images</th>
                  <th className="p-4 w-28">Stock</th>
                  <th className="p-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand/40">
                {filteredProducts.map(p => {
                  const mainThumb = p.thumbnail || p.images?.[0];
                  const sku = p.sku || p.id;
                  const photoCount = p.images?.length || 0;

                  return (
                    <tr key={p.id || p._id || p.slug} className="hover:bg-brand-cream/20 transition">
                      {/* SKU / ID */}
                      <td className="p-4 font-mono font-bold text-brand-charcoal text-[11px] break-all">
                        {sku}
                      </td>

                      {/* Thumbnail with Star Badge */}
                      <td className="p-4">
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

                      {/* Name & Description */}
                      <td className="p-4">
                        <div className="font-bold text-brand-charcoal text-sm">{p.name}</div>
                        <div className="text-[11px] text-brand-muted line-clamp-1 mt-0.5" title={p.description}>
                          {p.description}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="inline-block bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap">
                          {p.categoryName || p.category}
                        </span>
                      </td>

                      {/* Specifications */}
                      <td className="p-4 font-mono text-stone-600 text-[11px]">
                        <div className="truncate max-w-[160px]" title={p.specifications?.thickness}>
                          Thick: {p.specifications?.thickness || 'N/A'}
                        </div>
                        <div className="truncate max-w-[160px] text-stone-500 mt-0.5" title={p.specifications?.dimensions}>
                          Dim: {p.specifications?.dimensions || 'N/A'}
                        </div>
                      </td>

                      {/* Photo Count */}
                      <td className="p-4 text-center">
                        <span className="font-mono text-stone-700 bg-stone-100 px-2 py-1 rounded text-[11px] whitespace-nowrap">
                          {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                        </span>
                      </td>

                      {/* Stock Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          p.inStock
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-600' : 'bg-red-600'}`} />
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => editProduct(p)}
                            className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1.5 text-[11px] font-bold text-amber-900 transition hover:bg-amber-200 active:scale-95"
                          >
                            <Edit3 size={11} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id || p._id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1.5 text-[11px] font-bold text-red-700 transition hover:bg-red-200 active:scale-95"
                          >
                            <Trash2 size={11} />
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
  );
}
