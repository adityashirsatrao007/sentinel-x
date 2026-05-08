/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        primary: '#3b82f6',
        card: '#18181b',
        border: '#27272a',
        muted: '#a1a1aa'
      }
    },
  },
  plugins: [],
}
