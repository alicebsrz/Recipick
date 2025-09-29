// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // A nossa nova paleta de cores
      colors: {
        'background': '#FFFFFF',
        'light-green': '#E6F4EA',
        'primary-green': '#6DBE45',
        'accent-orange': '#FF7B54',
        'text-gray': '#333333',
      },
      // A nossa nova configuração de fontes
      fontFamily: {
        sans: ['var(--font-open-sans)'], // Define Open Sans como a fonte padrão (font-sans)
        display: ['var(--font-montserrat)'], // Define Montserrat como a fonte de títulos (font-display)
      },
    },
  },
  plugins: [],
};

