/* eslint-disable @typescript-eslint/no-var-requires */
const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src", "index.ts"),
  target: "node",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "server.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new ESLintPlugin({ extensions: "ts" })],
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: "ts-loader",
      },
    ],
  },
};
