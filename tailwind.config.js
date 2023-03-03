/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./Components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#090E1A",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
