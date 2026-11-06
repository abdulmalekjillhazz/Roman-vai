import React from 'react';
import { ExternalLink, Layers, Sparkles, Compass } from 'lucide-react';

export const OFFICIAL_ARCHIVE_LINKS = {
  'spc-flooring': 'https://sites.google.com/view/decorforall/home-page/our-products/flooring-products/spc-straight',
  'lvt-flooring': 'https://sites.google.com/view/decorforall/home-page/our-products/flooring-products/lvt-flooring',
  'flexible-stone': 'https://sites.google.com/view/decorforall/home-page/our-products/wall-products/flexible-stone',
  'wpc-chipboard-panel-sheet': 'https://sites.google.com/view/decorforall/home-page/our-products/wall-products/5mm-wpc-chipboard-panel',
  'wall-panel': 'https://sites.google.com/view/decorforall/home-page/our-products/wall-products/ps-wall-panel',
  'pu-stone': 'https://sites.google.com/view/decorforall/home-page/our-products/wall-products/big-pu-stone',
  'molding': 'https://sites.google.com/view/decorforall/home-page/our-products/wall-products/ps-molding',
  'columns-partition': 'https://sites.google.com/view/decorforall/home-page/our-products/wall-products/ps-columns',
  'acoustic-panel': 'https://sites.google.com/view/decorforall/home-page/our-products/wall-products/ps-acoustic-panel',
  'pvc-marble-sheet': 'https://sites.google.com/view/decorforall/home-page/our-products/wall-products/glossy-pvc-marble',
  '3d-velvet-fabric-roll': 'https://sites.google.com/view/decorforall/home-page/our-products/wall-products/3d-velvet-fabric-wall-panel',
  '3d-soft-stone-roll': 'https://sites.google.com/view/decorforall/home-page/our-products/wall-products/3d-soft-stone-roll',
  'flexible-3d-sheet': 'https://sites.google.com/view/decorforall/home-page/our-products/woodworking-products/3d-sheet',
  'aluminium-profiles': 'https://sites.google.com/view/decorforall/home-page/our-products/aluminum-profiles',
  'silicon': 'https://sites.google.com/view/decorforall/home-page/our-products/fixing-materials'
};

const DEFAULT_ARCHIVE_URL = 'https://sites.google.com/view/decorforall/home-page/our-products?authuser=1';

export default function OfficialArchiveVaultCard({
  categorySlug,
  categoryTitle = 'Material Collection',
  layout = 'grid'
}) {
  const targetUrl = OFFICIAL_ARCHIVE_LINKS[categorySlug] || DEFAULT_ARCHIVE_URL;

  if (layout === 'banner') {
    return (
      <div className="heavy-vault-card mt-8 overflow-hidden rounded-3xl p-6 sm:p-8 text-white">
        {/* Subtle Background Watermark */}
        <div className="pointer-events-none absolute -right-12 -top-12 opacity-10">
          <Compass size={220} className="text-[#E5A924] animate-gear-slow" />
        </div>

        <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#E5A924] shadow-[0_0_8px_#E5A924]" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4b77a]">
                Deep Archival Repository
              </span>
            </div>
            
            <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold text-[#f5ebd7] tracking-tight">
              Looking for More Specific Factory Codes or Dimensions?
            </h3>
            
            <p className="mt-1.5 font-sans text-xs sm:text-sm text-stone-300 leading-relaxed">
              Explore the complete official archive for <strong className="text-[#E5A924]">{categoryTitle}</strong>, including all custom slab cuts, project swatches, and technical color serials.
            </p>
          </div>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2.5 rounded-xl border border-[#d4b77a]/60 bg-gradient-to-r from-[#2a241c] to-[#1c1813] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#f5ebd7] shadow-lg transition-all duration-300 hover:border-[#E5A924] hover:from-[#3d3326] hover:to-[#251f18] hover:text-white hover:shadow-[0_0_20px_rgba(229,169,36,0.35)]"
          >
            <span>Open Official Library</span>
            <ExternalLink size={15} className="text-[#E5A924] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    );
  }

  // Grid Card Layout (Placed at the end of the gallery grid)
  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Explore complete archive for ${categoryTitle}`}
      className="heavy-vault-card group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl p-5 sm:p-6 text-left text-white"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute -right-8 -top-8 opacity-15">
        <Compass size={160} className="text-[#E5A924] animate-gear-slow" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#E5A924] shadow-[0_0_8px_#E5A924]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4b77a]">
              Full Archive
            </span>
          </div>
          <span className="rounded-md border border-[#d4b77a]/30 bg-black/40 px-2 py-0.5 font-mono text-[9px] text-[#e7d5b2]">
            OFFICIAL
          </span>
        </div>

        <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d4b77a]/50 bg-gradient-to-br from-[#2a231b] to-black shadow-inner">
          <Layers size={26} className="text-[#E5A924] transition-transform duration-500 group-hover:scale-110" />
        </div>

        <h3 className="mt-4 font-display text-base sm:text-lg font-bold text-[#f5ebd7] group-hover:text-white leading-snug">
          Explore All Sub-variants & Swatches
        </h3>

        <p className="mt-2 font-sans text-xs text-stone-300/90 leading-relaxed">
          Access all color codes, dimension sheets (320×120cm, 60×120cm), and factory batch samples for <strong className="text-[#d4b77a]">{categoryTitle}</strong>.
        </p>
      </div>

      <div className="relative z-10 mt-6 border-t border-[#d4b77a]/25 pt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-[#E5A924]">
          <span className="uppercase tracking-wider text-[11px] font-bold text-[#f5ebd7] group-hover:text-white">
            Launch Archive
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#d4b77a]/50 bg-black/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:border-[#E5A924]">
            <ExternalLink size={13} className="text-[#E5A924]" />
          </div>
        </div>
      </div>
    </a>
  );
}

