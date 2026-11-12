'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '../../src/App.jsx';
import SkyFloatingGallerySection from '../../src/components/public/SkyFloatingGallerySection.jsx';
import { getWhatsAppInquiryLink } from '../../src/utils/whatsappHelper.js';
import { ArrowLeft, ArrowRight, ChevronRight, MapPin, MessageCircle, Sparkles } from 'lucide-react';

export default function ProjectsClient({ projects = [] }) {
  const waLinkGeneral = getWhatsAppInquiryLink({ category: 'Architectural Portfolio & Project Case Studies' });

  return (
    <AppShell>
      {(onOpenQuote) => (
        <div className="bg-brand-cream min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb Orientation */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-stone-500">
              <Link href="/" className="hover:text-stone-900 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold text-stone-900">Portfolio &amp; Projects</span>
            </nav>

            {/* Clear Unified Page Header + Next-Step Navigation */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-200/80 mb-8">
              <div className="max-w-2xl">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-800 font-bold">
                  Completed UAE Installations · Portfolio
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-charcoal mt-2 tracking-tight">
                  Architectural Portfolio &amp; Projects
                </h1>
                <p className="font-sans text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
                  Browse completed luxury villa facades, acoustic walls, and commercial surface installations across Dubai and the UAE. Click any project to inspect full specifications.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/#product-catalog"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-800 shadow-2xs transition hover:border-[#E5A924] hover:bg-stone-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Browse Products</span>
                </Link>
                <button
                  type="button"
                  onClick={() => onOpenQuote?.('Architectural Portfolio Inquiry')}
                  className="btn-luxury-gold inline-flex min-h-11 items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 shadow-sm transition active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Request Project Quote</span>
                </button>
              </div>
            </div>

            {/* Unified Portfolio Showcase */}
            <div className="mb-12">
              <SkyFloatingGallerySection onOpenQuote={onOpenQuote} initialProjects={projects} embedded={true} />
            </div>

            {/* Clear Next-Step Footer Banner */}
            <div className="mt-12 rounded-3xl border border-stone-800 bg-stone-950 p-7 sm:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div className="max-w-xl">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#E5A924]">
                  Next Step · Specify For Your Project
                </p>
                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold">
                  Ready to source these finishes for your site?
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Explore our full material catalog or speak directly with our Dubai trade desk for sample boxes and wholesale pricing.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/#product-catalog"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20"
                >
                  <span>View All Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={waLinkGeneral}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-950 transition hover:bg-[#20ba59]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>

            {projects.length > 0 && (
              <div className="mt-14">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-6">
                  Detailed Project Case Studies
                </h2>
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
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
