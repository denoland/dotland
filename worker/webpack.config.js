const path = require("path");
const webpack = require("webpack");

const mode = process.env.NODE_ENV || "production";

module.exports = {
  output: {
    filename: `worker.${mode}.js`,
    path: path.join(__dirname, "dist")
  },
  devtool: "source-map",
  mode,
  resolve: {
    extensions: [".js"],
    plugins: []
  },
  module: {
    rules: [{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" }]
  }
};
