/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        film: {
          50: '#f5f7ff',
          100: '#e8ecff',
          200: '#c8d2ff',
          300: '#9eafff',
          400: '#6d83ff',
          500: '#485df5',
          600: '#3342d1',
          700: '#2b35a8',
          800: '#252d81',
          900: '#20265f',
        },
      },
    },
  },
  plugins: [],
};