/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fff",
        secondary: "#F0F6FF",
        dark: "#2c3e50",
        light: "#f5f6fa",
        iconList: "#5D7285",
        plusIcon: "#F4D7DA",
        darkBlue: "#0A3B83",
        lightBlue: "#01A2F9",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
    },
  },
  plugins: [],
};
