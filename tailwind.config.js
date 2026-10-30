/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f2f5ef",
          100: "#e3eadf",
          200: "#c8d5c2",
          300: "#a8bca0",
          400: "#829b7c",
          500: "#617d5f",
          600: "#4a634c",
          700: "#3a503e",
          800: "#2b4033",
          900: "#1d3a2e",
          950: "#152b21",
        },
        cream: {
          50: "#fdfbf6",
          100: "#f9f5ea",
          200: "#f4eee0",
          300: "#ede5d4",
          400: "#e2d8c4",
          500: "#d5c7ad",
        },
        rust: {
          50: "#fbf0e9",
          100: "#f4ddcf",
          200: "#e9bda4",
          300: "#dc9a77",
          400: "#cd7952",
          500: "#bb5f3b",
          600: "#a34d2f",
          700: "#843d27",
        },
        sand: "#e5dccb",
        ink: "#1b352a",
        muted: "#6f7b6d",
      },
      fontFamily: {
        sans: ["Inter Variable", "Inter", "system-ui", "sans-serif"],
        display: ["Fraunces Variable", "Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(29, 58, 46, 0.04), 0 8px 24px -18px rgba(29, 58, 46, 0.18)",
        lift: "0 18px 40px -22px rgba(29, 58, 46, 0.32)",
      },
      borderRadius: {
        "2.5xl": "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 180ms ease-out both",
        "fade-in": "fade-in 160ms ease-out both",
      },
    },
  },
  plugins: [],
};
