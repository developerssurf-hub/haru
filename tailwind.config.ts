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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#D14777",
          dark: "#A0365B",
        },
        accent: "#FF85A1",
        footer: "#FDF1F5",
        text: {
          DEFAULT: "#2D2D2D",
          muted: "#6B7280",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
