/** @type {import('tailwindcss').Config} */
export default {
  // Enable class-based dark mode so ThemeContext can toggle it.
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      // Brand colour palette
      colors: {
        primary: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Priority level colours
        priority: {
          low:      "#22c55e",
          medium:   "#f59e0b",
          high:     "#f97316",
          critical: "#ef4444",
        },
        // Status colours
        status: {
          pending:     "#f59e0b",
          inprogress:  "#3b82f6",
          resolved:    "#22c55e",
          rejected:    "#ef4444",
          escalated:   "#8b5cf6",
        },
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },

      boxShadow: {
        card:  "0 1px 3px 0 rgba(0,0,0,.06), 0 1px 2px -1px rgba(0,0,0,.04)",
        panel: "0 4px 24px -4px rgba(0,0,0,.08)",
        glow:  "0 0 24px 0 rgba(59,130,246,.25)",
      },

      animation: {
        "fade-in":    "fadeIn .3s ease-out",
        "slide-up":   "slideUp .35s ease-out",
        "slide-down": "slideDown .35s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },

      keyframes: {
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideDown: { from: { opacity: "0", transform: "translateY(-16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #2563eb 70%, #3b82f6 100%)",
      },
    },
  },

  plugins: [],
};
