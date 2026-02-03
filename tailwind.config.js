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
        'baby-blue': '#E3F2FD',
        'baby-pink': '#FCE4EC',
        'soft-purple': '#F3E5F5',
        'warm-yellow': '#FFF9C4',
      },
    },
  },
  plugins: [],
}

