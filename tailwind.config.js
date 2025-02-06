/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
        ],
      },
      colors: {
        primary: {
          light: "#0076B3",
          DEFAULT: "#004376",
          dark: "#002d4e",
          "dark-mode": "#012641", // Color de fondo en modo oscuro
          "dark-primary-text": "#F3F4F6FF", // Color de texto en modo oscuro
          "dark-secondary-text": "#D1D5DBFF", // Color de texto en modo oscuro
          "dark-hover": "#003b65", // Color de hover en modo oscuro
        },
        primarytx: {
          light: "#ffffff",
          DEFAULT: "#1F2937FF",
          2: "#374151FF",
          dark: "#F3F4F6FF",
          "dark-2": "#D1D5DBFF", // Color de texto en modo oscuro
          secondary: "#0076B3",
        },
        secondary: {
          light: "#FFE66D",
          DEFAULT: "#9AA2AD",
          dark: "#C44D58",
        },
        gradient: {
          lightStart: "#d7f0fd",
          lightEnd: "#b3cbf4",
          darkStart: "#003b65",
          darkEnd: "#0076B3",
        },
      },
      backgroundImage: {
        "gradient-to-r-light":
            "linear-gradient(to right, var(--tw-gradient-stops))",
        "gradient-to-r-dark":
            "linear-gradient(to right, var(--tw-gradient-stops))",
      },
      boxShadow: {
        neomorphism: "1px 1px 0px #d9d9d9, 1px 1px 10px #ffffff",
      },
    },
  },
  plugins: [],
}

