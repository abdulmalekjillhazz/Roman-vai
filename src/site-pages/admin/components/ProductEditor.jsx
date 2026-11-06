import React from 'react';
import ProductImageManager from './ProductImageManager.jsx';

export default function ProductEditor({ productManager, categories }) {
  const {
    selectedProductId,
    productForm,
    productError,
    productMsg,
    resetProductForm,
    submitProduct,
    handleProductFieldChange
  } = productManager;

  return (
    <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="font-display text-xl font-bold text-brand-charcoal">{selectedProductId ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-xs text-brand-muted">Create or update product entries, stock status, and product images.</p>
        </div>
        {selectedProductId && (
          <button type="button" onClick={resetProductForm} className="text-xs font-bold text-brand-charcoal hover:underline">Cancel edit</button>
        )}
      </div>

      {productError && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{productError}</div>}
      {productMsg && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{productMsg}</div>}

      <form onSubmit={submitProduct} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Product Name</label>
          <input value={productForm.name} onChange={e => handleProductFieldChange('name', e.target.value)} placeholder="e.g. Natural Flexible Stone" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Category</label>
          <select value={productForm.category} onChange={e => handleProductFieldChange('category', e.target.value)} className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold floating-input">
            {categories.length ? categories.map(cat => (
              <option key={cat.slug || cat._id} value={cat.slug || cat._id}>{cat.name}</option>
            )) : (
              <>
                <option value="wall-products">Wall Panels</option>
                <option value="flooring-products">Flooring</option>
                <option value="aluminum-profiles">Profiles & Fixing</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Category Label</label>
          <input value={productForm.categoryName} onChange={e => handleProductFieldChange('categoryName', e.target.value)} placeholder="Wall Panels" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Description</label>
          <textarea rows="4" value={productForm.description} onChange={e => handleProductFieldChange('description', e.target.value)} placeholder="Architectural description..." className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Thickness</label>
          <input value={productForm.thickness} onChange={e => handleProductFieldChange('thickness', e.target.value)} placeholder="e.g. 5mm" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Dimensions</label>
          <input value={productForm.dimensions} onChange={e => handleProductFieldChange('dimensions', e.target.value)} placeholder="e.g. 1220mm x 2440mm" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Material</label>
          <input value={productForm.material} onChange={e => handleProductFieldChange('material', e.target.value)} placeholder="e.g. Natural Stone / Resin" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Featured?</label>
          <select value={productForm.isFeatured ? 'true' : 'false'} onChange={e => handleProductFieldChange('isFeatured', e.target.value === 'true')} className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold floating-input">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Features (comma separated)</label>
          <input value={productForm.features} onChange={e => handleProductFieldChange('features', e.target.value)} placeholder="Waterproof, Fire rated, Eco friendly" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
        </div>

        <ProductImageManager productManager={productManager} />

        <div className="md:col-span-2 flex items-center gap-3">
          <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
            <input type="checkbox" checked={productForm.inStock} onChange={e => handleProductFieldChange('inStock', e.target.checked)} className="h-4 w-4 rounded border-brand-sand text-brand-gold focus:ring-brand-gold" />
            In Stock
          </label>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3">
          <button type="button" onClick={resetProductForm} className="rounded-xl border border-brand-sand bg-white px-4 py-2.5 text-xs font-bold text-brand-charcoal">Clear</button>
          <button type="submit" className="rounded-xl bg-brand-charcoal px-5 py-2.5 text-xs font-bold text-white">{selectedProductId ? 'Update Product' : 'Save Product'}</button>
        </div>
      </form>
    </div>
  );
}
