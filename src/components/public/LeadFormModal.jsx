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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Luxury Silk Cream Modal Stage to Make Pure Snow-White Inputs Float Crystal Clear */}
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#FAF8F5] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)] sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimalist Round Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-500 shadow-sm transition hover:bg-stone-200 hover:text-stone-950"
          aria-label="Close quote form"
        >
          ✕
        </button>

        {/* Brand Gold Eyebrow */}
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#E5A924]">
          Dubai Trade Supply Portal
        </span>

        {/* Brand Charcoal Headline */}
        <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#141414] tracking-tight">
          Request free samples & trade pricing
        </h3>

        {/* Selected Material Context */}
        <p className="mt-2 text-xs text-stone-500 font-sans">
          Selected Material:{' '}
          <span className="font-bold text-[#141414]">
            {initialCategory || 'VIP Material Sample Box'}
          </span>
        </p>

        {/* Status Message */}
        {status.success ? (
          <div className="mt-6 rounded-2xl bg-white p-6 text-xs font-sans text-[#141414] shadow-sm">
            <p className="text-sm font-bold text-[#141414]">Inquiry sent successfully</p>
            <p className="mt-1.5 leading-relaxed text-stone-600">{status.success}</p>
            <p className="mt-2 text-[11px] text-stone-500">Our Dubai sales desk will contact you shortly with material samples, specifications, and project quotations.</p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-2xl bg-[#141414] py-3.5 text-xs font-bold tracking-wider uppercase text-white transition hover:bg-stone-800"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 font-sans">
            {status.error && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 font-medium">
                {status.error}
              </div>
            )}

            {/* Input 1: Full Name (Zero Lines, 100% Snow-White Background, Floating 3D Ambient Shadow) */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#141414]">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tariq Al Mansoori"
                className="floating-input w-full rounded-2xl border-none bg-white px-4 py-3.5 text-xs sm:text-sm font-medium text-[#141414] placeholder:text-stone-400 focus:outline-none"
              />
            </div>

            {/* Input 2: Phone / WhatsApp (Zero Lines, 100% Snow-White Background, Floating 3D Ambient Shadow) */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#141414]">
                Phone / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+971 50 123 4567"
                className="floating-input w-full rounded-2xl border-none bg-white px-4 py-3.5 text-xs sm:text-sm font-mono font-medium text-[#141414] placeholder:text-stone-400 focus:outline-none"
              />
            </div>

            {/* Input 3: Email Address (Zero Lines, 100% Snow-White Background, Floating 3D Ambient Shadow) */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#141414]">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="project@company.com"
                className="floating-input w-full rounded-2xl border-none bg-white px-4 py-3.5 text-xs sm:text-sm font-medium text-[#141414] placeholder:text-stone-400 focus:outline-none"
              />
            </div>

            {/* 2-Column Split */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#141414]">
                  Project Type
                </label>
                <div className="relative">
                  <select
                    value={formData.projectType}
                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                    className="floating-input w-full rounded-2xl border-none bg-white px-4 py-3.5 text-xs sm:text-sm font-medium text-[#141414] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option>Residential Villa</option>
                    <option>Commercial Office</option>
                    <option>Hotel & Hospitality</option>
                    <option>Developer / Fit-Out Contractor</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#141414]">
                  Approx. Area
                </label>
                <input
                  type="text"
                  value={formData.projectArea}
                  onChange={e => setFormData({ ...formData, projectArea: e.target.value })}
                  placeholder="e.g. 350 sqm"
                  className="floating-input w-full rounded-2xl border-none bg-white px-4 py-3.5 text-xs sm:text-sm font-medium text-[#141414] placeholder:text-stone-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Input 4: Textarea (Zero Lines, 100% Snow-White Background, Floating 3D Ambient Shadow) */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#141414]">
                Project Requirements / Notes
              </label>
              <textarea
                rows="3"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="e.g. Villa interior in Dubai Hills, looking for travertine look flexible stone and 5mm WPC fluted panels..."
                className="floating-input w-full resize-none rounded-2xl border-none bg-white px-4 py-3.5 text-xs sm:text-sm font-medium text-[#141414] placeholder:text-stone-400 focus:outline-none"
              />
            </div>

            {/* Brand Gold Submit Button */}
            <button
              type="submit"
              disabled={status.loading}
              className="mt-4 w-full rounded-2xl bg-[#E5A924] hover:bg-[#c48b12] py-4 text-xs font-bold uppercase tracking-widest text-[#141414] shadow-[0_10px_25px_-4px_rgba(229,169,36,0.45)] hover:shadow-[0_14px_30px_-4px_rgba(229,169,36,0.65)] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {status.loading ? 'Submitting to Dubai Sales Desk...' : 'Submit Sample Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
