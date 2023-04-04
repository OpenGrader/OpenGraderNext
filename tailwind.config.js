/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./Components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["IBM\\ Plex\\ Sans", "Source\\ Sans\\ Pro", "Inter", "Roboto", "Verdana", "Arial", "sans-serif"],
      mono: ["IBM\\ Plex\\ Mono", "Fira\\ Code", "Monaco", "monospaced"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
