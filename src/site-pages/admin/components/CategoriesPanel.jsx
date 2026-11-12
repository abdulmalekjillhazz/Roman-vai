import React from 'react';
import { Edit3, Plus, Save, Tags, Trash2 } from 'lucide-react';

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
      <section className="rounded-3xl border border-stone-200/80 bg-white p-4 shadow-[0_18px_45px_-24px_rgba(28,25,23,0.5)] sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_14px_-8px_rgba(146,64,14,0.6)]"><Tags size={19} aria-hidden="true" /></span>
              <h2 className="font-display text-xl font-bold text-brand-charcoal">Categories</h2>
            </div>
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
                  <button type="button" onClick={() => onEditCategory(category)} className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1.5 text-[10px] font-bold text-amber-800 transition hover:-translate-y-0.5 hover:bg-amber-200"><Edit3 size={12} aria-hidden="true" />Edit</button>
                  <button type="button" onClick={() => deleteCategory(category._id || category.slug)} className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1.5 text-[10px] font-bold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-200"><Trash2 size={12} aria-hidden="true" />Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-stone-200/80 bg-white p-4 shadow-[0_18px_45px_-24px_rgba(28,25,23,0.5)] sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 bg-stone-100 text-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_14px_-8px_rgba(28,25,23,0.5)]"><Plus size={19} aria-hidden="true" /></span>
          <h2 className="font-display text-xl font-bold text-brand-charcoal">{selectedCategoryId ? 'Edit Category' : 'Add Category'}</h2>
        </div>
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
            <button type="button" onClick={resetCategoryForm} className="inline-flex min-h-11 items-center rounded-xl border border-brand-sand bg-white px-4 py-2.5 text-xs font-bold text-brand-charcoal transition hover:bg-stone-50">Clear</button>
            <button type="submit" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-brand-charcoal px-5 py-2.5 text-xs font-bold text-white shadow-[0_8px_18px_-10px_rgba(28,25,23,0.8)] transition hover:-translate-y-0.5"><Save size={14} aria-hidden="true" />{selectedCategoryId ? 'Update Category' : 'Save Category'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
