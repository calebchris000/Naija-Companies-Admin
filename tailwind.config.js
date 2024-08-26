/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#3490dc",
        secondary: "#ffed4a",
        accent: "#f6993f",
        success: "#38c172",
        danger: "#e3342f",
        warning: "#f6993f",
        info: "#6cb2eb",
        light: "#f8f9fa",
        dark: "#343a40",
      },
    },
  },
  plugins: [],
};
