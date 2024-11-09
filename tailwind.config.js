// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path to match your project's file structure
  ],
  theme: {
    extend: {
      height: {
        112: "28rem", // Custom height for 112
        128: "32rem", // Custom height for 128
        134: "36rem", // Custom height for 128
        140: "40rem", // Custom height for 128
      },
    },
  },
  plugins: [],
};
