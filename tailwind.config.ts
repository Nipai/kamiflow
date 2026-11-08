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
        kami: {
          50: "#f4f6f4",
          100: "#e6eae6",
          200: "#cfd7cf",
          300: "#b0bfb0",
          400: "#8fa290",
          500: "#6f8270",
          600: "#5c6d60", // Primary accent color #5c6d60
          700: "#49574d",
          800: "#3c473f",
          900: "#323b35",
          950: "#1a201c",
          DEFAULT: "#5c6d60",
        },
        primary: {
          DEFAULT: "#5c6d60",
          hover: "#49574d",
          light: "#e6eae6",
          foreground: "#ffffff",
        },
        background: {
          DEFAULT: "#faf9f6",
          card: "#ffffff",
          muted: "#f3f4f1",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.02)",
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px -1px rgba(0, 0, 0, 0.02)",
        card: "0 10px 30px -10px rgba(92, 109, 96, 0.08)",
        floating: "0 20px 40px -15px rgba(92, 109, 96, 0.12)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
