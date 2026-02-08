import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#0a0a0a',
          dark: '#111111',
          charcoal: '#1a1a1a',
          gold: '#c9a962',
          'gold-light': '#e5d4a1',
          'gold-dark': '#9a7b3a',
          cream: '#f5f0e6',
          silver: '#a8a8a8',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-cormorant)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '200% 0' },
          '50%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c9a962 0%, #e5d4a1 50%, #9a7b3a 100%)',
        'gold-shine': 'linear-gradient(90deg, transparent, rgba(201,169,98,0.3), transparent)',
      },
    },
  },
  plugins: [],
};

export default config;
