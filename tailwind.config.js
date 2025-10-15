/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'copado-blue': '#0070D2',
        'copado-dark': '#032D60',
      }
    },
  },
  plugins: [],
}


