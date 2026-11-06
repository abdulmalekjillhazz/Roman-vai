import React from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { MATERIAL_HERO_SLIDES } from '../../../config/materialHeroSlides.js';

export default function HeroImagesPanel({ heroManager, catalogStatus }) {
  const {
    heroImages,
    heroSavingKey,
    heroError,
    heroMessage,
    handleHeroImageSelection
  } = heroManager;

  return (
    <section className="rounded-2xl border border-brand-sand bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3 border-b border-brand-sand/60 pb-5">
        <ImageIcon className="mt-1 h-5 w-5 shrink-0 text-brand-gold" />
        <div>
          <h2 className="font-display text-lg font-bold text-brand-charcoal">Homepage Hero Images</h2>
          <p className="mt-1 text-xs leading-5 text-brand-muted">
            Replace any slideshow image without changing its text or removing a slide. Your image is saved online and appears on the homepage.
          </p>
        </div>
      </div>

      {(!catalogStatus?.persistenceAvailable || !catalogStatus?.uploadsAvailable) && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          Hero image uploads require a connected MongoDB database and configured Cloudinary storage.
        </div>
      )}
      {heroError && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{heroError}</div>}
      {heroMessage && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{heroMessage}</div>}

      <div className="grid gap-5 sm:grid-cols-2">
        {MATERIAL_HERO_SLIDES.map((slide, index) => {
          const isSaving = heroSavingKey === slide.file;
          const imageSrc = heroImages[slide.file] || (slide.file.includes('.') ? `/assets/decorforall/${slide.file}` : `/assets/decorforall/${slide.file}.webp`);

          return (
            <article key={slide.file} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
              <div className="relative aspect-[16/9] bg-stone-100">
                <img src={imageSrc} alt={`Slide ${index + 1}: ${slide.title}`} className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white">
                  Slide {index + 1} of {MATERIAL_HERO_SLIDES.length}
                </span>
              </div>
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-brand-charcoal">{slide.title}</h3>
                  <p className="mt-1 truncate text-[11px] text-brand-muted">{slide.eyebrow}</p>
                </div>
                <label className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-xs font-bold transition ${
                  isSaving || !catalogStatus?.persistenceAvailable || !catalogStatus?.uploadsAvailable
                    ? 'cursor-not-allowed bg-stone-100 text-stone-400'
                    : 'bg-brand-charcoal text-white hover:bg-stone-800'
                }`}>
                  <Upload size={14} />
                  {isSaving ? 'Uploading…' : 'Replace image'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    disabled={isSaving || !catalogStatus?.persistenceAvailable || !catalogStatus?.uploadsAvailable}
                    onChange={event => handleHeroImageSelection(slide, event)}
                  />
                </label>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-5 text-[11px] text-brand-muted">JPG, PNG or WebP · Maximum 8 MB per image</p>
    </section>
  );
}
