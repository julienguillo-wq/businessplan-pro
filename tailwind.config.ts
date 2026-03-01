import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#E8EEF2",
          100: "#C5D5DE",
          200: "#9FB8C8",
          300: "#789BB2",
          400: "#5A85A2",
          500: "#3D6F92",
          600: "#2D5A7A",
          700: "#1B4965",
          800: "#133750",
          900: "#0D1B2A",
        },
        cyan: {
          50: "#EBF6FA",
          100: "#C9E8F2",
          200: "#A4D9E9",
          300: "#7FCADF",
          400: "#62B6CB",
          500: "#4A9DB3",
          600: "#3A8299",
          700: "#2B6780",
          800: "#1D4D66",
          900: "#0F334D",
        },
        bg: "#F8FAFB",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
