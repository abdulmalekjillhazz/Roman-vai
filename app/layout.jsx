import '../src/index.css';

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'CLASSICAL DECOR I D',
  alternateName: 'DST Deco',
  slogan: 'DESIGN • DECOR • PERFECT',
  url: 'https://dstdeco.com',
  telephone: '+971543532585',
  email: 'dstdeco@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dubai',
    addressCountry: 'AE'
  },
  openingHours: 'Sa-Th 09:00-18:00',
  description:
    'Dubai architectural materials supplier specializing in luxury interior and exterior surfaces.'
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dstdeco.com'),
  title: 'DST Deco | Luxury Interior Materials Supplier in Dubai, UAE',
  description:
    'Premium B2B supply of SPC flooring, WPC wall panels, flexible stone, PU stone, and architectural finishes across Dubai and the UAE.',
  openGraph: {
    title: 'Classical Decor ID (DST Deco) | Luxury Architectural Materials Dubai',
    description:
      'DESIGN • DECOR • PERFECT. Premium architectural surfaces across UAE. Call or WhatsApp +971 543 532 585.',
    type: 'website',
    url: 'https://dstdeco.com',
    images: ['/assets/business-card-cream.jpeg']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@500&family=Outfit:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@500&family=Outfit:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@500&family=Outfit:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          />
        </noscript>
      </head>
      <body className="bg-[#FAF6EE] text-[#141414] antialiased selection:bg-[#E5A924] selection:text-[#141414]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
