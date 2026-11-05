import React, { useEffect, useState } from 'react';
import { submitLeadToGoogleSheets } from '../../services/leadService.js';

const getEmptyFormState = (category = '') => ({
  name: '',
  phone: '',
  email: '',
  category: category || 'General Inquiry',
  projectType: 'Residential',
  projectArea: '',
  message: ''
});

export default function LeadFormModal({ isOpen, onClose, initialCategory = '' }) {
  const [formData, setFormData] = useState(getEmptyFormState(initialCategory));
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  useEffect(() => {
    if (!isOpen) return;
    setFormData(getEmptyFormState(initialCategory));
    setStatus({ loading: false, error: null, success: null });
  }, [isOpen, initialCategory]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    try {
      const summaryMessage = [
        formData.projectType ? `Project Type: ${formData.projectType}` : '',
        formData.projectArea ? `Project Size: ${formData.projectArea}` : '',
        formData.message ? formData.message.trim() : ''
      ].filter(Boolean).join(' | ');

      const res = await submitLeadToGoogleSheets({
        ...formData,
        category: initialCategory || formData.category,
        message: summaryMessage
      });

      setStatus({ loading: false, error: null, success: res.message });
      setFormData(getEmptyFormState(initialCategory));
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: null });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-brand-sand bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-lg font-bold text-stone-400 transition hover:bg-stone-200 hover:text-brand-charcoal"
          aria-label="Close quote form"
        >
          ✕
        </button>

        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
          Dubai Trade Supply Portal
        </span>
        <h3 className="mt-1 font-display text-xl font-bold text-brand-charcoal sm:text-2xl">
          Request free samples & trade pricing
        </h3>
        <p className="mt-1.5 text-xs text-brand-muted font-sans">
          Selected Material: <span className="font-mono font-semibold text-brand-charcoal">{initialCategory || 'Catalog Inquiry'}</span>
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-sans text-stone-600">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700">Fast UAE response</span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-amber-700">Trade pricing</span>
          <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-1">Free samples</span>
        </div>

        {status.success ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-xs font-sans text-emerald-900">
            <p className="text-sm font-bold">✅ Inquiry sent successfully!</p>
            <p className="mt-1 leading-relaxed text-emerald-800">{status.success}</p>
            <p className="mt-2 text-[11px] text-emerald-700">Our Dubai sales team will contact you shortly with samples, pricing, and product recommendations.</p>
            <button
              onClick={onClose}
              className="mt-4 w-full rounded-xl bg-brand-charcoal py-2.5 text-xs font-bold tracking-wide text-white transition hover:bg-stone-800"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 font-sans">
            {status.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {status.error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tariq Al Mansoori"
                className="floating-input w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+971 50 123 4567"
                className="floating-input w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="project@company.com"
                className="floating-input w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none"
              />
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                  className="floating-input w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none"
                >
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Hospitality</option>
                  <option>Developer / Contractor</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                  Approx. Area
                </label>
                <input
                  type="text"
                  value={formData.projectArea}
                  onChange={e => setFormData({ ...formData, projectArea: e.target.value })}
                  placeholder="350 sqm"
                  className="floating-input w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                Project Requirements / Notes
              </label>
              <textarea
                rows="3"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Villa interior in Dubai Hills, porcelain look wall panels, approx 350 sqm..."
                className="floating-input w-full resize-none rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="mt-2 w-full rounded-xl bg-brand-gold px-4 py-3 text-xs font-bold tracking-wide text-brand-charcoal shadow-sm transition hover:bg-brand-goldHover disabled:opacity-50"
            >
              {status.loading ? 'Submitting to sales team...' : 'Submit sample request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
