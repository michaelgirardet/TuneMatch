module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        air: '#75a5b8',
        electric: '#8f13ff',
        electrichover: '#A033FF',
        lavender: '#dbe1f0',
        oxford: '#0b132b',
        space: '#1c2541',
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
