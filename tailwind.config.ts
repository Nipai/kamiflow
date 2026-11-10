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
          50: "#f7f8f6",
          100: "#e9ede7",
          200: "#d5ded2",
          300: "#b7c5b3",
          400: "#94a78e",
          500: "#748a6e",
          600: "#5c6d60", // Primary calming sage green #5c6d60
          700: "#49574d",
          800: "#3d4840",
          900: "#323b35",
          950: "#1a201c",
          DEFAULT: "#5c6d60",
        },
        sand: {
          50: "#faf9f5",
          100: "#f4f2ec",
          200: "#e8e5db",
          300: "#d7d2c3",
          400: "#beb6a2",
          500: "#a39982",
          600: "#857b66",
          700: "#696150",
          800: "#524c3f",
          900: "#3e3930",
        },
        brass: {
          300: "#e2c99b",
          400: "#d1b37b",
          500: "#bfa065",
          600: "#a3844a",
          700: "#806637",
        },
        primary: {
          DEFAULT: "#5c6d60",
          hover: "#49574d",
          light: "#e9ede7",
          foreground: "#ffffff",
        },
        background: {
          DEFAULT: "#faf9f6",
          card: "#ffffff",
          muted: "#f4f2ec",
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
        zen: "0 12px 36px -12px rgba(60, 71, 63, 0.08), 0 2px 8px -2px rgba(60, 71, 63, 0.04)",
      },
      fontFamily: {
        serif: [
          "var(--font-serif)",
          "Cormorant Garamond",
          "Playfair Display",
          "Georgia",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "Plus Jakarta Sans",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      letterSpacing: {
        zen: "0.02em",
        relaxed: "0.04em",
        widest: "0.15em",
      },
    },
  },
  plugins: [],
};

export default config;
