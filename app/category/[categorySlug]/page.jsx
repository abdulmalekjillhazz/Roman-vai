'use client';

import { useParams } from 'next/navigation';
import AppShell from '../../../src/App.jsx';
import HomePage from '../../../src/site-pages/HomePage.jsx';

export default function CategoryRoute() {
  const { categorySlug } = useParams();

  return (
    <AppShell>
      {(onOpenQuote) => <HomePage categorySlug={categorySlug} onOpenQuote={onOpenQuote} />}
    </AppShell>
  );
}
