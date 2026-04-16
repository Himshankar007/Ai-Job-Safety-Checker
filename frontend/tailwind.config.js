/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sand and White light palette
        background: "#faf7f2",
        surface: "#ffffff",
        card: "#ffffff",
        stroke: "rgba(0,0,0,0.08)",
        ink: "#1a1a1a",
        muted: "#6b7280",
        primary: "#d97706", // amber/sand vibrant
        secondary: "#0284c7", // sky blue
        accent: "#059669", // emerald green
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
