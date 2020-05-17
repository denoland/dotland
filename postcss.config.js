const purgecss = [
  "@fullhuman/postcss-purgecss",
  {
    content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
    defaultExtractor: (content) => content.match(/[\w-/.:]+(?<!:)/g) || [],
  },
];
module.exports = {
  plugins: [
    "tailwindcss",
    "autoprefixer",
    ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  ],
};
