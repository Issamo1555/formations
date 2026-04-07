/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          hover: '#059669',
          light: '#34d399',
        },
        secondary: {
          DEFAULT: '#7c6df8',
          hover: '#6558d4',
        },
        accent: {
          DEFAULT: '#0056d2',
          hover: '#0041a8',
        },
        surface: {
          DEFAULT: 'var(--bg-panel)',
          elevated: 'var(--bg-elevated)',
          overlay: 'rgba(0,0,0,0.6)',
        },
        border: {
          DEFAULT: 'var(--border-light)',
          light: 'rgba(15,23,42,0.10)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        card: 'var(--shadow-card, 0 16px 38px rgba(0,0,0,0.36))',
        elevated: 'var(--shadow-elevated, 0 24px 56px rgba(0,0,0,0.52))',
        soft: 'var(--shadow-soft, 0 18px 45px rgba(0,0,0,0.45))',
      },
    },
  },
  plugins: [],
};
