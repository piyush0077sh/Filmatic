/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        film: {
          50: '#faf8f4',
          100: '#f0ebe3',
          200: '#ddd4c9',
          300: '#c9b8a8',
          400: '#b5a28f',
          500: '#a18d7f',
          600: '#8b7868',
          700: '#6d5d54',
          800: '#4a3f3a',
          900: '#2d2622',
        },
        gold: {
          50: '#fef9f0',
          100: '#fdf1e0',
          200: '#f9dfc2',
          300: '#f5cda3',
          400: '#f0b37e',
          500: '#d4954a',
          600: '#b8764a',
          700: '#8d5a35',
          800: '#664225',
          900: '#422b16',
        },
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#134e4a',
        },
      },
      boxShadow: {
        'premium': '0 20px 40px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4)',
        'premium-lg': '0 30px 60px rgba(0, 0, 0, 0.7), 0 12px 24px rgba(0, 0, 0, 0.5)',
        'premium-hover': '0 25px 50px rgba(212, 149, 74, 0.15), 0 10px 20px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        'xl': '12px',
      },
    },
  },
  plugins: [],
};