import React, { useState } from 'react';
import { submitLeadToGoogleSheets } from '../../services/leadService.js';

export default function LeadFormModal({ isOpen, onClose, initialCategory = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: initialCategory || 'General Inquiry',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    try {
      const res = await submitLeadToGoogleSheets({
        ...formData,
        category: initialCategory || formData.category
      });
      setStatus({ loading: false, error: null, success: res.message });
      setFormData({ name: '', phone: '', email: '', category: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: null });
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-brand-sand">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-brand-charcoal text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 transition"
        >
          ✕
        </button>

        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-gold font-bold">
          Dubai Trade Supply Portal
        </span>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-charcoal mt-1">
          Request Free Samples & Trade Pricing
        </h3>
        <p className="font-sans text-xs text-brand-muted mt-1.5">
          Selected Material: <span className="font-mono font-semibold text-brand-charcoal">{initialCategory || 'Catalog Inquiry'}</span>
        </p>

        {status.success ? (
          <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-sans">
            <p className="font-bold text-sm">✅ Inquiry Sent Successfully!</p>
            <p className="mt-1 text-emerald-800 leading-relaxed">{status.success}</p>
            <p className="mt-2 text-[11px] text-emerald-700">Our Dubai sales team will dispatch your sample swatches shortly.</p>
            <button
              onClick={onClose}
              className="mt-4 w-full py-2.5 bg-brand-charcoal text-white rounded-xl font-bold text-xs font-sans tracking-wide transition hover:bg-stone-800"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 font-sans">
            {status.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                {status.error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tariq Al Mansoori"
                className="w-full bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none floating-input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+971 50 123 4567"
                className="w-full bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none floating-input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="project@company.com"
                className="w-full bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none floating-input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                Project Notes / Approximate Sqm
              </label>
              <textarea
                rows="2"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Villa interior in Dubai Hills, approx 350 sqm..."
                className="w-full bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none floating-input resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="mt-2 w-full py-3 bg-brand-gold hover:bg-brand-goldHover text-brand-charcoal rounded-xl font-bold text-xs tracking-wide transition shadow-sm disabled:opacity-50"
            >
              {status.loading ? 'Submitting to Sales Team...' : 'Submit Sample Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
