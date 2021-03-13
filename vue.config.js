const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const incstr = require("incstr");
const path = require("path");
const createUniqueIdGenerator = () => {
  const index = {};

  const generateNextId = incstr.idGenerator({
    alphabet: "abcdefghijklmnopqrstuvwxyz0123456789_-",
  });

  return (name) => {
    if (index[name]) {
      return index[name];
    }

    let nextId;

    do {
      nextId = generateNextId();
    } while (/^[0-9_-]/.test(nextId));

    index[name] = generateNextId();

    return index[name];
  };
};

const idLocal = createUniqueIdGenerator(),
  idComponent = createUniqueIdGenerator();

const generateScopedName = (localName, resourcePath) => {
  const componentName = resourcePath
    .split("/")
    .slice(-2)
    .join("/");
  return idComponent(componentName).toUpperCase() + idLocal(localName);
};

const getLocalIdent = (context, localIdentName, localName) =>
  generateScopedName(localName, context.resourcePath);
global.getLocalIdent = getLocalIdent;

module.exports = {
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      scss: {
        additionalData: `@import "./node_modules/bootstrap/scss/bootstrap";`,
      },
      css: {
        modules: {
          getLocalIdent: (context, localIdentName, localName, options) => {
            return generateScopedName(localName, context.resourcePath + "");
          },
        },
        localsConvention: "asIs",
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
