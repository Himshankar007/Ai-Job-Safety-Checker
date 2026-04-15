/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Classic white / sand / brown palette
        primary: "#8B5E34", // cocoa brown
        secondary: "#C7A17A", // sand
        background: "#FAF4E8", // warm off-white
        surface: "#FFFFFF",
        ink: "#2B1B12",
        muted: "#6B5A4A",
        accent: "#B45F06", // warm amber-brown
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
