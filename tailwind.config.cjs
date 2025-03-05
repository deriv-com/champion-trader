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
    extend: {
      colors: {
        "deep-blue": "#2f3f4f",
        "success-green": "#008832",
        "market-dark": "#111827",
        "dark-gray": "#1F2937",
        "alert-red": "#F12937",
      },
      fontFamily: {
        ibm: ["IBM Plex Sans", "sans-serif"],
        ubuntu: ["Ubuntu", "sans-serif"],
      },
      colors: {
        text: {
          primary: "#1E293B",
          secondary: "#64748B",
          highlight: "#10B981",
          error: "#DC2626",
        },
        background: {
          DEFAULT: "#ffffff",
          dark: "#121212",
          deep: "#0F172A",
        },
        sidebar: "#0E1A2B",
        border: {
          light: "#E5E7EB",
          dark: "#ccc",
        },
        order: {
          details: "#4B5563",
          "entry-exit": "#6B7280",
        },
        primary: {
          DEFAULT: "#007bff",
          dark: "#1e90ff",
        },
        error: '#C40000',
        dim: 'rgba(0, 0, 0, 0.24)',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        hover: "rgba(0, 0, 0, 0.08)",
        active: "rgba(0, 0, 0, 0.16)",
        market: "#f6f7f8",
        "market-dark": "#111827",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
