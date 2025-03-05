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
      fontFamily: {
        ibm: ["IBM Plex Sans", "sans-serif"],
        ubuntu: ["Ubuntu", "sans-serif"],
      },
      colors: {
        textPrimaryColor: "#1E293B",
        backgroundLight: "#F3F4F6",
        backgroundDark: "#1F2937",
        borderLight: "#E5E7EB",
        backgroundSoft: "#F9FAFB",
        errorColor: "#DC2626",
        primaryColor: "#2563EB",
        secondaryTextColor: "#64748B",
        highlightColor: "#10B981",
        marketSelectorBorderColor: "#CBD5E1",
        guideTextColor: "#374151",
        orderDetailsTextColor: "#4B5563",
        entryExitDetailsTextColor: "#6B7280",
        loginErrorColor: "errorColor",
        marketTitleColor: "#1E3A8A",
        durationControllerBackground: "#111827",
        background: {
          DEFAULT: "#ffffff",
          dark: "#121212",
        },
        text: {
          DEFAULT: "#000000",
          dark: "#ffffff",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
