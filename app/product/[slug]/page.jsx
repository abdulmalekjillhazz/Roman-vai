import ProductClient from './ProductClient.jsx';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://classicaldecorid.com';

async function fetchProduct(slug) {
  try {
    const res = await fetch(`${SITE_URL}/api/products/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) {
    return { title: 'Product Not Found | Classical Decor ID' };
  }
  const title = product.seoTitle || `${product.name} | Classical Decor ID`;
  const description = product.seoDescription || product.description?.slice(0, 160) || undefined;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/product/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/product/${product.slug}`,
      images: product.thumbnail ? [product.thumbnail] : product.images?.slice(0, 1)
    }
  };
}

export default async function ProductRoute({ params }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  return (
    <>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.name,
              description: product.description,
              image: product.images,
              sku: product.id,
              brand: { '@type': 'Brand', name: 'Classical Decor ID' },
              offers: {
                '@type': 'Offer',
                url: `${SITE_URL}/product/${product.slug}`,
                priceCurrency: 'AED',
                availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
              }
            })
          }}
        />
      )}
      <ProductClient />
    </>
  );
}
