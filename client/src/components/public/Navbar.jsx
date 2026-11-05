import React from 'react';
import { Link } from 'react-router-dom';
import { CLIENT_INFO } from '../../config/clientInfo.js';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0] border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Left */}
        <Link to="/" className="flex items-center gap-3 transition hover:opacity-95 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-stone-900 text-amber-400 font-serif font-bold text-sm sm:text-base flex items-center justify-center border border-amber-500/30 shadow-xs">
            CD
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-extrabold text-[11px] sm:text-base text-stone-950 tracking-wide sm:tracking-wider uppercase">
              CLASSICAL DECOR ID
            </span>
            <span className="hidden font-sans text-[10px] sm:inline sm:text-[11px] text-stone-500">
              classicaldecorid • Architectural Surfaces
            </span>
          </div>
        </Link>

        {/* Action Controls Right - Clean English Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Customer-facing product catalog */}
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-stone-800 bg-white border border-stone-300 hover:border-amber-500 hover:bg-stone-50 px-2.5 sm:px-3 py-2 rounded-lg transition shadow-xs"
          >
            <span>Products</span>
          </Link>

          {/* Phone Contact */}
          <a
            href={`tel:+${CLIENT_INFO.whatsappNumber.replace(/\D/g, '')}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-medium text-stone-800 hover:text-amber-700 px-2.5 py-1.5 rounded-lg transition"
          >
            <span className="text-stone-500">📞</span>
            <span className="font-semibold">{CLIENT_INFO.phoneDisplay}</span>
          </a>

          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Classical Decor ID, I'd like to inquire about your architectural catalog.")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white text-xs font-sans font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg shadow-sm hover:shadow transition"
          >
            <svg
              className="w-4 h-4 fill-current"
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
