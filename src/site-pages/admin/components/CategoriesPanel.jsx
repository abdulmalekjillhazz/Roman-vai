import React from 'react';

export default function CategoriesPanel({ categoryManager, onEditCategory }) {
  const {
    categories,
    selectedCategoryId,
    categoryForm,
    categoryError,
    categoryMsg,
    resetCategoryForm,
    deleteCategory,
    submitCategory,
    handleCategoryFieldChange
  } = categoryManager;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-display text-xl font-bold text-brand-charcoal">Categories</h2>
            <p className="text-xs text-brand-muted">Manage product groupings.</p>
          </div>
          {selectedCategoryId && (
            <button type="button" onClick={resetCategoryForm} className="text-xs font-bold text-brand-charcoal hover:underline">Clear</button>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="text-xs text-brand-muted py-6">No categories yet.</div>
        ) : (
          <div className="space-y-3">
            {categories.map(category => (
              <div key={category.slug || category._id} className="flex items-center justify-between rounded-2xl border border-brand-sand bg-brand-cream/30 p-3">
                <div>
                  <div className="font-bold text-brand-charcoal">{category.name}</div>
                  <div className="text-[11px] text-brand-muted">/{category.slug}</div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => onEditCategory(category)} className="rounded bg-amber-100 px-2.5 py-1.5 text-[10px] font-bold text-amber-800">Edit</button>
                  <button type="button" onClick={() => deleteCategory(category._id || category.slug)} className="rounded bg-red-100 px-2.5 py-1.5 text-[10px] font-bold text-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-brand-charcoal">{selectedCategoryId ? 'Edit Category' : 'Add Category'}</h2>
        <p className="text-xs text-brand-muted mt-1">Create or edit category pages for your product catalog.</p>

        {categoryError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{categoryError}</div>}
        {categoryMsg && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{categoryMsg}</div>}

        <form onSubmit={submitCategory} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Category Name</label>
            <input value={categoryForm.name} onChange={e => handleCategoryFieldChange('name', e.target.value)} placeholder="e.g. Wall Panels" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Category Slug</label>
            <input value={categoryForm.slug} onChange={e => handleCategoryFieldChange('slug', e.target.value)} className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" placeholder="wall-panels" />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Description</label>
            <textarea rows="4" value={categoryForm.description} onChange={e => handleCategoryFieldChange('description', e.target.value)} placeholder="Category summary..." className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={resetCategoryForm} className="rounded-xl border border-brand-sand bg-white px-4 py-2.5 text-xs font-bold text-brand-charcoal">Clear</button>
            <button type="submit" className="rounded-xl bg-brand-charcoal px-5 py-2.5 text-xs font-bold text-white">{selectedCategoryId ? 'Update Category' : 'Save Category'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
