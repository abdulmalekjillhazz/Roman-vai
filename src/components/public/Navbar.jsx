import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Sparkles } from 'lucide-react';
import { CLIENT_INFO } from '../../config/clientInfo.js';
import { HouseMonogram } from './BrandLogo.jsx';

export default function Navbar({ onOpenQuote }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if we are on the homepage over the full-screen hero
  const isHome = pathname === '/';
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isTransparent
          ? 'border-b border-white/10 bg-gradient-to-b from-black/85 via-black/40 to-transparent backdrop-blur-[2px] py-2 sm:py-3'
          : 'border-b border-stone-200/80 bg-brand-cream/95 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.08)] py-0'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:h-20 sm:gap-4 sm:px-6 lg:px-8">
        
        {/* Brand Identity / Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5 transition-transform hover:scale-[1.02] sm:gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl p-1 shadow-md transition-all sm:h-10 sm:w-10 ${
              isTransparent
                ? 'border border-[#E5A924]/50 bg-stone-950/80 shadow-black/50'
                : 'border border-amber-500/30 bg-stone-900'
            }`}
          >
            <HouseMonogram className="w-6 h-6 sm:w-7 sm:h-7" color="#E5A924" />
          </div>
          <div className="min-w-0">
            <span
              className={`block truncate font-sans text-[11px] font-extrabold uppercase tracking-[0.14em] transition-colors sm:text-base ${
                isTransparent ? 'text-white drop-shadow-sm' : 'text-stone-950'
              }`}
            >
              <span className="max-[359px]:hidden sm:hidden">CLASSICAL DECOR ID</span>
              <span className="hidden sm:inline">CLASSICAL DECOR ID</span>
            </span>
            <span
              className={`hidden font-sans text-[10px] tracking-wide transition-colors sm:inline sm:text-[11px] ${
                isTransparent ? 'text-stone-300' : 'text-stone-500'
              }`}
            >
              classicaldecorid • Architectural Surfaces
            </span>
          </div>
        </Link>

        {/* Action Controls & Navigation Pills */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Materials Catalog Shortcut */}
          <Link
            href="/#product-catalog"
            className={`inline-flex min-h-10 sm:min-h-11 items-center justify-center rounded-xl px-2.5 py-2 text-[11px] font-semibold backdrop-blur-md transition-all active:scale-95 sm:px-4 sm:text-xs ${
              isTransparent
                ? 'border border-white/25 bg-white/10 text-white shadow-sm hover:border-[#E5A924] hover:bg-white/20'
                : 'border border-stone-200/90 bg-white/90 text-stone-800 shadow-xs hover:border-[#E5A924] hover:bg-stone-50'
            }`}
          >
            Materials
          </Link>

          {/* Contact Scroll Shortcut */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else window.location.href = '/#contact';
            }}
            className={`inline-flex min-h-10 sm:min-h-11 items-center justify-center rounded-xl px-2.5 py-2 text-[11px] font-semibold backdrop-blur-md transition-all active:scale-95 sm:px-4 sm:text-xs ${
              isTransparent
                ? 'border border-white/25 bg-white/10 text-white shadow-sm hover:border-[#E5A924] hover:bg-white/20'
                : 'border border-stone-200/90 bg-stone-100/90 text-stone-800 shadow-xs hover:border-[#E5A924] hover:bg-stone-50'
            }`}
          >
            Contact
          </button>

          {/* Direct VIP Sample Box Quote Request Button */}
          <button
            type="button"
            onClick={() => onOpenQuote?.('VIP Material Sample Box Request')}
            className={`hidden md:inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
              isTransparent
                ? 'btn-luxury-gold text-stone-950 shadow-lg'
                : 'bg-brand-gold text-stone-950 hover:bg-brand-goldHover shadow-sm'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sample Box</span>
          </button>

          {/* Direct Phone Dial */}
          <a
            href={`tel:+${CLIENT_INFO.whatsappNumber.replace(/\D/g, '')}`}
            className={`inline-flex min-h-10 sm:min-h-11 items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-mono font-medium transition active:scale-95 sm:gap-1.5 sm:px-3 sm:text-xs ${
              isTransparent
                ? 'border border-white/20 bg-white/10 text-stone-200 hover:text-[#E5A924] hover:bg-white/20'
                : 'border border-stone-200/90 bg-stone-100/90 text-stone-800 hover:text-amber-700 hover:bg-stone-50'
            }`}
          >
            <Phone className={`h-3.5 w-3.5 ${isTransparent ? 'text-[#E5A924]' : 'text-stone-500'}`} />
            <span className="font-semibold hidden sm:inline">{CLIENT_INFO.phoneDisplay}</span>
            <span className="font-semibold sm:hidden">Call</span>
          </a>
        </div>

      </div>
    </header>
  );
}
