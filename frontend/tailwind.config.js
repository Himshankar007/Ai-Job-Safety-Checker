/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Corona-style dark admin palette
        background: "#0f1015",
        surface: "#191c24",
        card: "#1e222d",
        stroke: "rgba(255,255,255,0.08)",
        ink: "#e5e7eb",
        muted: "#9ca3af",
        primary: "#b66dff",
        secondary: "#ff2c6d",
        accent: "#00d25b",
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
