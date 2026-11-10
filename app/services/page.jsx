import ServicesClient from './ServicesClient.jsx';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://classicaldecorid.com';

export const metadata = {
  title: 'Services | Classical Decor ID',
  description: 'Specialized commercial and residential architectural surface supply, consultation, and sampling solutions in Dubai and UAE.',
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: 'Services | Classical Decor ID',
    description: 'Specialized commercial and residential architectural surface supply, consultation, and sampling solutions in Dubai and UAE.',
    url: `${SITE_URL}/services`
  }
};

async function fetchServices() {
  try {
    const res = await fetch(`${SITE_URL}/api/services?published=true`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await fetchServices();
  return <ServicesClient services={Array.isArray(services) ? services : []} />;
}
