module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
      mono: ["Ubuntu Mono", "monospace"],
    },
    extend: {
      gridTemplateColumns: {
        "movements-table": "200px 180px 200px 1fr",
      },
    },
  },
  plugins: [],
};
