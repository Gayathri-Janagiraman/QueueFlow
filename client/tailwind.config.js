// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#14B8A6",
//         secondary: "#0F172A",
//         background: "#F8FAFC",
//         accent: "#F59E0B",
//       },
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#14B8A6",
        secondary: "#0F172A",
        background: "#F8FAFC",
        accent: "#F59E0B",
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
}