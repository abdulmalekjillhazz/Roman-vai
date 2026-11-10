import React, { useState } from 'react';
import { Star, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReviewFormModal({ isOpen, onClose, onSubmitted }) {
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!customerName.trim()) {
      setError('Your name is required.');
      return;
    }
    if (!feedback.trim() || feedback.trim().length < 10) {
      setError('Please provide feedback of at least 10 characters.');
      return;
    }
    if (!privacyConsent) {
      setError('Please agree to the privacy consent to share your review.');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('customerName', customerName.trim());
      fd.append('rating', String(rating));
      fd.append('feedback', feedback.trim());
      fd.append('privacyConsent', 'true');

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          fd.append('images', files[i]);
        }
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: fd
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit review.');
      }

      setSuccess(data.message || 'Thank you! Your review has been submitted for moderation.');
      setCustomerName('');
      setFeedback('');
      setPrivacyConsent(false);
      setFiles([]);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-brand-cream p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-200 text-stone-600 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-gold font-bold">
          Verified Client Feedback
        </span>
        <h2 className="font-display text-2xl font-bold text-brand-charcoal mt-1">
          Share Your Experience
        </h2>
        <p className="font-sans text-xs text-stone-600 mt-1 leading-relaxed">
          Your feedback helps architectural colleagues and trade partners make informed material specifications.
        </p>

        {success ? (
          <div className="mt-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-emerald-900">Submission Received</h3>
            <p className="text-xs text-emerald-800 mt-1 font-sans leading-relaxed">{success}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 px-6 py-2.5 bg-brand-charcoal text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-800"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 font-sans">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">Your Rating *</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-hidden"
                  >
                    <Star
                      className={`w-6 h-6 transition ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-mono font-bold text-stone-600">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">Your Name / Title *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Ahmed Al-Mansoori, Interior Architect"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-sand bg-white focus:outline-hidden focus:border-brand-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">Feedback & Experience *</label>
              <textarea
                rows={4}
                required
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Describe material performance, delivery punctuality, sample quality, and trade service..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-sand bg-white focus:outline-hidden focus:border-brand-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">Installation Photos (Optional, up to 5)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={e => setFiles(e.target.files)}
                className="block w-full text-xs text-brand-muted file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-white file:text-brand-charcoal"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={privacyConsent}
                  onChange={e => setPrivacyConsent(e.target.checked)}
                  className="mt-0.5 rounded border-brand-sand text-brand-charcoal focus:ring-brand-gold"
                />
                <span className="text-xs text-stone-700 leading-relaxed">
                  I agree my name and feedback may be published publicly.
                </span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-brand-charcoal text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 disabled:opacity-50 transition shadow-sm"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
