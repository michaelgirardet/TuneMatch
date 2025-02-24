/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        quicksand: ['var(--font-quicksand)'],
        sulphur: ['var(--font-sulphur)'],
      },
      colors: {
        primary: '#1d1e2c',
        secondary: '#2f3061',
        light: '#fafafa',
      },
    },
  },
};
