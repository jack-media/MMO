/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1677ff',
          light: '#4096ff',
        },
        sidebar: '#0f172a',
        header: '#0b1220',
        body: '#f5f7fb',
      },
    },
  },
  plugins: [],
}
