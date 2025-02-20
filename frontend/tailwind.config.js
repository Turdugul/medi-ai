/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',  // Scan all pages
    './components/**/*.{js,ts,jsx,tsx}',  // Scan all components
    './src/**/*.{js,ts,jsx,tsx}',  // If you have a 'src' folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

