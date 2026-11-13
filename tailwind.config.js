/** @type {import('tailwindcss').Config} */
/**
 * Kaboz design tokens — multi-accent retail system.
 * Brand orange stays primary; blue / gold / green / red follow Onsus + Adarc.
 * Prefer these tokens over arbitrary hex in components.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1515px",
    },
    extend: {
      colors: {
        kaboz: {
          orange: "#F06418",
          "orange-dark": "#D4550F",
          "orange-soft": "#FFF4ED",
          // Link / info blue
          blue: "#004EC3",
          "blue-dark": "#003A94",
          "blue-soft": "#E8F1FC",
          // Accent purple (CTAs / active nav)
          purple: "#F06418",
          "purple-dark": "#D4550F",
          "purple-soft": "#FFF4ED",
          // Badge / star gold (sparing use)
          gold: "#FFE000",
          "gold-dark": "#CA8A04",
          "gold-soft": "#FFF8CC",
          // Best-seller / success green
          green: "#16803C",
          "green-dark": "#126532",
          "green-soft": "#E7F6EC",
          // Former sale/urgency red — remapped to brand orange
          red: "#F06418",
          "red-dark": "#D4550F",
          "red-soft": "#FFF4ED",
          // Price accent
          price: "#F06418",
          ink: "#212B36",
          slate: "#333E48",
          mute: "#6B7280",
          faint: "#999999",
          line: "#E8E8E8",
          "line-soft": "#EEEEEE",
          soft: "#F7F7F7",
          nav: "#F5F5F5",
          dark: "#1A1A1A",
          sale: "#F06418",
          new: "#FFE000",
          star: "#FAC100",
          focus: "#6D28D9",
        },
      },
      maxWidth: {
        store: "1860px",
        prose: "720px",
        content: "1200px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        section: "3.5rem",
        "section-sm": "2rem",
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Sora"', "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["2.25rem", { lineHeight: "1.15", fontWeight: "700" }],
        "display-lg": ["1.875rem", { lineHeight: "1.2", fontWeight: "700" }],
        "display-md": ["1.5rem", { lineHeight: "1.25", fontWeight: "700" }],
        "title-lg": ["1.25rem", { lineHeight: "1.3", fontWeight: "700" }],
        "title-md": ["1.125rem", { lineHeight: "1.35", fontWeight: "600" }],
        "body-lg": ["1rem", { lineHeight: "1.6" }],
        "body-md": ["0.875rem", { lineHeight: "1.55" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5" }],
        "caption": ["0.6875rem", { lineHeight: "1.4" }],
        "price": ["1.25rem", { lineHeight: "1.2", fontWeight: "700" }],
      },
      borderRadius: {
        card: "6px",
        control: "6px",
        pill: "9999px",
      },
      boxShadow: {
        header: "0 8px 24px rgba(15, 15, 15, 0.08)",
        mega: "0 18px 50px rgba(15, 15, 15, 0.14)",
        card: "0 2px 8px rgba(15, 15, 15, 0.06)",
        focus: "0 0 0 3px rgba(240, 100, 24, 0.35)",
        sticky: "0 -6px 24px rgba(15, 15, 15, 0.12)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
      },
      zIndex: {
        header: "40",
        mega: "50",
        drawer: "60",
        sticky: "45",
        modal: "70",
      },
    },
  },
  plugins: [],
};
