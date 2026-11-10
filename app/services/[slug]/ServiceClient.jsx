'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '../../../src/App.jsx';
import { getWhatsAppInquiryLink } from '../../../src/utils/whatsappHelper.js';
import { CheckCircle2, MapPin, MessageCircle } from 'lucide-react';

export default function ServiceClient({ service }) {
  const [selectedImg, setSelectedImg] = useState(0);

  if (!service) {
    return (
      <AppShell>
        {() => (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-brand-cream">
            <h2 className="font-display text-2xl font-bold text-brand-charcoal">Service Not Found</h2>
            <p className="font-sans text-sm text-brand-muted mt-2">The requested service is currently unavailable or unlisted.</p>
            <Link href="/services" className="mt-5 px-5 py-2.5 bg-brand-charcoal text-white rounded-xl text-xs font-bold font-sans">
              Return to All Services
            </Link>
          </div>
        )}
      </AppShell>
    );
  }

  const images = service.images && service.images.length > 0
    ? service.images
    : ['/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp'];
  const waLink = getWhatsAppInquiryLink({ category: service.title });

  return (
    <AppShell>
      {(onOpenQuote) => (
        <div className="bg-brand-cream min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-sans text-brand-muted mb-8">
              <Link href="/" className="hover:text-brand-charcoal transition">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-brand-charcoal transition">Services</Link>
              <span>/</span>
              <span className="text-brand-charcoal font-medium truncate">{service.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              {/* Media Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-stone-100 border border-brand-sand/80 shadow-xs">
                  <img
                    src={images[selectedImg] || images[0]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {images.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImg(idx)}
                        className={`w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition ${
                          selectedImg === idx ? 'border-brand-gold scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Highlights */}
                {service.highlights && service.highlights.length > 0 && (
                  <div className="bg-white rounded-3xl border border-brand-sand p-6 sm:p-7 shadow-xs mt-6">
                    <h3 className="font-display text-base font-bold text-brand-charcoal mb-4">
                      Service Scope & Key Highlights
                    </h3>
                    <ul className="space-y-3">
                      {service.highlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs sm:text-sm font-sans text-stone-700">
                          <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Service Info & CTA Box */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-brand-sand p-6 sm:p-8 shadow-xs">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-gold font-bold">
                    Architectural Surface Service
                  </span>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-charcoal mt-1 tracking-tight">
                    {service.title}
                  </h1>

                  <div className="mt-5 prose prose-stone text-xs sm:text-sm font-sans text-stone-600 leading-relaxed whitespace-pre-line">
                    {service.description}
                  </div>

                  {service.serviceAreas && service.serviceAreas.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-stone-100">
                      <span className="text-xs font-bold text-brand-charcoal flex items-center gap-1.5 mb-2">
                        <MapPin className="w-4 h-4 text-brand-gold" />
                        Available Service Regions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {service.serviceAreas.map((area, i) => (
                          <span key={i} className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs font-sans">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col gap-3">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-[#25D366] hover:bg-[#20b859] text-white rounded-2xl text-xs sm:text-sm font-bold font-sans tracking-wide transition shadow-sm text-center"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Inquire on WhatsApp Trade Desk
                    </a>
                    <button
                      type="button"
                      onClick={() => onOpenQuote(service.title)}
                      className="w-full py-3.5 px-4 bg-brand-charcoal hover:bg-stone-800 text-white rounded-2xl text-xs sm:text-sm font-bold font-sans tracking-wide transition shadow-sm text-center"
                    >
                      Request Formal Trade Consultation
                    </button>
                  </div>
                </div>

                {/* FAQs */}
                {service.faqs && service.faqs.length > 0 && (
                  <div className="bg-white rounded-3xl border border-brand-sand p-6 sm:p-7 shadow-xs">
                    <h3 className="font-display text-base font-bold text-brand-charcoal mb-4">
                      Service FAQs
                    </h3>
                    <div className="space-y-4">
                      {service.faqs.map((faq, idx) => (
                        <div key={idx} className="border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                          <h4 className="text-xs font-bold text-brand-charcoal">{faq.question}</h4>
                          <p className="text-xs text-stone-600 mt-1 font-sans leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
