import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#10131a",
          dim: "#10131a",
          bright: "#363941",
          lowest: "#0b0e15",
          low: "#191b23",
          container: "#1d2027",
          high: "#272a31",
          highest: "#32353c",
        },
        "on-surface": "#e1e2ec",
        "on-surface-variant": "#c2c6d6",
        outline: {
          DEFAULT: "#8c909f",
          variant: "#424754",
        },
        primary: {
          DEFAULT: "#adc6ff",
          container: "#4d8eff",
          on: "#002e6a",
        },
        secondary: {
          DEFAULT: "#c0c1ff",
          container: "#3131c0",
          on: "#1000a9",
        },
        tertiary: {
          DEFAULT: "#ddb7ff",
          container: "#b76dff",
          on: "#490080",
        },
        emerald: {
          glow: "#6ee7b7",
        },
        error: {
          DEFAULT: "#ffb4ab",
          container: "#93000a",
        },
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "serif"],
        body: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      spacing: {
        gutter: "24px",
        "stack-sm": "8px",
        "stack-md": "24px",
        "stack-lg": "48px",
        "stack-xl": "96px",
      },
      maxWidth: {
        container: "1280px",
      },
      letterSpacing: {
        display: "-0.04em",
        headline: "-0.02em",
        label: "0.05em",
      },
      backgroundImage: {
        "electric-gradient":
          "linear-gradient(45deg, #4d8eff 0%, #3131c0 55%, #b76dff 100%)",
        "text-gradient": "linear-gradient(90deg, #adc6ff 0%, #4d8eff 45%, #b76dff 100%)",
      },
      boxShadow: {
        "glow-primary": "0 0 48px 0 rgba(77, 142, 255, 0.15)",
        "glow-secondary": "0 0 48px 0 rgba(49, 49, 192, 0.15)",
        "glow-tertiary": "0 0 48px 0 rgba(183, 109, 255, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
