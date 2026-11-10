import React from 'react';
import { ChevronUp, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';

export default function FAQPanel({ faqManager, onEditFaq }) {
  const {
    faqs,
    selectedFaqId,
    faqForm,
    faqError,
    faqMsg,
    resetFaqForm,
    deleteFAQ,
    submitFAQ,
    handleFaqFieldChange,
    moveFAQ
  } = faqManager;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      {/* FAQ List Panel */}
      <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-display text-xl font-bold text-brand-charcoal">Frequently Asked Questions</h2>
            <p className="text-xs text-brand-muted">Manage client FAQs displayed on the homepage.</p>
          </div>
          {selectedFaqId && (
            <button
              type="button"
              onClick={resetFaqForm}
              className="text-xs font-bold text-brand-charcoal hover:underline"
            >
              Clear Selection
            </button>
          )}
        </div>

        {faqs.length === 0 ? (
          <div className="text-xs text-brand-muted py-6">No FAQs configured yet. Add your first question below.</div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const id = faq._id || faq.id;
              const isSelected = selectedFaqId === id;
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
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-mono font-bold text-stone-700">
                          #{faq.order ?? index + 1}
                        </span>
                        {faq.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            <CheckCircle2 size={11} /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-500">
                            <XCircle size={11} /> Hidden
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-sm font-bold text-brand-charcoal">
                        {faq.question}
                      </h3>
                      <p className="mt-1 text-xs text-brand-muted line-clamp-2 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveFAQ(index, 'up')}
                          aria-label="Move question up"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-50 transition active:scale-95"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          disabled={index === faqs.length - 1}
                          onClick={() => moveFAQ(index, 'down')}
                          aria-label="Move question down"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-50 transition active:scale-95"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => (onEditFaq ? onEditFaq(faq) : faqManager.editFAQ(faq))}
                          className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-200 transition active:scale-95"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFAQ(id)}
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200 transition active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAQ Form Panel */}
      <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-brand-charcoal">
          {selectedFaqId ? 'Edit Question' : 'Add Question'}
        </h2>
        <p className="text-xs text-brand-muted mt-1">
          {selectedFaqId
            ? 'Update the selected question and answer.'
            : 'Add a new question with an answer-first direct statement.'}
        </p>

        {faqError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {faqError}
          </div>
        )}
        {faqMsg && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            {faqMsg}
          </div>
        )}

        <form onSubmit={submitFAQ} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
              Question
            </label>
            <input
              type="text"
              value={faqForm.question}
              onChange={e => handleFaqFieldChange('question', e.target.value)}
              placeholder="e.g. What are your delivery timelines across Dubai?"
              className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
              Answer (Answer-First GEO Format)
            </label>
            <textarea
              rows="5"
              value={faqForm.answer}
              onChange={e => handleFaqFieldChange('answer', e.target.value)}
              placeholder="Provide a direct concise answer in the first sentence, followed by technical details..."
              className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input"
            />
            <p className="mt-1 text-[10px] text-stone-500">
              💡 Tip for AI Crawlers: Write the direct fact in line 1 so Perplexity/ChatGPT can quote it easily.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                Display Order
              </label>
              <input
                type="number"
                value={faqForm.order}
                onChange={e => handleFaqFieldChange('order', e.target.value)}
                className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold floating-input"
              />
            </div>

            <div className="pt-5">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={faqForm.isActive}
                  onChange={e => handleFaqFieldChange('isActive', e.target.checked)}
                  className="rounded border-stone-300 text-brand-charcoal focus:ring-brand-gold w-4 h-4"
                />
                <span className="text-xs font-semibold text-brand-charcoal">Published on website</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetFaqForm}
              className="rounded-xl border border-brand-sand bg-white px-4 py-2.5 text-xs font-bold text-brand-charcoal hover:bg-stone-50"
            >
              Clear
            </button>
            <button
              type="submit"
              className="rounded-xl bg-brand-charcoal px-5 py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition"
            >
              {selectedFaqId ? 'Update Question' : 'Save Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
