'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GalleryRoute() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#product-catalog');
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-[#E5A924]" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
        Redirecting to Architectural Material Collection...
      </p>
    </div>
  );
}
