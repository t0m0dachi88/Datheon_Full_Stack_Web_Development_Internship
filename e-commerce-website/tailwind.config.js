/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Georgia", "serif"]
      },
      colors: {
        ink: "#20231f",
        paper: "#f7f7f4",
        moss: "#536b50",
        sand: "#e9e8e1"
      },
      boxShadow: {
        soft: "0 16px 50px rgba(32,35,31,.08)"
      }
    }
  },
  plugins: []
};
