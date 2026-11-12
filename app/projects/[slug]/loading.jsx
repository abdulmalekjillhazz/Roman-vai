export default function ProjectDetailLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading project case study" className="min-h-[100dvh] animate-pulse bg-[#FAF6EE] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl"><div className="h-3 w-52 rounded bg-stone-200" /><div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"><div className="aspect-[4/3] rounded-3xl bg-stone-200" /><div className="rounded-3xl bg-white p-6 sm:p-8"><div className="h-3 w-28 rounded bg-stone-200" /><div className="mt-5 h-10 w-4/5 rounded-xl bg-stone-200" /><div className="mt-4 h-4 w-1/2 rounded bg-stone-200" /><div className="mt-8 h-24 rounded-xl bg-stone-100" /><div className="mt-8 h-12 rounded-xl bg-stone-200" /></div></div></div>
    </div>
  );
}
