import { useEffect, useState } from 'react';

export default function useCatalogStatus(api, enabled) {
  const [catalogStatus, setCatalogStatus] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setCatalogStatus(null);
      return;
    }
    let cancelled = false;
    api.get('/products/admin/status')
      .then(response => {
        if (!cancelled) setCatalogStatus(response.data);
      })
      .catch(() => {
        if (!cancelled) setCatalogStatus({ persistenceAvailable: false, uploadsAvailable: false, message: 'Cannot verify catalog storage. Refresh or sign in again before making changes.' });
      });
    return () => { cancelled = true; };
  }, [api, enabled]);

  return catalogStatus;
}
