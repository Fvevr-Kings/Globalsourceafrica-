import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- v1 marketplace tokens (retained during the v2 transition) ---
        green: "#1F6B4A", // brand, heading accents, trust panel
        greenSoft: "#E8F2EC", // pale wash, image placeholders
        greenLine: "#CDE3D6", // hairline borders
        ink: "#13201A", // primary text
        sub: "#5C6B63", // muted text
        orange: "#F26A1B", // ACTION BUTTONS ONLY (Add, Checkout, Pay, Send code)
        orangeDark: "#D9550A", // action hover
        cream: "#FBFAF7", // page canvas

        // --- v2 sourcing-service tokens (PRD §3.2) ---
        navy: "#0B2239", // dark sections, nav, footer
        container: "#E8622C", // primary accent — CTAs, hero container livery
        paper: "#F6F4EF", // light "shipping manifest" section backgrounds
        steel: "#6B7683", // secondary text, borders, corrugation lines
        cleared: "#1E7A4F", // verification badges / success only
      },
      fontFamily: {
        // v1: Outfit (display) + Inter (body), via next/font in layout.
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // v2: Archivo Expanded (display) + IBM Plex Mono (labels/data).
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderColor: {
        DEFAULT: "#CDE3D6",
      },
    },
  },
  plugins: [],
};

export default config;
