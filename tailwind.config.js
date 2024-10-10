/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/App.js",
    "./src/components/*",
    "./src/pages/*",
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

