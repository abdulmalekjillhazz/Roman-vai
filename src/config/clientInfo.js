/**
 * Official Brand Kit & Profile Metadata
 * CLASSICAL DECOR I D (DST Deco) — Dubai Architectural Materials & Trade Supply Portal
 */
export const CLIENT_INFO = {
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'Classical Decor ID',
  tradeName: process.env.NEXT_PUBLIC_BRAND_SUBTITLE || 'DST Deco',
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'DESIGN • DECOR • PERFECT',
  domain: process.env.NEXT_PUBLIC_SITE_URL || 'https://dstdeco.com',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971543532585',
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY || '+971 543 532 585',
  email: process.env.NEXT_PUBLIC_CLIENT_EMAIL || 'dstdeco@gmail.com',
  secondaryEmail: 'info@dstdeco.com',
  location: 'Dubai, United Arab Emirates',
  workingHours: 'Saturday – Thursday, 9:00 AM – 6:00 PM (GST)',
  socials: {
    instagramHandle: '@classicaldecorid',
    instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/classicaldecorid',
    facebookHandle: 'classicaldecorid',
    facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/classicaldecorid'
  },
  colors: {
    cream: '#FAF6EE',
    sand: '#E6DEC8',
    charcoal: '#141414',
    muted: '#57534E',
    gold: '#E5A924',
    goldHover: '#C48B12',
    bronze: '#B38E46',
    whatsapp: '#25D366'
  },
  fonts: {
    display: "'Outfit', sans-serif",
    serif: "'Cormorant Garamond', serif",
    sans: "'Plus Jakarta Sans', sans-serif",
    mono: "'JetBrains Mono', monospace"
  }
};
