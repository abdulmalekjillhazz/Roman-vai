import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEOHead({ title, description, canonicalPath = '/', product = null }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dstdeco.com';
  const fullUrl = `${siteUrl}${canonicalPath}`;
  const pageTitle = title || 'DST Deco | Luxury Interior Decor Materials Supplier in Dubai, UAE';
  const pageDesc =
    description ||
    'Premium B2B supplier of 100% waterproof SPC flooring, WPC fluted wall panels, flexible stone, PU stone, and architectural moldings in Dubai & UAE.';

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: 'DST Deco'
        },
        offers: {
          '@type': 'Offer',
          url: fullUrl,
          priceCurrency: 'AED',
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock'
        }
      }
    : null;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={fullUrl} />
      {productSchema && (
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      )}
    </Helmet>
  );
}
