import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        base: "#0A0F1E",
        primary: "#00D4FF",
        secondary: "#F5C842",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)"],
        syne: ["var(--font-syne)"],
      },
    },
  },
  plugins: [],
};
export default config;
