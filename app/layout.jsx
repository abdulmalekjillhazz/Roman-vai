import '../src/index.css';

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Classical Decor ID',
  alternateName: 'classicaldecorid',
  slogan: 'DESIGN • DECOR • PERFECT',
  url: 'https://classicaldecorid.com',
  telephone: '+971543532585',
  email: 'info@classicaldecorid.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dubai',
    addressCountry: 'AE'
  },
  openingHours: 'Sa-Th 09:00-18:00',
  description:
    'Dubai architectural materials supplier specializing in luxury interior and exterior surfaces.'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF6EE'
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://classicaldecorid.com'),
  title: 'Classical Decor ID | Luxury Interior Materials Supplier in Dubai, UAE',
  description:
    'Premium B2B supply of SPC flooring, WPC wall panels, flexible stone, PU stone, and architectural finishes across Dubai and the UAE.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    siteName: 'classicaldecorid',
    title: 'Classical Decor ID | Luxury Architectural Materials Dubai',
    description:
      'DESIGN • DECOR • PERFECT. Premium architectural surfaces across UAE. Call or WhatsApp +971 543 532 585.',
    type: 'website',
    url: 'https://classicaldecorid.com',
    images: ['/assets/business-card-cream.jpeg']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@500&family=Outfit:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="overflow-x-hidden bg-brand-cream text-brand-charcoal antialiased selection:bg-brand-gold selection:text-brand-charcoal">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
