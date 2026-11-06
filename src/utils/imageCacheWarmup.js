import { optimizedCloudinaryUrl } from '../components/public/FallbackImage.jsx';

// In-memory registry to ensure each URL variation is fetched only once per browser session
const cachedUrlRegistry = new Set();

/**
 * Preloads a single image into the browser's HTTP cache.
 * Uses decoding='async' and low priority so user interactions are never blocked.
 */
function preloadImage(url) {
  if (!url || typeof window === 'undefined') return Promise.resolve(false);
  if (cachedUrlRegistry.has(url)) return Promise.resolve(true);

  return new Promise((resolve) => {
    cachedUrlRegistry.add(url);
    const img = new window.Image();
    img.decoding = 'async';
    img.fetchPriority = 'low';
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Runs during browser idle periods to prevent frame drops or CPU starvation.
 */
function runWhenIdle(callback, timeout = 1200) {
  if (typeof window === 'undefined') return;
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
  } else {
    window.setTimeout(callback, Math.min(timeout, 300));
  }
}

/**
 * Just-in-time warmup when a user hovers or focuses on a product card.
 * Preloads all finish variations in high-res (1200px) and thumbnail (160px)
 * so clicking to open the ProductModal is 100% instantaneous.
 */
export function preloadProductFinishes(product) {
  if (!product || !Array.isArray(product.images) || typeof window === 'undefined') return;

  const images = product.images.filter(Boolean);
  images.forEach((rawSrc) => {
    // 1. High-res modal view
    const modalUrl = optimizedCloudinaryUrl(rawSrc, 1200);
    preloadImage(modalUrl);
    // 2. Thumbnail strip
    const thumbUrl = optimizedCloudinaryUrl(rawSrc, 160);
    preloadImage(thumbUrl);
  });
}

/**
 * Progressive background warmup after the homepage loads.
 * Staggered in 3 gentle phases to keep user interaction buttery smooth.
 */
export function warmupCatalogImages(products = []) {
  if (!Array.isArray(products) || products.length === 0 || typeof window === 'undefined') return;

  // Wait 1.2s after initial page load to guarantee FCP and LCP are finished
  window.setTimeout(() => {
    runWhenIdle(() => {
      // Phase 1: Preload primary catalog thumbnails (width: 480) for all materials
      products.forEach((product) => {
        const coverSrc = product.thumbnail || product.images?.[0];
        if (coverSrc) {
          const cardUrl = optimizedCloudinaryUrl(coverSrc, 480);
          preloadImage(cardUrl);
        }
      });

      // Phase 2: Preload modal high-res (1200px) for the first 4 priority items
      runWhenIdle(() => {
        products.slice(0, 4).forEach((product) => {
          const coverSrc = product.thumbnail || product.images?.[0];
          if (coverSrc) {
            preloadImage(optimizedCloudinaryUrl(coverSrc, 1200));
          }
          if (product.images?.[1]) {
            preloadImage(optimizedCloudinaryUrl(product.images[1], 1200));
          }
        });

        // Phase 3: Gradual queue for secondary and tertiary finishes in calm batches
        const remainingImages = [];
        products.forEach((product) => {
          (product.images || []).slice(1).forEach((src) => {
            if (src) {
              remainingImages.push(optimizedCloudinaryUrl(src, 1200));
              remainingImages.push(optimizedCloudinaryUrl(src, 160));
            }
          });
        });

        let index = 0;
        function processBatch() {
          if (index >= remainingImages.length) return;
          const batch = remainingImages.slice(index, index + 3);
          index += 3;
          batch.forEach(preloadImage);
          runWhenIdle(processBatch, 450);
        }

        runWhenIdle(processBatch, 800);
      }, 1500);
    }, 1200);
  }, 1200);
}
