'use client';

import AppShell from '../../src/App.jsx';
import AdminDashboard from '../../src/site-pages/admin/AdminDashboard.jsx';

export default function AdminRoute() {
  return (
    <AppShell>
      {() => <AdminDashboard />}
    </AppShell>
  );
}
