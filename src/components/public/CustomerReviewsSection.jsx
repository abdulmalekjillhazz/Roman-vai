import React, { useEffect, useState } from 'react';
import { Star, MessageSquarePlus, Quote } from 'lucide-react';
import ReviewFormModal from './ReviewFormModal.jsx';

export default function CustomerReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPublishedReviews = () => {
    fetch('/api/reviews')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setReviews(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setReviews([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPublishedReviews();
  }, []);

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-brand-cream/60 border-t border-brand-sand/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-gold font-bold">
              Verified Client Experiences
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-charcoal mt-2 tracking-tight">
              Trade Partner & Client Reviews
            </h2>
            <p className="font-sans text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed">
              Authentic feedback from interior designers, fit-out contractors, and villa owners across Dubai and the UAE.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-charcoal text-white text-xs font-bold font-sans uppercase tracking-wider hover:bg-stone-800 transition shadow-sm"
            >
              <MessageSquarePlus className="w-4 h-4 text-brand-gold" />
              <span>Share Your Review</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-sans text-brand-muted">
            Loading verified reviews...
          </div>
        ) : reviews.length === 0 ? (
          /* Honest Empty State: Zero fake stars, zero fake reviews */
          <div className="bg-white rounded-3xl border border-brand-sand p-10 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
            <h3 className="font-display text-xl font-bold text-brand-charcoal">
              Be the first to share your experience
            </h3>
            <p className="font-sans text-xs text-stone-600 mt-2 leading-relaxed">
              We uphold strict review integrity and never publish placeholder or fabricated ratings. If you have partnered with Classical Decor ID on a residential or commercial project, we welcome your genuine feedback.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-goldHover text-brand-charcoal text-xs font-bold font-sans tracking-wide transition shadow-sm"
              >
                Write the First Review
              </button>
            </div>
          </div>
        ) : (
          /* Real Reviews Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => {
              const id = rev._id;
              const dateStr = new Date(rev.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
              });

              return (
                <div
                  key={id}
                  className="bg-white rounded-3xl border border-brand-sand/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-stone-400">{dateStr}</span>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                      &quot;{rev.feedback}&quot;
                    </p>

                    {rev.images && rev.images.length > 0 && (
                      <div className="flex items-center gap-2 mt-4 overflow-x-auto py-1">
                        {rev.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt=""
                            className="w-12 h-12 object-cover rounded-xl border border-stone-100"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <span className="font-display text-xs font-bold text-brand-charcoal block">
                      {rev.customerName}
                    </span>
                    {(rev.serviceId?.title || rev.projectId?.title) && (
                      <span className="text-[10px] text-brand-muted block mt-0.5">
                        {rev.serviceId?.title || rev.projectId?.title}
                      </span>
                    )}

                    {rev.adminResponse && (
                      <div className="mt-3 p-3 bg-brand-cream/40 rounded-xl text-[11px] border border-brand-sand/50">
                        <span className="font-bold text-brand-charcoal block text-[10px] uppercase tracking-wider mb-0.5">
                          Owner Response:
                        </span>
                        <p className="text-stone-600 italic">{rev.adminResponse}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitted={() => {
          fetchPublishedReviews();
        }}
      />
    </section>
  );
}
