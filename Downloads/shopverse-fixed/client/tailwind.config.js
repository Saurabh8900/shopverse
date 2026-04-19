/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff0f6',
          100: '#ffe0ee',
          200: '#ffc2de',
          300: '#ff91c3',
          400: '#ff4d9e',
          500: '#ff1a7f',
          600: '#f0006a',
          700: '#cc0059',
          800: '#a8004a',
          900: '#8a0040',
        },
        accent: {
          cyan:   '#00e5ff',
          amber:  '#ffb300',
          purple: '#7c3aed',
          green:  '#10b981',
        },
        dark: {
          900: '#070010',
          800: '#0d0018',
          700: '#130022',
          600: '#1a0030',
          500: '#240040',
        },
      },
      animation: {
        'shimmer':        'shimmer 2.5s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'pulse-glow':     'pulse-glow 2s ease-in-out infinite',
        'slide-up':       'slide-up 0.5s ease forwards',
        'marquee':        'marquee 30s linear infinite',
        'marquee-rev':    'marquee-rev 30s linear infinite',
        'spin-slow':      'spin 12s linear infinite',
        'bounce-in':      'bounce-in 0.4s cubic-bezier(0.36,0.07,0.19,0.97)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 20px rgba(255,26,127,0.3)' },
          '50%':     { boxShadow: '0 0 40px rgba(255,26,127,0.7)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'marquee-rev': {
          from: { transform: 'translateX(-50%)' },
          to:   { transform: 'translateX(0)' },
        },
        'bounce-in': {
          '0%':   { transform: 'scale(0.3)', opacity: '0' },
          '50%':  { transform: 'scale(1.08)' },
          '70%':  { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
