/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#FAF6EE',
          sand: '#E6DEC8',
          charcoal: '#141414',
          muted: '#57534E',
          gold: '#E5A924',
          goldHover: '#C48B12',
          bronze: '#B38E46',
          bronzeDark: '#8A6B36',
          whatsapp: '#25D366'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    }
  },
  plugins: []
};
