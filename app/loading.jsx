import { HouseMonogram } from '../src/components/public/BrandLogo.jsx';

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Classical Decor ID"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#FAF6EE] px-4 py-16 text-stone-900"
    >
      {/* Subtle Architectural Blueprint Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #1c1917 1px, transparent 1px), linear-gradient(to bottom, #1c1917 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Soft Golden Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(229,169,36,0.28) 0%, transparent 70%)'
        }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {/* Architectural Monogram Medallion */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-[#E5A924]/40 bg-stone-950 shadow-[0_20px_50px_-12px_rgba(28,25,23,0.35)]">
          <HouseMonogram className="h-11 w-11 motion-safe:animate-pulse" color="#E5A924" />
        </div>

        <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.26em] text-stone-900">
          Classical Decor ID
        </p>
        <p className="mt-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
          Preparing Architectural Surfaces
        </p>

        {/* Sleek Shimmer Progress Bar */}
        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-stone-200/90">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#d4b77a] via-[#E5A924] to-[#d4b77a] motion-safe:animate-pulse" />
        </div>

        {/* Minimal Editorial Skeleton Preview */}
        <div aria-hidden="true" className="mt-10 grid w-full grid-cols-3 gap-3 opacity-60">
          <div className="h-16 rounded-xl border border-stone-200/80 bg-white/70 skeleton-shimmer" />
          <div className="h-16 rounded-xl border border-stone-200/80 bg-white/70 skeleton-shimmer" />
          <div className="h-16 rounded-xl border border-stone-200/80 bg-white/70 skeleton-shimmer" />
        </div>
      </div>

      <span className="sr-only">Loading page content, please wait.</span>
    </div>
  );
}
