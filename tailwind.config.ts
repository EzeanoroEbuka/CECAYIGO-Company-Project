import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Semantic tokens (wired to CSS variables) ── */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        /* ── CEC AYIGO Brand Palette (hardcoded) ── */
        brand: {
          /* Red — primary action color */
          red: "#E51E25",
          "red-dark": "#B91C1C",
          "red-light": "#FF4D52",
          "red-muted": "#E51E2520",

          /* Sky Blue — secondary / accent */
          blue: "#38BDF8",
          "blue-dark": "#0284C7",
          "blue-light": "#7DD3FC",
          "blue-muted": "#38BDF820",

          /* Cream — brand background / surface */
          cream: "#FAF5EB",
          "cream-dark": "#F4EBD8",
          "cream-muted": "#ECE0C3",
          "cream-deep": "#D9CEB0",

          /* Dark backgrounds */
          dark: "#0B0F1A" /* deepest — page bg */,
          "dark-card": "#111827" /* card bg */,
          "dark-elevated": "#1A2236" /* elevated card */,
          "dark-border": "#242E45" /* borders */,
          "dark-muted": "#1E2840" /* muted surfaces */,
        },

        /* ── Cream palette (light-mode surfaces) ── */
        cream: {
          50: "#FDFBF7",
          100: "#FAF5EB",
          200: "#F4EBD8",
          300: "#ECE0C3",
          400: "#D9CEB0",
          DEFAULT: "#FAF5EB",
        },

        /* ── Sky blue shades ── */
        sky: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          DEFAULT: "#38BDF8",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      backgroundImage: {
        /* Brand gradient overlays */
        "brand-gradient": "linear-gradient(135deg, #E51E25 0%, #B91C1C 100%)",
        "blue-gradient": "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
        "cream-gradient": "linear-gradient(135deg, #FAF5EB 0%, #F4EBD8 100%)",
        "dark-gradient":
          "linear-gradient(135deg, #0B0F1A 0%, #111827 50%, #0F172A 100%)",

        /* Hero section gradients */
        "hero-dark":
          "linear-gradient(135deg, #0B0F1A 0%, #0F1629 40%, #111827 100%)",
        "hero-light":
          "linear-gradient(135deg, #FAF5EB 0%, #F0EAD6 50%, #E8DEC8 100%)",

        /* Card overlays */
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
      },

      boxShadow: {
        "brand-red": "0 4px 20px rgba(229, 30, 37, 0.25)",
        "brand-blue": "0 4px 20px rgba(56, 189, 248, 0.25)",
        "card-dark": "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-light": "0 4px 24px rgba(0, 0, 0, 0.08)",
        "glow-red": "0 0 30px rgba(229, 30, 37, 0.35)",
        "glow-blue": "0 0 30px rgba(56, 189, 248, 0.35)",
        xs: "0 1px 2px rgba(0,0,0,0.06)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(229, 30, 37, 0.4)" },
          "70%": { boxShadow: "0 0 0 10px rgba(229, 30, 37, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(229, 30, 37, 0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 3s infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
