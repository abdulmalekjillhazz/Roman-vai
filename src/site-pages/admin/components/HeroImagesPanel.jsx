import React from 'react';
import { Image as ImageIcon, Upload, Edit3, Check, RotateCcw } from 'lucide-react';
import { MATERIAL_HERO_SLIDES } from '../../../config/materialHeroSlides.js';

export default function HeroImagesPanel({ heroManager = {}, catalogStatus }) {
  const {
    heroImages = {},
    heroContent = {},
    heroSavingKey = '',
    heroError = '',
    heroMessage = '',
    handleHeroImageSelection,
    updateHeroText,
    editingSlideKey = null,
    setEditingSlideKey = () => {},
    editFormData = {},
    setEditFormData = () => {}
  } = heroManager || {};

  const isFormDisabled = !catalogStatus?.persistenceAvailable || !catalogStatus?.uploadsAvailable;

  function handleOpenEdit(slide) {
    if (editingSlideKey === slide.file) {
      setEditingSlideKey(null);
      return;
    }
    const current = heroContent?.[slide.file] || {};
    setEditFormData({
      title: current.title || slide.title || '',
      eyebrow: current.eyebrow || slide.eyebrow || '',
      description: current.description || slide.description || '',
      specs: current.specs || slide.specs || '',
      actionText: current.actionText || slide.actionText || '',
      hideTextBox: Boolean(current.hideTextBox)
    });
    setEditingSlideKey(slide.file);
  }

  function handleResetDefault(slide) {
    setEditFormData({
      title: slide.title || '',
      eyebrow: slide.eyebrow || '',
      description: slide.description || '',
      specs: slide.specs || '',
      actionText: slide.actionText || '',
      hideTextBox: false
    });
  }

  async function handleSaveSlide(slideKey) {
    if (typeof updateHeroText !== 'function') return;
    const result = await updateHeroText(slideKey, editFormData);
    if (result?.success) {
      setEditingSlideKey(null);
    }
  }

  return (
    <section className="rounded-2xl border border-brand-sand bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3 border-b border-brand-sand/60 pb-5">
        <ImageIcon className="mt-1 h-5 w-5 shrink-0 text-brand-gold" />
        <div>
          <h2 className="font-display text-lg font-bold text-brand-charcoal">Homepage Hero Showcase & Content</h2>
          <p className="mt-1 text-xs leading-5 text-brand-muted">
            Replace slideshow background images and customize headline text, eyebrow tags, architectural specifications, and call-to-action buttons directly from here.
          </p>
        </div>
      </div>

      {(!catalogStatus?.persistenceAvailable || !catalogStatus?.uploadsAvailable) && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          Hero image uploads and persistent text customization require a connected MongoDB database and configured Cloudinary storage.
        </div>
      )}
      {heroError && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{heroError}</div>}
      {heroMessage && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{heroMessage}</div>}

      <div className="grid gap-6 sm:grid-cols-2">
        {MATERIAL_HERO_SLIDES.map((slide, index) => {
          const isSaving = heroSavingKey === slide.file;
          const imageSrc = heroImages[slide.file] || (slide.file.includes('.') ? `/assets/decorforall/${slide.file}` : `/assets/decorforall/${slide.file}.webp`);
          const custom = heroContent?.[slide.file] || {};
          const currentTitle = custom.title || slide.title;
          const currentEyebrow = custom.eyebrow || slide.eyebrow;
          const isEditing = editingSlideKey === slide.file;
          const hasCustomText = Boolean(custom.title || custom.eyebrow || custom.description || custom.specs || custom.actionText);

          return (
            <article key={slide.file} className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs transition hover:border-stone-300">
              {/* Image Preview & Slide Badge */}
              <div className="relative aspect-[16/9] bg-stone-100">
                <img src={imageSrc} alt={`Slide ${index + 1}: ${currentTitle}`} className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 flex items-center gap-1.5">
                  <span className="rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
                    Slide {index + 1} of {MATERIAL_HERO_SLIDES.length}
                  </span>
                  {custom.hideTextBox && (
                    <span className="rounded-full bg-rose-600/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                      Text Box Hidden
                    </span>
                  )}
                  {hasCustomText && !custom.hideTextBox && (
                    <span className="rounded-full bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                      Custom Text
                    </span>
                  )}
                </div>
              </div>

              {/* Slide Summary & Action Buttons */}
              <div className="p-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-brand-charcoal">{currentTitle}</h3>
                  <p className="mt-0.5 truncate text-[11px] text-brand-muted">{currentEyebrow}</p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                  {/* Replace Image Button */}
                  <label className={`inline-flex min-h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-bold transition ${
                    isSaving || isFormDisabled
                      ? 'cursor-not-allowed bg-stone-100 text-stone-400'
                      : 'bg-brand-charcoal text-white hover:bg-stone-800'
                  }`}>
                    <Upload size={13} />
                    <span>{isSaving ? 'Uploading…' : 'Replace Image'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      disabled={isSaving || isFormDisabled}
                      onChange={event => handleHeroImageSelection && handleHeroImageSelection(slide, event)}
                    />
                  </label>

                  {/* Edit Slide Text Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(slide)}
                    disabled={isSaving}
                    className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition ${
                      isEditing
                        ? 'border-brand-gold bg-amber-50 text-amber-900'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Edit3 size={13} />
                    <span>{isEditing ? 'Close' : 'Edit Text'}</span>
                  </button>
                </div>
              </div>

              {/* Inline Text Content Editor Drawer */}
              {isEditing && (
                <div className="border-t border-stone-200 bg-stone-50/70 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-stone-200/70">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                      Edit Slide {index + 1} Content
                    </span>
                    <button
                      type="button"
                      onClick={() => handleResetDefault(slide)}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-500 hover:text-stone-800"
                      title="Reset fields to factory defaults"
                    >
                      <RotateCcw size={11} />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Hide Text Overlay Box Toggle */}
                  <div className="flex items-center justify-between rounded-xl border border-amber-300/60 bg-amber-50/70 p-3 shadow-xs">
                    <div className="pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          Hide Text Box on Slide
                        </span>
                        {editFormData.hideTextBox && (
                          <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-stone-600 leading-normal">
                        Turn this ON if your uploaded image already has built-in text or banner typography (e.g. PU Stone / Flexible Stone posters).
                      </p>
                    </div>
                    <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={Boolean(editFormData.hideTextBox)}
                        disabled={isSaving || isFormDisabled}
                        onChange={e => setEditFormData({ ...editFormData, hideTextBox: e.target.checked })}
                        className="h-4 w-4 rounded border-stone-300 text-brand-gold focus:ring-brand-gold disabled:opacity-50"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Eyebrow / Tag
                    </label>
                    <input
                      type="text"
                      value={editFormData.eyebrow || ''}
                      onChange={e => setEditFormData({ ...editFormData, eyebrow: e.target.value })}
                      disabled={isSaving || isFormDisabled}
                      className="w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-stone-900 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:bg-stone-100"
                      placeholder="e.g. Flexible Stone Veneer · Architectural Travertine"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Headline / Title
                    </label>
                    <input
                      type="text"
                      value={editFormData.title || ''}
                      onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                      disabled={isSaving || isFormDisabled}
                      className="w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-stone-900 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:bg-stone-100"
                      placeholder="e.g. Natural look. Limitless possibilities."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={editFormData.description || ''}
                      onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                      disabled={isSaving || isFormDisabled}
                      className="w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-stone-900 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:bg-stone-100"
                      placeholder="Detailed architectural description..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Architectural Specifications Bar
                    </label>
                    <input
                      type="text"
                      value={editFormData.specs || ''}
                      onChange={e => setEditFormData({ ...editFormData, specs: e.target.value })}
                      disabled={isSaving || isFormDisabled}
                      className="w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-stone-900 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:bg-stone-100"
                      placeholder="e.g. Bendable Travertine • Waterproof • Lightweight 3mm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Action Button Text (CTA)
                    </label>
                    <input
                      type="text"
                      value={editFormData.actionText || ''}
                      onChange={e => setEditFormData({ ...editFormData, actionText: e.target.value })}
                      disabled={isSaving || isFormDisabled}
                      className="w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-stone-900 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:bg-stone-100"
                      placeholder="e.g. Explore Flexible Stone"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingSlideKey(null)}
                      className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isSaving || isFormDisabled}
                      onClick={() => handleSaveSlide(slide.file)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <Check size={13} />
                      <span>{isSaving ? 'Saving…' : 'Save Content'}</span>
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
      <p className="mt-5 text-[11px] text-brand-muted">Images: JPG, PNG or WebP · Maximum 8 MB per image</p>
    </section>
  );
}
