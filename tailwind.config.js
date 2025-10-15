/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        'copado-blue': '#0070D2',
        'copado-dark': '#032D60',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'roboto': ['Roboto', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'header': '-0.03em', // -3% kerning
      },
      fontSize: {
        'body': ['15px', { lineHeight: '1.5' }], // 15pt body text
      }
    },
  },
};


