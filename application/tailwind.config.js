/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00E5FF", // Neon Cyan
          dark: "#00B8D4",
        },
        background: {
          DEFAULT: "#0A0A0A",
          card: "#121212",
        },
        danger: "#FF3D00",
        warning: "#FFAB00",
        success: "#00E676",
      },
    },
  },
  plugins: [],
};
