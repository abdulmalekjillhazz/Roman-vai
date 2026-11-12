'use client';

import Link from 'next/link';
import { RefreshCw, ArrowLeft, MessageCircle } from 'lucide-react';
import { CLIENT_INFO } from '../../../src/config/clientInfo.js';

export default function ProjectDetailError({ reset }) {
  return (
    <main role="alert" className="flex min-h-[100dvh] items-center justify-center bg-[#FAF6EE] px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-xl sm:p-12">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-amber-800">Case study recovery</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-stone-900 sm:text-4xl">This project view needs a retry.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-600">The case study could not be rendered right now. Please retry, or browse the full portfolio while the connection recovers.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={() => reset()} className="btn-luxury-gold inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-xs font-bold uppercase tracking-wider text-stone-950"><RefreshCw className="h-4 w-4" /> Try again</button><Link href="/projects" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 text-xs font-bold uppercase tracking-wider text-white"><ArrowLeft className="h-4 w-4 text-[#E5A924]" /> View portfolio</Link></div>
        <a href={`https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Classical Decor ID, I need help accessing a project case study.')}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-emerald-700"><MessageCircle className="h-4 w-4" /> WhatsApp Trade Desk</a>
      </div>
    </main>
  );
}
