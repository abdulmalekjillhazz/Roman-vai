import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Compass } from 'lucide-react';

export default function ProjectNotFound() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#FAF6EE] px-4 py-16 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(to right, #1c1917 1px, transparent 1px), linear-gradient(to bottom, #1c1917 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-stone-200 bg-white/95 p-8 shadow-xl backdrop-blur-md sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E5A924]/40 bg-stone-950"><Compass className="h-8 w-8 text-[#E5A924]" /></div>
        <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-amber-800">Project archive · 404</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-stone-900 sm:text-4xl">This case study is not in the archive.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-600">The project may have moved, been archived, or the link may be incomplete. Explore the current portfolio to find another material story.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/projects" className="btn-luxury-gold inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-xs font-bold uppercase tracking-wider text-stone-950"><ArrowLeft className="h-4 w-4" /> Back to portfolio</Link><Link href="/#product-catalog" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 text-xs font-bold uppercase tracking-wider text-white">Browse materials <ArrowUpRight className="h-4 w-4 text-[#E5A924]" /></Link></div>
      </div>
    </main>
  );
}
