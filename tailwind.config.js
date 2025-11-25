/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          800: '#115e59',
          700: '#0f766e',
        },
        kolos: {
          gold: '#C8A953',
        },
      },
    },
  },
  plugins: [],
}

