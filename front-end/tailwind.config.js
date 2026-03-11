/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f2937',
        secondary: '#4b5563',
        accent: '#10b981',
      },
      fontFamily: {
        sans: ['Poppins'],
      },
    }
  },
  darkMode: 'class',
  plugins: [],
};
