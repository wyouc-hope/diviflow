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
        bg: "var(--bg)",
        bg2: "var(--bg2)",
        bg3: "var(--bg3)",
        border: "var(--border)",
        border2: "var(--border2)",
        black: "var(--black)",
        ink: "var(--ink)",
        dim: "var(--dim)",
        mid: "var(--mid)",
        lite: "var(--lite)",
        ghost: "var(--ghost)",
        up: "var(--up)",
        up2: "var(--up2)",
        "up-dim": "var(--up-dim)",
        "up-dim2": "var(--up-dim2)",
        down: "var(--down)",
        "down-dim": "var(--down-dim)",
      },
    },
  },
  plugins: [],
};
export default config;
