/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f1f5ff",
          100: "#dbe7ff",
          200: "#b6cfff",
          300: "#90b6ff",
          400: "#6b9eff",
          500: "#4685ff",
          600: "#3468cc",
          700: "#244b99",
          800: "#152f66",
          900: "#071333",
        },
        dopamine: "#ff90e8",
        success: "#34d399",
      },
    },
  },
  plugins: [],
};
