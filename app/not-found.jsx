import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Compass } from 'lucide-react';
import { HouseMonogram } from '../src/components/public/BrandLogo.jsx';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#FAF6EE] px-4 py-16 text-stone-900">
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

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-stone-200/90 bg-white/95 p-8 text-center shadow-[0_24px_60px_-15px_rgba(28,25,23,0.1)] backdrop-blur-md sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E5A924]/40 bg-stone-950 shadow-md">
          <HouseMonogram className="h-9 w-9" color="#E5A924" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-800/5 px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-900">
          <Compass className="h-3.5 w-3.5 text-[#E5A924]" />
          <span>Error 404 · Page Not Found</span>
        </div>

        <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          This architectural page doesn&apos;t exist.
        </h1>

        <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-stone-600">
          The finish, project, or URL you requested may have moved or been archived. Explore our main collection or completed portfolio below.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn-luxury-gold inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-950 shadow-md transition active:scale-95 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/projects"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-stone-800 active:scale-95 sm:w-auto"
          >
            <span>View Portfolio</span>
            <ArrowUpRight className="h-4 w-4 text-[#E5A924]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
