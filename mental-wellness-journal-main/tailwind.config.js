/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Nunito", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: {
          light: "#a5b4fc",
          DEFAULT: "#6366f1",
          dark: "#4338ca",
        },
        accent: {
          light: "#f0abfc",
          DEFAULT: "#e879f9",
          dark: "#c026d3",
        },
        background: {
          light: "#f8fafc",
          DEFAULT: "#f1f5f9",
          dark: "#18181b",
        },
        card: {
          light: "#fff",
          dark: "#23272f",
        },
      },
      boxShadow: {
        soft: "0 4px 32px 0 rgba(80, 80, 180, 0.10)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
      },
    },
  },
  plugins: [],
};
