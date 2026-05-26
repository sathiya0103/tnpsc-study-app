/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./MainApp.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1a237e",
        primaryLight: "#534bae",
        primaryDark: "#000051",
        background: "#f5f5f5",
        surface: "#ffffff",
        textPrimary: "#212121",
        textSecondary: "#757575",
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
      },
    },
  },
  plugins: [],
};
