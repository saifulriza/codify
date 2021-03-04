const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require("path");
module.exports = {
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      scss: {
        additionalData: `@import "./node_modules/bootstrap/scss/bootstrap";`,
      },
      css: {
        // Note: the following config format is different between Vue CLI v4 and v3
        // For Vue CLI v3 users, please refer to css-loader v1 documentations
        // https://github.com/webpack-contrib/css-loader/tree/v1.0.1
        modules: {
          localIdentName: "[name]-[hash]",
        },
        localsConvention: "camelCaseOnly",
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: { find: "@", replacement: path.resolve(__dirname, "src") },
    },
    plugins: [
      new MonacoWebpackPlugin(),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          safe: true,
          discardComments: {
            removeAll: true,
          },
        },
      }),
    ],
  },
};
