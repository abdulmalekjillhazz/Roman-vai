'use client';

import { useParams } from 'next/navigation';
import AppShell from '../../../src/App.jsx';
import ProductDetailPage from '../../../src/site-pages/ProductDetailPage.jsx';

export default function ProductClient() {
  const { slug } = useParams();

  return (
    <AppShell>
      {(onOpenQuote) => <ProductDetailPage slug={slug} onOpenQuote={onOpenQuote} />}
    </AppShell>
  );
}
