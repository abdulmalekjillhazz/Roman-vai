'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, RotateCcw, ArrowLeft, MessageCircle, ShieldAlert } from 'lucide-react';
import { HouseMonogram } from '../src/components/public/BrandLogo.jsx';
import { CLIENT_INFO } from '../src/config/clientInfo.js';

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    if (error) {
      console.error('Route error boundary caught:', error);
    }
  }, [error]);

  return (
    <div
      role="alert"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#FAF6EE] px-4 py-16 text-stone-900"
    >
      {/* Subtle Architectural Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #1c1917 1px, transparent 1px), linear-gradient(to bottom, #1c1917 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-stone-200/90 bg-white/95 p-8 text-center shadow-[0_24px_60px_-15px_rgba(28,25,23,0.12)] backdrop-blur-md sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E5A924]/40 bg-stone-950 shadow-md">
          <HouseMonogram className="h-9 w-9" color="#E5A924" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-800/5 px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-900">
          <ShieldAlert className="h-3.5 w-3.5 text-[#E5A924]" />
          <span>Temporary Interruption</span>
        </div>

        <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          We couldn&apos;t load this view.
        </h1>

        <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-stone-600">
          A temporary connection or rendering issue interrupted the page. Try recovering the view or reloading the browser.
        </p>

        {/* Primary Recovery Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset?.()}
            className="btn-luxury-gold inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-950 shadow-md transition active:scale-95 sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-stone-800 active:scale-95 sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 text-[#E5A924]" />
            <span>Reload Page</span>
          </button>
        </div>

        {/* Secondary Navigation & Concierge Support */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-stone-100 pt-6 text-xs font-semibold">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-700 transition hover:text-stone-950"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return Home</span>
          </Link>

          <span aria-hidden="true" className="text-stone-300">•</span>

          <a
            href={`https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Classical Decor ID, I need assistance accessing a page on your website.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-700 transition hover:text-emerald-800"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp Trade Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
}
