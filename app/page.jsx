'use client';

import AppShell from '../src/App.jsx';
import HomePage from '../src/site-pages/HomePage.jsx';

export default function HomeRoute() {
  return (
    <AppShell>
      {(onOpenQuote) => <HomePage onOpenQuote={onOpenQuote} />}
    </AppShell>
  );
}
