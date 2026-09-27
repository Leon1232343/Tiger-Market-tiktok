/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: '#00f0ff',
          500: '#00c8d6',
          600: '#00a0b4',
          800: '#006070',
        },
      },
    },
  },
  plugins: [],
}
