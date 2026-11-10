'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '../../src/App.jsx';
import { getWhatsAppInquiryLink } from '../../src/utils/whatsappHelper.js';
import { ArrowRight, MapPin, MessageCircle, Sparkles } from 'lucide-react';

export default function ProjectsClient({ projects = [] }) {
  const waLinkGeneral = getWhatsAppInquiryLink({ category: 'Architectural Portfolio & Project Case Studies' });

  return (
    <AppShell>
      {(onOpenQuote) => (
        <div className="bg-brand-cream min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="max-w-3xl mb-12">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-gold font-bold">
                Proven Craftsmanship & Supply
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-charcoal mt-2 tracking-tight">
                Architectural Portfolio & Projects
              </h1>
              <p className="font-sans text-stone-600 text-sm sm:text-base mt-4 leading-relaxed">
                Explore verified case studies, luxury residential installations, and commercial surface supply executions across Dubai and the UAE.
              </p>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white rounded-3xl border border-brand-sand p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
                <h2 className="font-display text-2xl font-bold text-brand-charcoal">
                  Our completed projects will be showcased here soon.
                </h2>
                <p className="font-sans text-sm text-brand-muted mt-2">
                  We are documenting verified project case studies with our client partners. To view physical sample boards or request project references, speak directly with our trade team.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={waLinkGeneral}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl text-xs font-bold font-sans uppercase tracking-wider hover:opacity-90 transition shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Request Project References
                  </a>
                  <button
                    type="button"
                    onClick={() => onOpenQuote('Architectural Portfolio Inquiry')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-charcoal text-white rounded-xl text-xs font-bold font-sans uppercase tracking-wider hover:bg-stone-800 transition shadow-sm"
                  >
                    Request Catalog
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map(project => {
                  const coverImage = project.coverImage || project.gallery?.[0] || '/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp';
                  const waLink = getWhatsAppInquiryLink({ category: `Project: ${project.title}` });

                  return (
                    <div
                      key={project._id || project.slug}
                      className="bg-white rounded-3xl border border-brand-sand/80 overflow-hidden shadow-sm flex flex-col hover:border-brand-gold transition duration-300"
                    >
                      <div className="relative h-64 bg-stone-100 overflow-hidden">
                        <img
                          src={coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition duration-500 hover:scale-105"
                        />
                        {project.isFeatured && (
                          <div className="absolute top-4 left-4 bg-brand-gold text-brand-charcoal px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Featured
                          </div>
                        )}
                        {project.category && (
                          <div className="absolute top-4 right-4 bg-brand-charcoal/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full text-[10px] font-mono">
                            {project.category}
                          </div>
                        )}
                      </div>

                      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                        <div>
                          {project.locationArea && (
                            <div className="flex items-center gap-1 text-[11px] font-sans text-brand-muted mb-2">
                              <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                              <span>{project.locationArea}</span>
                            </div>
                          )}
                          <h3 className="font-display text-lg font-bold text-brand-charcoal">
                            {project.title}
                          </h3>
                          <p className="font-sans text-xs text-brand-muted mt-2 leading-relaxed line-clamp-3">
                            {project.description}
                          </p>

                          {project.materialsSupplied && project.materialsSupplied.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {project.materialsSupplied.slice(0, 3).map((mat, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-mono">
                                  {mat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col gap-2">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="inline-flex items-center justify-between px-4 py-2.5 bg-stone-50 hover:bg-stone-100 text-brand-charcoal text-xs font-bold font-sans rounded-xl transition"
                          >
                            <span>Explore Case Study</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#25D366] text-white rounded-xl text-[11px] font-bold font-sans hover:opacity-90 transition text-center"
                          >
                            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Inquire on WhatsApp</span>
                          </a>
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
