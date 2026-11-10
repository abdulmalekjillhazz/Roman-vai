'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '../../src/App.jsx';
import { getWhatsAppInquiryLink } from '../../src/utils/whatsappHelper.js';
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';

export default function ServicesClient({ services = [] }) {
  const waLinkGeneral = getWhatsAppInquiryLink({ category: 'Architectural Services' });

  return (
    <AppShell>
      {(onOpenQuote) => (
        <div className="bg-brand-cream min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="max-w-3xl mb-12">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-gold font-bold">
                Commercial & Trade Solutions
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-charcoal mt-2 tracking-tight">
                Specialized Architectural Services
              </h1>
              <p className="font-sans text-stone-600 text-sm sm:text-base mt-4 leading-relaxed">
                From precision trade sample dispatches to full commercial surface consulting across Dubai and the UAE.
              </p>
            </div>

            {services.length === 0 ? (
              <div className="bg-white rounded-3xl border border-brand-sand p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
                <h2 className="font-display text-2xl font-bold text-brand-charcoal">Services coming soon</h2>
                <p className="font-sans text-sm text-brand-muted mt-2">
                  We are updating our service catalog. For direct inquiries, contractor consultations, or urgent project supply, contact our trade desk on WhatsApp.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={waLinkGeneral}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl text-xs font-bold font-sans uppercase tracking-wider hover:opacity-90 transition shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact Us on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => onOpenQuote('General Services Consultation')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-charcoal text-white rounded-xl text-xs font-bold font-sans uppercase tracking-wider hover:bg-stone-800 transition shadow-sm"
                  >
                    Request Consultation
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map(service => {
                  const waLink = getWhatsAppInquiryLink({ category: service.title });
                  const coverImage = service.images?.[0] || '/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp';
                  return (
                    <div
                      key={service._id || service.slug}
                      className="bg-white rounded-3xl border border-brand-sand/80 overflow-hidden shadow-sm flex flex-col hover:border-brand-gold transition duration-300"
                    >
                      <div className="relative h-56 bg-stone-100 overflow-hidden">
                        <img
                          src={coverImage}
                          alt={service.title}
                          className="w-full h-full object-cover transition duration-500 hover:scale-105"
                        />
                        {service.isFeatured && (
                          <div className="absolute top-4 left-4 bg-brand-gold text-brand-charcoal px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            Featured
                          </div>
                        )}
                      </div>

                      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-display text-xl font-bold text-brand-charcoal">
                            {service.title}
                          </h3>
                          <p className="font-sans text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed line-clamp-3">
                            {service.description}
                          </p>

                          {service.highlights && service.highlights.length > 0 && (
                            <ul className="mt-4 space-y-2">
                              {service.highlights.slice(0, 3).map((hl, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-sans text-stone-700">
                                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                                  <span>{hl}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col gap-2">
                          <Link
                            href={`/services/${service.slug}`}
                            className="inline-flex items-center justify-between px-4 py-2.5 bg-stone-50 hover:bg-stone-100 text-brand-charcoal text-xs font-bold font-sans rounded-xl transition"
                          >
                            <span>View Full Specifications</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#25D366] text-white rounded-xl text-[11px] font-bold font-sans hover:opacity-90 transition text-center"
                            >
                              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>WhatsApp</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => onOpenQuote(service.title)}
                              className="py-2 px-3 bg-brand-charcoal text-white rounded-xl text-[11px] font-bold font-sans hover:bg-stone-800 transition text-center"
                            >
                              Inquire
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
        </div>
      )}
    </AppShell>
  );
}
