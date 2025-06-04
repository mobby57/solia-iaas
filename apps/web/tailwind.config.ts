import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1F2937",   // bleu nuit
        secondary: "#60A5FA", // bleu clair
        accent: "#10B981",    // vert
      },
    },
  },
  plugins: [],
};

export default config;
