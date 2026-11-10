import React from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle2, AlertCircle, Save, Sparkles, ShieldAlert, Image as ImageIcon } from 'lucide-react';

export default function ProjectsPanel({ projectManager }) {
  const {
    projects,
    loading,
    saving,
    selectedProjectId,
    form,
    uploadFiles,
    setUploadFiles,
    msg,
    error,
    resetForm,
    handleFieldChange,
    editProject,
    togglePublish,
    deleteProject,
    submitProject
  } = projectManager;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Projects List */}
      <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-xl font-bold text-brand-charcoal">Portfolio & Projects</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 text-[10px] font-bold">
                <Sparkles className="w-3 h-3 text-[#E5A924]" />
                Live on Homepage Floating Sky & /projects
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-1">
              Add, edit, or feature architectural projects. All published projects instantly float in the Homepage Sky Gallery and appear on the public projects page.
            </p>
          </div>
          {selectedProjectId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-brand-charcoal hover:underline"
            >
              + Create New Project
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-xs text-brand-muted py-8 text-center border border-dashed border-stone-200 rounded-xl">
            No projects registered yet. Showcase your first verified installation using the form.
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map(proj => {
              const id = proj._id || proj.id;
              const isSelected = selectedProjectId === id;
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
                          #{proj.order ?? 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePublish(proj)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            proj.isPublished
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {proj.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {proj.isPublished ? 'Published' : 'Draft'}
                        </button>
                        {proj.hasClientConsent && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold">
                            Consent Verified
                          </span>
                        )}
                        {proj.isFeatured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                            <Sparkles className="w-3 h-3" /> Featured
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-sm font-bold text-brand-charcoal truncate">{proj.title}</h3>
                      <p className="text-xs text-brand-muted line-clamp-2 mt-1">{proj.description}</p>
                      {proj.locationArea && (
                        <p className="text-[11px] font-mono text-stone-500 mt-1">Location: {proj.locationArea}</p>
                      )}
                      {proj.coverImage && (
                        <div className="mt-2">
                          <img src={proj.coverImage} alt="" className="w-14 h-14 object-cover rounded-xl border border-stone-200" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => editProject(proj)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-white text-stone-700"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProject(id)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-rose-600"
                        title="Delete Project"
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

      {/* Project Editor Form */}
      <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-brand-charcoal mb-1">
          {selectedProjectId ? 'Edit Project' : 'Add New Portfolio Project'}
        </h2>
        <p className="text-xs text-brand-muted mb-5">
          {selectedProjectId ? 'Update project gallery and specifications.' : 'Document a completed material installation or commercial supply project.'}
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

        <form onSubmit={submitProject} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Palm Jumeirah Luxury Villa Exterior Cladding"
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
              <label className="block text-xs font-bold text-brand-charcoal mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={e => handleFieldChange('category', e.target.value)}
                placeholder="e.g. Villa Fit-out, Commercial Office, Hotel"
                className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
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
              placeholder="Project background, material applications, architectural challenges solved..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">Anonymized Location Area</label>
              <input
                type="text"
                value={form.locationArea}
                onChange={e => handleFieldChange('locationArea', e.target.value)}
                placeholder="e.g. Dubai Marina, Emirates Hills (never street address)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">Completion Date (Optional)</label>
              <input
                type="date"
                value={form.completionDate}
                onChange={e => handleFieldChange('completionDate', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">Materials Supplied (one per line)</label>
            <textarea
              rows={2}
              value={form.materialsSupplied}
              onChange={e => handleFieldChange('materialsSupplied', e.target.value)}
              placeholder="SPC Rigid Core Flooring - Scandinavian Oak&#10;PU Stone Accent Panels&#10;Flexible Granite Veneer"
              className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">Cover Image URL</label>
            <input
              type="text"
              value={form.coverImage}
              onChange={e => handleFieldChange('coverImage', e.target.value)}
              placeholder="https://res.cloudinary.com/... or leave blank to use first upload"
              className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">Gallery Uploads (up to 12 images)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => setUploadFiles(e.target.files)}
              className="block w-full text-xs text-brand-muted file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-brand-charcoal"
            />
            <textarea
              rows={2}
              value={form.galleryUrls}
              onChange={e => handleFieldChange('galleryUrls', e.target.value)}
              placeholder="Or paste gallery image URLs (one per line)..."
              className="w-full mt-2 px-3 py-1.5 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal font-mono"
            />
          </div>

          {/* Privacy & Consent Warning */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.hasClientConsent}
                onChange={e => handleFieldChange('hasClientConsent', e.target.checked)}
                className="mt-0.5 rounded border-amber-400 text-amber-700 focus:ring-amber-500"
              />
              <div className="text-xs">
                <span className="font-bold text-amber-950 block">Client Consent Verified</span>
                <span className="text-amber-800 mt-0.5 block leading-relaxed">
                  Only check this if the client has given written permission to publish their project details.
                </span>
              </div>
            </label>
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
              <span className="text-xs font-bold text-brand-charcoal">Featured Project</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            {selectedProjectId ? (
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
              {saving ? 'Saving...' : selectedProjectId ? 'Update Project' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
