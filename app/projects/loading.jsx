import { HouseMonogram } from '../../src/components/public/BrandLogo.jsx';

export default function ProjectsLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading portfolio" className="min-h-[100dvh] bg-[#FAF6EE] px-4 py-10 text-stone-900 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="flex items-center gap-2 text-xs text-stone-400"><HouseMonogram className="h-5 w-5" color="#E5A924" /> Loading portfolio</div>
        <div className="mt-8 grid gap-4 border-b border-stone-200 pb-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div><div className="h-3 w-40 rounded bg-stone-200" /><div className="mt-4 h-12 max-w-xl rounded-xl bg-stone-200 sm:h-16" /><div className="mt-4 h-4 max-w-2xl rounded bg-stone-200" /></div>
          <div className="h-12 rounded-xl bg-stone-200" />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3"><div className="h-72 rounded-3xl bg-stone-200" /><div className="h-72 rounded-3xl bg-stone-200" /><div className="h-72 rounded-3xl bg-stone-200" /></div>
      </div>
    </div>
  );
}
