import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        space: ["var(--font-space-grotesk)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      colors: {
        bgPrimary: "#131313",
        bgSecondary: "#0E0E0E",
        surfaceCard: "#1C1B1B",
        borderDark: "#444748",
        textMuted: "#8E9192",
        textSecondary: "#C4C7C8",
        textLabel: "#E5E2E1",
        textBtnDark: "#2F3131",
        brandRed: "#CC003C",
        whatsappGreen: "#25D366",
      },
    },
  },
  plugins: [],
};
export default config;
