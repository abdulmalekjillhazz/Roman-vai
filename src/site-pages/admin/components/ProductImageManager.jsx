import React from 'react';

export default function ProductImageManager({ productManager }) {
  const {
    productForm,
    selectedProductId,
    existingImageUrls,
    uploadFiles,
    uploadPreviews,
    handleProductFieldChange,
    selectUploadFiles,
    setAsThumbnail,
    moveExistingImage,
    removeExistingImage,
    moveUpload,
    removeUploadFile
  } = productManager;

  return (
    <>
      <div className="md:col-span-2">
        <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Existing / Remote Image URLs</label>
        <textarea rows="3" value={productForm.imageUrls} onChange={e => handleProductFieldChange('imageUrls', e.target.value)} className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" placeholder="One image URL per line" />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Upload Image Files</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={selectUploadFiles}
          className="w-full rounded-xl border border-dashed border-stone-300 bg-white px-3 py-3 text-xs text-brand-charcoal file:mr-3 file:rounded file:border-0 file:bg-brand-charcoal file:px-3 file:py-2 file:text-xs file:font-bold file:text-white floating-input"
        />
        <p className="mt-2 text-[10px] text-brand-muted">Upload up to 12 images at once; each image can be up to 8 MB.</p>
      </div>

      {(existingImageUrls.length > 0 || uploadFiles.length > 0) && (
        <div className="md:col-span-2">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                  Photos & Finishes Manager ({existingImageUrls.length} Active)
                </span>
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-300">
                  ★ #1 is Final Thumbnail
                </span>
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">
                The 1st photo is the official catalog thumbnail. Click &quot;⭐ Set as Final Thumbnail&quot; on any photo to make it the primary cover, or use ◀ / ▶ to arrange the sequence (1st, 2nd, 3rd...).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
            {existingImageUrls.map((src, index) => {
              const isMainThumb = index === 0;
              return (
                <div
                  key={src}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all p-2.5 bg-white flex flex-col justify-between shadow-xs ${
                    isMainThumb
                      ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-md bg-amber-50/25'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-100">
                    <img src={src} alt={`Finish ${index + 1}`} className="h-full w-full object-cover" />
                    {/* Position Badge */}
                    <span
                      className={`absolute left-1.5 top-1.5 rounded-md px-2 py-0.5 text-[9px] font-mono font-bold shadow-sm ${
                        isMainThumb
                          ? 'bg-amber-500 text-stone-950 font-black ring-1 ring-white/50'
                          : 'bg-black/75 text-white'
                      }`}
                    >
                      {isMainThumb ? '★ #1 Final Thumbnail' : `#${index + 1} Finish Option`}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1.5">
                    {!isMainThumb ? (
                      <button
                        type="button"
                        onClick={() => setAsThumbnail(src)}
                        className="flex w-full items-center justify-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2 py-1.5 text-[10px] font-bold text-amber-900 transition hover:bg-amber-100 active:scale-95"
                      >
                        <span>⭐ Set as Final Thumbnail</span>
                      </button>
                    ) : (
                      <div className="flex w-full items-center justify-center gap-1 rounded-lg border border-amber-500/40 bg-amber-100/70 py-1.5 text-[10px] font-black text-amber-950">
                        <span>✓ Active Catalog Cover</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-stone-100">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveExistingImage(index, -1)}
                          title="Move earlier in sequence"
                          className="rounded border border-stone-200 bg-stone-50 px-2 py-1 text-[10px] font-bold text-stone-700 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-50"
                        >
                          ◀
                        </button>
                        <button
                          type="button"
                          disabled={index === existingImageUrls.length - 1}
                          onClick={() => moveExistingImage(index, 1)}
                          title="Move later in sequence"
                          className="rounded border border-stone-200 bg-stone-50 px-2 py-1 text-[10px] font-bold text-stone-700 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-50"
                        >
                          ▶
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(src)}
                        className="rounded px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {uploadPreviews.map(({ file, url }, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="relative overflow-hidden rounded-2xl border border-dashed border-emerald-500 bg-emerald-50/30 p-2.5 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-100">
                  <img src={url} alt={file.name} className="h-full w-full object-cover" />
                  <span className="absolute left-1.5 top-1.5 rounded-md bg-emerald-700 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                    New Upload #{index + 1}
                  </span>
                </div>
                <p className="mt-1 truncate text-[9px] font-medium text-stone-600">{file.name}</p>
                <div className="mt-2 flex items-center justify-between gap-1 border-t border-emerald-200 pt-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveUpload(index, -1)}
                      className="rounded border border-stone-200 bg-white px-2 py-0.5 text-[9px] font-bold text-stone-700 disabled:opacity-30"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      disabled={index === uploadFiles.length - 1}
                      onClick={() => moveUpload(index, 1)}
                      className="rounded border border-stone-200 bg-white px-2 py-0.5 text-[9px] font-bold text-stone-700 disabled:opacity-30"
                    >
                      ▶
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeUploadFile(file)}
                    className="text-[10px] font-bold text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
          {selectedProductId && (
            <p className="mt-2.5 text-[10px] text-brand-muted">
              ℹ️ Remember to click &quot;Update Product&quot; below to permanently save your final thumbnail and sequence order.
            </p>
          )}
        </div>
      )}
    </>
  );
}
