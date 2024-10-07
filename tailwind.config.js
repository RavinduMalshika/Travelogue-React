/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/App.js",
    "./src/components/*",
    "./src/pages/Home.js",
    "./src/pages/Login.js",
    "./src/pages/AboutUs.js",
    "./src/pages/ContactUs.js",
  ],
  theme: {
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
      }
    },
  },
  plugins: [

  ],
}

