/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jarvis: {
          dark: '#020610',
          panel: 'rgba(5, 15, 30, 0.85)',
          border: 'rgba(0, 255, 255, 0.3)',
          cyan: '#00ffff',
          blue: '#00bfff',
          glow: '#00ffff40',
        }
      },
    },
  },
  plugins: [],
}
