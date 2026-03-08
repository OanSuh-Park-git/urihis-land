import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A2518",
        secondary: "#B5996E",
        accent: "#900C3F",
        parchment: "#F5F0E8",
        ink: "#1A1A1A",
      },
      fontFamily: {
        serif: ["var(--font-nanum-myeongjo)", "var(--font-noto-serif-kr)", "Georgia", "serif"],
        sans: ["var(--font-noto-sans-kr)", "sans-serif"],
      },
      backgroundImage: {
        "parchment-texture": "url('/images/parchment-bg.jpg')",
      },
    },
  },
  plugins: [],
};
export default config;
