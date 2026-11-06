import { optimizedCloudinaryUrl } from '../components/public/FallbackImage.jsx';

// In-memory registry to ensure each URL variation is fetched only once per browser session
const cachedUrlRegistry = new Set();

/**
 * Preloads one product cover when a touch user is about to open its details.
 */
export function preloadProductCover(product) {
  const cover = product?.images?.[0] || product?.thumbnail;
  if (!cover || typeof window === 'undefined') return;

  const url = optimizedCloudinaryUrl(cover, 1200);
  if (!url || cachedUrlRegistry.has(url)) return;

  cachedUrlRegistry.add(url);
  const image = new window.Image();
  image.decoding = 'async';
  image.fetchPriority = 'low';
  image.src = url;
}
