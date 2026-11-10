import React from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle2, AlertCircle, Save, Sparkles } from 'lucide-react';

export default function ServicesPanel({ serviceManager }) {
  const {
    services,
    loading,
    saving,
    selectedServiceId,
    form,
    uploadFiles,
    setUploadFiles,
    msg,
    error,
    resetForm,
    handleFieldChange,
    editService,
    togglePublish,
    deleteService,
    submitService
  } = serviceManager;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Services List */}
      <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-display text-xl font-bold text-brand-charcoal">Architectural Services</h2>
            <p className="text-xs text-brand-muted">Manage company services, specifications, and client offerings.</p>
          </div>
          {selectedServiceId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-brand-charcoal hover:underline"
            >
              + Create New Service
            </button>
          )}
        </div>

        {services.length === 0 ? (
          <div className="text-xs text-brand-muted py-8 text-center border border-dashed border-stone-200 rounded-xl">
            No services registered yet. Create your first service using the form.
          </div>
        ) : (
          <div className="space-y-3">
            {services.map(svc => {
              const id = svc._id || svc.id;
              const isSelected = selectedServiceId === id;
              return (
                <div
                  key={id}
                  className={`rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? 'border-brand-gold bg-amber-50/40 shadow-xs'
                      : 'border-brand-sand bg-brand-cream/30 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="inline-flex items-center rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-mono font-bold text-stone-700">
                          #{svc.order ?? 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePublish(svc)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            svc.isPublished
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {svc.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {svc.isPublished ? 'Published' : 'Draft'}
                        </button>
                        {svc.isFeatured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                            <Sparkles className="w-3 h-3" /> Featured
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-sm font-bold text-brand-charcoal truncate">{svc.title}</h3>
                      <p className="text-xs text-brand-muted line-clamp-2 mt-1">{svc.description}</p>
                      {svc.images && svc.images.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto py-1">
                          {svc.images.slice(0, 4).map((img, i) => (
                            <img key={i} src={img} alt="" className="w-9 h-9 object-cover rounded-lg border border-stone-200" />
                          ))}
                          {svc.images.length > 4 && (
                            <span className="text-[10px] font-mono text-brand-muted">+{svc.images.length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => editService(svc)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-white text-stone-700"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteService(id)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-rose-600"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Service Editor Form */}
      <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-brand-charcoal mb-1">
          {selectedServiceId ? 'Edit Service' : 'Add New Service'}
        </h2>
        <p className="text-xs text-brand-muted mb-5">
          {selectedServiceId ? 'Update service details, offerings, and media.' : 'Create a new client offering. By default it is saved as an unlisted draft.'}
        </p>

        {msg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submitService} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">Service Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Architectural Surface Consultation & Supply"
              className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">Slug (URL Path)</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => handleFieldChange('slug', e.target.value)}
                placeholder="auto-generated from title"
                className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">Display Order</label>
              <input
                type="number"
                min="0"
                value={form.order}
                onChange={e => handleFieldChange('order', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">Description *</label>
            <textarea
              rows={4}
              required
              value={form.description}
              onChange={e => handleFieldChange('description', e.target.value)}
              placeholder="Comprehensive description of the service scope and execution..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">Highlights (one per line)</label>
              <textarea
                rows={3}
                value={form.highlights}
                onChange={e => handleFieldChange('highlights', e.target.value)}
                placeholder="24/48h Sample Delivery&#10;Technical Specification Sheets&#10;Dedicated Trade Specialist"
                className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">Service Areas (one per line)</label>
              <textarea
                rows={3}
                value={form.serviceAreas}
                onChange={e => handleFieldChange('serviceAreas', e.target.value)}
                placeholder="Dubai&#10;Abu Dhabi&#10;Sharjah&#10;Northern Emirates"
                className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">Upload Images (up to 12)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => setUploadFiles(e.target.files)}
              className="block w-full text-xs text-brand-muted file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-brand-charcoal"
            />
            <textarea
              rows={2}
              value={form.imageUrls}
              onChange={e => handleFieldChange('imageUrls', e.target.value)}
              placeholder="Or paste image URLs (one per line)..."
              className="w-full mt-2 px-3 py-1.5 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">SEO Title</label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={e => handleFieldChange('seoTitle', e.target.value)}
                placeholder="Title tag for search engines"
                className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">SEO Description</label>
              <input
                type="text"
                value={form.seoDescription}
                onChange={e => handleFieldChange('seoDescription', e.target.value)}
                placeholder="Meta description (max 160 chars)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={e => handleFieldChange('isPublished', e.target.checked)}
                className="rounded border-brand-sand text-brand-charcoal focus:ring-brand-gold"
              />
              <span className="text-xs font-bold text-brand-charcoal">Publish Publicly</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={e => handleFieldChange('isFeatured', e.target.checked)}
                className="rounded border-brand-sand text-brand-charcoal focus:ring-brand-gold"
              />
              <span className="text-xs font-bold text-brand-charcoal">Featured on Homepage</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            {selectedServiceId ? (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-bold text-brand-muted hover:text-brand-charcoal"
              >
                Cancel Edit
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-charcoal text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 disabled:opacity-50 transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : selectedServiceId ? 'Update Service' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
