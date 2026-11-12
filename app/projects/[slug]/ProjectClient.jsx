'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AppShell from '../../../src/App.jsx';
import { getWhatsAppInquiryLink } from '../../../src/utils/whatsappHelper.js';
import { MapPin, Calendar, CheckCircle2, MessageCircle } from 'lucide-react';

export default function ProjectClient({ project }) {
  const [selectedImg, setSelectedImg] = useState(0);

  if (!project) {
    return (
      <AppShell>
        {() => (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-brand-cream">
            <h2 className="font-display text-2xl font-bold text-brand-charcoal">Project Not Found</h2>
            <p className="font-sans text-sm text-brand-muted mt-2">The requested project case study could not be located.</p>
            <Link href="/projects" className="mt-5 px-5 py-2.5 bg-brand-charcoal text-white rounded-xl text-xs font-bold font-sans">
              Return to All Projects
            </Link>
          </div>
        )}
      </AppShell>
    );
  }

  const allImages = [
    project.coverImage,
    ...(Array.isArray(project.gallery) ? project.gallery : [])
  ].filter(Boolean);

  const images = allImages.length > 0
    ? allImages
    : ['/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp'];

  const waLink = getWhatsAppInquiryLink({ category: `Project Case Study: ${project.title}` });
  const formattedDate = project.completionDate
    ? new Date(project.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  return (
    <AppShell>
      {(onOpenQuote) => (
        <div className="bg-brand-cream min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-sans text-brand-muted mb-8">
              <Link href="/" className="hover:text-brand-charcoal transition">Home</Link>
              <span>/</span>
              <Link href="/projects" className="hover:text-brand-charcoal transition">Projects</Link>
              <span>/</span>
              <span className="text-brand-charcoal font-medium truncate">{project.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              {/* Media Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-stone-100 border border-brand-sand/80 shadow-xs">
                  <Image
                    src={images[selectedImg] || images[0]}
                    alt={project.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 62vw"
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
                        <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Materials Supplied */}
                {project.materialsSupplied && project.materialsSupplied.length > 0 && (
                  <div className="bg-white rounded-3xl border border-brand-sand p-6 sm:p-7 shadow-xs mt-6">
                    <h3 className="font-display text-base font-bold text-brand-charcoal mb-4">
                      Materials Supplied for this Project
                    </h3>
                    <ul className="space-y-2.5">
                      {project.materialsSupplied.map((mat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-stone-700">
                          <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Project Info & CTA Box */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-brand-sand p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {project.category && (
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-mono uppercase tracking-wider font-bold">
                        {project.category}
                      </span>
                    )}
                    {formattedDate && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-stone-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {formattedDate}
                      </span>
                    )}
                  </div>

                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-charcoal mt-1 tracking-tight">
                    {project.title}
                  </h1>

                  {project.locationArea && (
                    <div className="flex items-center gap-1.5 text-xs font-sans text-brand-muted mt-2">
                      <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                      <span>{project.locationArea}</span>
                    </div>
                  )}

                  <div className="mt-6 prose prose-stone text-xs sm:text-sm font-sans text-stone-600 leading-relaxed whitespace-pre-line border-t border-stone-100 pt-5">
                    {project.description}
                  </div>

                  <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col gap-3">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-[#25D366] hover:bg-[#20b859] text-white rounded-2xl text-xs sm:text-sm font-bold font-sans tracking-wide transition shadow-sm text-center"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Inquire About Similar Project Materials
                    </a>
                    <button
                      type="button"
                      onClick={() => onOpenQuote(`Project Inquiry: ${project.title}`)}
                      className="w-full py-3.5 px-4 bg-brand-charcoal hover:bg-stone-800 text-white rounded-2xl text-xs sm:text-sm font-bold font-sans tracking-wide transition shadow-sm text-center"
                    >
                      Request Consultation for Your Site
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
