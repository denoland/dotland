const withPreact = require("next-plugin-preact");

module.exports = withPreact({
  experimental: {
    modern: true,
    polyfillsOptimization: true,
  },
  redirects() {
    return [
      {
        source: "/manual.html",
        destination: "/manual",
        permanent: true,
      },
      {
        source: "/benchmarks.html",
        destination: "/benchmarks",
        permanent: true,
      },
      {
        source: "/posts",
        destination: "https://deno.com/blog",
        permanent: true,
      },
      {
        source: "/posts/:id",
        destination: "https://deno.com/blog/:id",
        permanent: true,
      },
    ];
  },
});
