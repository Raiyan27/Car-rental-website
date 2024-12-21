/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "base-100": "#ffffff",
        bluePrimary: "#81BFDA",
        blueSecondary: "#B1F0F7",
        yellowPrimary: "#F5F0CD",
        yellowSecondary: "#FADA7A",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "base-100": "#ffffff",
          bluePrimary: "#81BFDA",
          blueSecondary: "#B1F0F7",
          yellowPrimary: "#F5F0CD",
          yellowSecondary: "#FADA7A",
        },
      },
    ],
  },
};
