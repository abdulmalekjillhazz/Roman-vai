import React from 'react';
import Link from 'next/link';
import { CLIENT_INFO } from '../../config/clientInfo.js';

export default function Navbar({ onOpenQuote }) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#FAF7F0]/95 backdrop-blur-md shadow-[0_6px_22px_-3px_rgba(15,23,42,0.09)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:h-20 sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 transition hover:opacity-95 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-stone-900 font-serif text-sm font-bold text-amber-400 shadow-xs sm:h-10 sm:w-10 sm:text-base">
            CD
          </div>
          <div className="min-w-0">
            <span className="block truncate font-sans text-[10px] font-extrabold uppercase tracking-[0.12em] text-stone-950 sm:text-base">
              CLASSICAL DECOR ID
            </span>
            <span className="hidden font-sans text-[10px] text-stone-500 sm:inline sm:text-[11px]">
              classicaldecorid • Architectural Surfaces
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-2.5 py-2 text-[10px] font-sans font-bold text-stone-800 shadow-xs transition hover:border-amber-500 hover:bg-stone-50 sm:px-3"
          >
            Products
          </Link>

          <button
            type="button"
            onClick={() => onOpenQuote?.('General product inquiry')}
            className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-stone-100 px-2.5 py-2 text-[10px] font-sans font-bold text-stone-800 shadow-xs transition hover:border-amber-500 hover:bg-stone-50 sm:px-3"
          >
            Quote
          </button>

          <button
            type="button"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-100 px-2.5 py-2 text-[10px] font-sans font-bold text-stone-800 transition hover:border-amber-500 hover:bg-stone-50 sm:text-xs"
          >
            Contact
          </button>

          <a
            href={`tel:+${CLIENT_INFO.whatsappNumber.replace(/\D/g, '')}`}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono font-medium text-stone-800 transition hover:text-amber-700"
          >
            <span className="text-stone-500">📞</span>
            <span className="font-semibold">{CLIENT_INFO.phoneDisplay}</span>
          </a>

          <a
            href={`https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Classical Decor ID, I'd like to inquire about your architectural catalog.")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="inline-flex items-center justify-center rounded-lg bg-[#25D366] px-2.5 py-2 text-white shadow-sm transition hover:bg-[#20ba59] active:bg-[#1da850] sm:px-3.5 sm:py-2"
          >
            <svg
              className="h-4 w-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.031 0C5.396 0 .029 5.367.029 12.002c0 2.118.553 4.187 1.603 6.007L0 24l6.167-1.618a11.97 11.97 0 005.864 1.518h.005c6.634 0 12.001-5.367 12.001-12.002C24.037 5.368 18.67 0 12.031 0zm0 21.897c-1.8 0-3.565-.484-5.105-1.4l-.366-.217-3.793.995 1.013-3.697-.238-.379a9.92 9.92 0 01-1.521-5.197c0-5.498 4.474-9.972 9.975-9.972 2.664 0 5.168 1.038 7.051 2.922a9.92 9.92 0 012.921 7.052c0 5.499-4.474 9.973-9.975 9.973zm5.467-7.464c-.299-.15-1.771-.874-2.046-.974-.275-.1-.475-.15-.675.15s-.774.974-.95 1.173c-.174.2-.349.225-.648.075-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.494-1.78-1.669-2.079-.175-.3-.019-.462.131-.611.135-.134.299-.349.449-.524.15-.175.2-.3.3-.5.1-.2.05-.374-.025-.524-.075-.15-.675-1.623-.925-2.222-.243-.583-.49-.504-.674-.513-.174-.009-.374-.01-.574-.01s-.524.075-.798.374c-.275.3-1.049 1.024-1.049 2.5 0 1.474 1.074 2.898 1.224 3.098.15.2 2.113 3.227 5.119 4.526.715.309 1.273.494 1.708.632.718.228 1.371.196 1.888.118.577-.087 1.771-.724 2.021-1.423.25-.699.25-1.298.175-1.423-.075-.125-.275-.2-.575-.35z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}
