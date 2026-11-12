'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (error) {
      console.error('Global error boundary caught:', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF6EE] text-stone-900 antialiased">
        <main
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center"
        >
          <div className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-8 shadow-xl sm:p-12">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-amber-800">
              Classical Decor ID · Recovery
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-stone-900">
              Page needs a fresh reload
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Something unexpected interrupted the application. Reload the page to restore your session cleanly.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-stone-900 px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-stone-800"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={() => reset?.()}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-6 text-xs font-bold uppercase tracking-wider text-stone-800 transition hover:bg-stone-50"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
