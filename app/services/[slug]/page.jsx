import ServiceClient from './ServiceClient.jsx';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://classicaldecorid.com';

async function fetchService(slug) {
  try {
    const res = await fetch(`${SITE_URL}/api/services/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await fetchService(slug);
  if (!service) {
    return { title: 'Service Not Found | Classical Decor ID' };
  }
  const title = service.seoTitle || `${service.title} | Classical Decor ID`;
  const description = service.seoDescription || service.description?.slice(0, 160) || undefined;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/services/${service.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/services/${service.slug}`,
      images: service.images?.slice(0, 1)
    }
  };
}

export default async function ServiceRoute({ params }) {
  const { slug } = await params;
  const service = await fetchService(slug);

  const faqSchema = service?.faqs && service.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  } : null;

  const serviceSchema = service ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Classical Decor ID',
      url: SITE_URL
    },
    areaServed: service.serviceAreas?.length > 0 ? service.serviceAreas : ['Dubai', 'UAE']
  } : null;

  return (
    <>
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ServiceClient service={service} />
    </>
  );
}
