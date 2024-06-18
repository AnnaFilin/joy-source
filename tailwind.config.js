/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      seasalt: "#f7f7f7",
      citrine: {
        100: "#fbfae6",
        200: "#f3f1b5",
        500: "#D7CF07",
        700: "#aca606",
        800: "#817c04",
      },
      purple: {
        100: "#f0e6ed",
        200: "#d1b3c9",
        500: "#64024c",
        700: "#460135",
        800: "#1e0117",
      },
      licorice: {
        100: "#e9e8e8",
        500: "#26171c",
        900: "#0f090b",
      },
      green: {
        500: "#2f4b26",
        600: "#263c1e",
        800: "#182613",
      },
    },
    extend: {
      width: {
        fill: "-webkit-fill-available",
      },
      height: {
        fill: "-webkit-fill-available",
      },
    },
  },
  plugins: [],
};
