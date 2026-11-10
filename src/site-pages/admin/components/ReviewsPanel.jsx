import React, { useState } from 'react';
import { Star, CheckCircle, Eye, EyeOff, Archive, Trash2, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800 border-amber-300',
  verified: 'bg-blue-100 text-blue-800 border-blue-300',
  published: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  rejected: 'bg-rose-100 text-rose-800 border-rose-300',
  archived: 'bg-stone-200 text-stone-700 border-stone-300'
};

export default function ReviewsPanel({ reviewManager }) {
  const {
    reviews,
    statusFilter,
    setStatusFilter,
    loading,
    msg,
    error,
    updateStatus,
    deleteReview
  } = reviewManager;

  const [expandedId, setExpandedId] = useState(null);
  const [responseInputs, setResponseInputs] = useState({});
  const [notesInputs, setNotesInputs] = useState({});

  const toggleExpand = (rev) => {
    const id = rev._id;
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setResponseInputs(prev => ({ ...prev, [id]: rev.adminResponse || '' }));
      setNotesInputs(prev => ({ ...prev, [id]: rev.moderationNotes || '' }));
    }
  };

  const handleSaveResponse = (id, currentStatus) => {
    updateStatus(id, currentStatus, responseInputs[id], notesInputs[id]);
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-sand p-6 sm:p-8 shadow-sm max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h2 className="font-display text-xl font-bold text-brand-charcoal">Customer Reviews & Moderation</h2>
          <p className="text-xs text-brand-muted mt-1">
            Review, verify, and moderate genuine client feedback. Unverified or self-serving reviews are never published automatically.
          </p>
        </div>
      </div>

      {msg && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {['all', 'pending', 'verified', 'published', 'rejected', 'archived'].map(st => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
              statusFilter === st
                ? 'bg-brand-charcoal text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Reviews Inbox */}
      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-stone-200 rounded-2xl text-xs text-brand-muted">
            {statusFilter === 'all'
              ? 'No reviews submitted yet. The public section is displaying the honest empty state.'
              : `No reviews currently in "${statusFilter}" status.`}
          </div>
        ) : (
          reviews.map(rev => {
            const id = rev._id;
            const isExpanded = expandedId === id;
            const dateStr = new Date(rev.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div
                key={id}
                className="border border-brand-sand rounded-2xl p-5 bg-brand-cream/20 hover:bg-white transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-sm font-bold text-brand-charcoal">
                        {rev.customerName}
                      </span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${STATUS_COLORS[rev.status] || ''}`}>
                        {rev.status}
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">{dateStr}</span>
                    </div>

                    {(rev.serviceId?.title || rev.projectId?.title) && (
                      <div className="mt-1 text-[11px] text-stone-500 font-sans">
                        Reference:{' '}
                        <span className="font-semibold text-brand-charcoal">
                          {rev.serviceId?.title || rev.projectId?.title}
                        </span>
                      </div>
                    )}

                    <p className="font-sans text-xs sm:text-sm text-stone-700 mt-2 leading-relaxed whitespace-pre-line">
                      &quot;{rev.feedback}&quot;
                    </p>

                    {rev.images && rev.images.length > 0 && (
                      <div className="flex items-center gap-2 mt-3 overflow-x-auto py-1">
                        {rev.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt=""
                            className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                          />
                        ))}
                      </div>
                    )}

                    {rev.adminResponse && !isExpanded && (
                      <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                        <span className="font-bold text-brand-charcoal block mb-0.5">Owner Response:</span>
                        <p className="text-stone-600">{rev.adminResponse}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand(rev)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                    >
                      {isExpanded ? 'Collapse' : 'Manage & Respond'}
                    </button>
                  </div>
                </div>

                {/* Expanded Moderation Panel */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-stone-200 space-y-4">
                    {/* Status Action Row */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
                        Transition Status:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => updateStatus(id, 'verified')}
                          className="px-3 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold hover:bg-blue-100"
                        >
                          Verify Client
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(id, 'published')}
                          className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
                        >
                          Publish to Website
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(id, 'rejected')}
                          className="px-3 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(id, 'archived')}
                          className="px-3 py-1 rounded-lg bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold hover:bg-stone-200"
                        >
                          Archive
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteReview(id)}
                          className="px-3 py-1 rounded-lg bg-white text-rose-600 border border-rose-200 text-xs font-bold hover:bg-rose-50 ml-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Owner Response */}
                    <div>
                      <label className="block text-xs font-bold text-brand-charcoal mb-1">
                        Respond as Business Owner (Published Publicly)
                      </label>
                      <textarea
                        rows={2}
                        value={responseInputs[id] || ''}
                        onChange={e => setResponseInputs({ ...responseInputs, [id]: e.target.value })}
                        placeholder="e.g. Thank you for trusting Classical Decor ID with your villa materials..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                      />
                    </div>

                    {/* Internal Moderation Notes */}
                    <div>
                      <label className="block text-xs font-bold text-brand-charcoal mb-1">
                        Internal Moderation Notes (Private)
                      </label>
                      <input
                        type="text"
                        value={notesInputs[id] || ''}
                        onChange={e => setNotesInputs({ ...notesInputs, [id]: e.target.value })}
                        placeholder="Internal verification notes, invoice number match, etc."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-brand-sand focus:outline-hidden focus:border-brand-charcoal"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSaveResponse(id, rev.status)}
                        className="px-4 py-2 bg-brand-charcoal text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition"
                      >
                        Save Response & Notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
