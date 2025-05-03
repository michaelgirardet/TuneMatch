module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0b132b',
          DEFAULT: '#1c2541',
          light: '#75a5b8',
        },
        surface: {
          light: '#dbe1f0',
          white: '#ffffff',
        },
        accent: {
          violet: '#8F13FF',
          pink: '#D81E5B',
        },
        gray: {
          dark: '#212936',
        },
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
