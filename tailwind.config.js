/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui token colors (driven by CSS variables in globals.css)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        // Abdin brand palette
        ink: "#08080a",
        graphite: "#15161a",
        graphite2: "#1d1f24",
        chrome: "#d7dadf",
        gold: {
          DEFAULT: "#c8964f",
          light: "#e8c785",
          deep: "#a6772f",
        },
        leather: {
          DEFAULT: "#6b4527",
          light: "#8a5a34",
          dark: "#3c2615",
        },
        cream: "#f3efe6",
      },
      fontFamily: {
        display: ["var(--font-display)", "Sora", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Manrope", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.28em",
      },
      backgroundImage: {
        "gold-grad": "linear-gradient(135deg, #e8c785 0%, #c8964f 45%, #a6772f 100%)",
        "chrome-grad": "linear-gradient(180deg, #ffffff 0%, #c7ccd3 40%, #7e848d 100%)",
        "hero-fade": "radial-gradient(120% 90% at 50% 0%, rgba(40,32,22,0.35) 0%, rgba(8,8,10,0.0) 55%)",
      },
      boxShadow: {
        glass: "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        goldglow: "0 0 40px rgba(200,150,79,0.35)",
      },
      rotate: {
        60: "60deg",
        70: "70deg",
      },
      brightness: {
        130: "1.3",
        135: "1.35",
        140: "1.4",
      },
      transitionDuration: {
        2000: "2000ms",
        4000: "4000ms",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        spinslow: {
          from: { transform: "translate(-50%, -50%) rotate(0deg)" },
          to: { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
        ringspin: {
          from: { transform: "translate(-50%, -50%) rotate(0deg)" },
          to: { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
      },
      animation: {
        floaty: "floaty 7s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        "spin-slow": "spinslow 5s linear infinite",
        "ring-spin": "ringspin 4s linear infinite",
      },
    },
  },
  plugins: [],
};
