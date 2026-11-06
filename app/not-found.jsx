import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h2 className="font-serif text-3xl font-semibold text-stone-900">Page not found</h2>
      <p className="mt-2 text-sm text-stone-600">The material or page you are looking for does not exist.</p>
      <Link href="/" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-stone-900 px-6 text-sm font-medium text-white hover:bg-stone-800">
        Return to collection
      </Link>
    </div>
  );
}

