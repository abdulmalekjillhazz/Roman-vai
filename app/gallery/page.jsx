'use client';

import AppShell from '../../src/App.jsx';
import SiteImageGalleryPage from '../../src/site-pages/SiteImageGalleryPage.jsx';

export default function GalleryRoute() {
  return (
    <AppShell>
      {(onOpenQuote) => <SiteImageGalleryPage onOpenQuote={onOpenQuote} />}
    </AppShell>
  );
}
