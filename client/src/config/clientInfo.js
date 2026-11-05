/**
 * Official Brand Kit & Profile Metadata
 * CLASSICAL DECOR I D (DST Deco) — Dubai Architectural Materials & Trade Supply Portal
 */
export const CLIENT_INFO = {
  brandName: import.meta.env.VITE_BRAND_NAME || 'Classical Decor ID',
  tradeName: import.meta.env.VITE_BRAND_SUBTITLE || 'DST Deco',
  tagline: import.meta.env.VITE_BRAND_TAGLINE || 'DESIGN • DECOR • PERFECT',
  domain: import.meta.env.VITE_SITE_URL || 'https://dstdeco.com',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '971543532585',
  phoneDisplay: import.meta.env.VITE_PHONE_DISPLAY || '+971 543 532 585',
  email: import.meta.env.VITE_CLIENT_EMAIL || 'dstdeco@gmail.com',
  secondaryEmail: 'info@dstdeco.com',
  location: 'Dubai, United Arab Emirates',
  workingHours: 'Saturday – Thursday, 9:00 AM – 6:00 PM (GST)',
  socials: {
    instagramHandle: '@classicaldecorid',
    instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/classicaldecorid',
    facebookHandle: 'classicaldecorid',
    facebookUrl: import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/classicaldecorid'
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
