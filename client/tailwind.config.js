module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#2A4651',
        charcoalhover: '#31515E',
        electric: '#8f13ff',
        electrichover: '#A033FF',
        lavender: '#dbe1f0',
        oxford: '#0b132b',
        oxfordhover: '#111D41',
        space: '#1c2541',
        raisin: '#1D1E2C',
        cadet: '#282A3E',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        sulphur: ['Sulphur Point', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
