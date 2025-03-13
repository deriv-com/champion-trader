/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        error: "#C40000",
        dim: "rgba(0, 0, 0, 0.24)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        hover: "rgba(0, 0, 0, 0.08)",
        active: "rgba(0, 0, 0, 0.16)",
        market: {
          DEFAULT: "#f6f7f8",
        },
        text: {
          primary: "rgba(0, 0, 0, 0.72)",
          secondary: "rgba(0, 0, 0, 0.48)",
          tertiary: "rgba(0, 0, 0, 0.24)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        color: {
          solid: {
            emerald: {
              700: "rgba(0, 195, 144, 1)",
              600: "rgba(0, 195, 144, 0.8)",
            },
            cherry: {
              700: "rgba(222, 0, 64, 1)",
              600: "rgba(222, 0, 64, 0.8)",
            },
            glacier: {
              700: "rgba(0, 208, 255, 1)",
              600: "rgba(0, 208, 255, 0.8)",
            },
          },
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        "pulse-bg": {
          "0%, 100%": { backgroundColor: "var(--skeleton-bg-from, #e5e7eb)" },
          "50%": { backgroundColor: "var(--skeleton-bg-to, #d1d5db)" }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-bg": "pulse-bg 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
