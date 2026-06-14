import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens — section 2 of the build spec. Non-negotiable.
        green: "#1F6B4A", // brand, heading accents, trust panel
        greenSoft: "#E8F2EC", // pale wash, image placeholders
        greenLine: "#CDE3D6", // hairline borders
        ink: "#13201A", // primary text
        sub: "#5C6B63", // muted text
        orange: "#F26A1B", // ACTION BUTTONS ONLY (Add, Checkout, Pay, Send code)
        orangeDark: "#D9550A", // action hover
        cream: "#FBFAF7", // page canvas
      },
      fontFamily: {
        // Fraunces (display) + Inter (body/UI), loaded via next/font in layout.
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderColor: {
        DEFAULT: "#CDE3D6",
      },
    },
  },
  plugins: [],
};

export default config;
