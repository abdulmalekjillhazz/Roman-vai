import React, { useEffect, useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Sparkles } from 'lucide-react';
import { CLIENT_INFO } from '../../config/clientInfo.js';

const FALLBACK_FAQS = [
  {
    _id: 'fallback-1',
    question: 'What are your delivery timelines across Dubai and the UAE?',
    answer: 'In-stock materials are delivered within 24 to 48 hours across Dubai, Sharjah, and Ajman. Deliveries to Abu Dhabi, Ras Al Khaimah, Fujairah, and Umm Al Quwain are completed within 2 to 3 business days. Urgent same-day site dispatches and coordinated crane offloading for large commercial projects can also be arranged upon request.',
    order: 1,
    isActive: true
  },
  {
    _id: 'fallback-2',
    question: 'Can interior designers and contractors request physical material sample boxes?',
    answer: 'Yes, we provide complimentary VIP architectural sample boxes for registered interior designers, consultants, and contractors. Each box includes genuine cut samples of our SPC flooring, flexible stone veneers, PU rock panels, and WPC fluted louvers alongside full technical specification sheets, delivered to your office or job site within 24 to 48 hours.',
    order: 2,
    isActive: true
  },
  {
    _id: 'fallback-3',
    question: 'What is the Minimum Order Quantity (MOQ) for wholesale trade supply?',
    answer: 'There is zero minimum order quantity on in-stock warehouse inventory—you can purchase from a single box or panel up to full 20ft/40ft container volumes. Tiered wholesale contractor discounts apply automatically for full-pallet and multi-unit villa project volumes.',
    order: 3,
    isActive: true
  },
  {
    _id: 'fallback-4',
    question: 'Are Classical Decor ID materials certified waterproof and fire retardant for UAE codes?',
    answer: 'Yes, our SPC rigid core flooring is 100% waterproof, termite-proof, and rated for high-humidity coastal environments. Our WPC cladding and PU stone panels feature Class B1 fire-retardant certification, non-toxic eco formulations, and full compliance with UAE building interior safety requirements.',
    order: 4,
    isActive: true
  },
  {
    _id: 'fallback-5',
    question: 'Do you supply matching installation trims, profiles, and adhesives?',
    answer: 'Yes, we stock comprehensive collections of color-matched aluminum edge trims, skirting boards, stair nosing, structural bonding silicon, and expansion profiles designed specifically for seamless installation with our surfaces.',
    order: 5,
    isActive: true
  }
];

export default function FAQSection({ onOpenQuote, onFaqsLoaded }) {
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  const [openIndex, setOpenIndex] = useState(0); // First item open by default for rich initial preview

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || '/api'}/faqs`, { signal: controller.signal })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('Failed to fetch FAQs'))))
      .then(data => {
        if (Array.isArray(data)) {
          const activeOnly = data.filter(item => item && item.isActive !== false);
          setFaqs(activeOnly);
          if (onFaqsLoaded) onFaqsLoaded(activeOnly);
        }
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        // Retain domain-rich fallback FAQs silently if network/DB is unavailable
        if (onFaqsLoaded) onFaqsLoaded(FALLBACK_FAQS);
      });

    return () => controller.abort();
  }, [onFaqsLoaded]);

  function toggleFaq(index) {
    setOpenIndex(prev => (prev === index ? -1 : index));
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="border-t border-stone-200/80 bg-[#FAF6EE] py-16 sm:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center sm:text-left mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-800/5 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-900 mb-3">
            <Sparkles className="h-3 w-3 text-[#E5A924]" />
            Trade Desk & Architectural Guidance
          </div>
          <h2
            id="faq-title"
            className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl"
          >
            Frequently asked questions.
          </h2>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-stone-600 leading-relaxed">
            Essential specifications, delivery timelines, fire ratings, and contractor support for our UAE interior and exterior architectural surface collections.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5" role="region" aria-label="Frequently Asked Questions Accordion">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const faqId = `faq-item-${index}`;
            const buttonId = `faq-btn-${index}`;

            return (
              <div
                key={faq._id || faq.id || index}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-[#E5A924]/60 bg-white shadow-sm'
                    : 'border-stone-200/90 bg-white/70 hover:border-stone-300 hover:bg-white'
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={faqId}
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                  >
                    <span className="font-display text-sm sm:text-base font-bold text-stone-900 flex items-center gap-3">
                      <span className="text-[11px] font-mono font-semibold text-brand-bronzeDark shrink-0">
                        0{index + 1}
                      </span>
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-amber-50 text-amber-900 border-amber-200' : ''
                      }`}
                    >
                      <ChevronDown size={15} />
                    </span>
                  </button>
                </h3>

                <div
                  id={faqId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={`px-5 sm:px-6 pb-6 pt-1 border-t border-stone-100 ${
                    isOpen ? 'block animate-fadeIn' : 'hidden'
                  }`}
                >
                  <p className="font-sans text-xs sm:text-sm leading-relaxed text-stone-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trade Consultation Footnote Bar */}
        <div className="mt-10 rounded-2xl border border-stone-200 bg-white/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center shrink-0">
              <HelpCircle size={20} className="text-brand-bronzeDark" />
            </div>
            <div>
              <h4 className="font-display text-xs sm:text-sm font-bold text-stone-900">
                Have a customized project inquiry or material requirement?
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Our Dubai technical desk assists interior architects, designers and contractors with tailored pricing.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            {onOpenQuote && (
              <button
                type="button"
                onClick={() => onOpenQuote('Custom Project Inquiry')}
                className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-stone-800 transition active:scale-95 text-center"
              >
                Request Quotation
              </button>
            )}
            <a
              href={`https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Classical Decor ID, I have an inquiry regarding your architectural materials catalog and delivery specifications.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-xs font-bold text-stone-800 hover:border-[#E5A924] transition active:scale-95"
            >
              <MessageCircle size={14} className="text-emerald-600" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
