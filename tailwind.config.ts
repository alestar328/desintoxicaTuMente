import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF5C35",
          light: "#FF8562",
          dark: "#D94420",
        },
        ocean: "#0EA5E9",
        sand: "#F5ECD7",
        green: "#22C55E",
        ink: {
          DEFAULT: "#1A1A2E",
          light: "#4A4A6A",
        },
        surface: "#FAFAF8",
        border: "#E8E4DC",
        card: "#FFFFFF",
        category: {
          exterior: "#22C55E",
          playa: "#0EA5E9",
          artistica: "#A855F7",
          social: "#F59E0B",
          aprendizaje: "#FF5C35",
          deporte: "#EF4444",
        },
      },
      fontFamily: {
        display: ["var(--font-plus-jakarta)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      maxWidth: {
        content: "1280px",
        text: "720px",
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-slide-up": "fadeSlideUp 400ms ease forwards",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
