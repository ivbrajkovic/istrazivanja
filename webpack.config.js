const { resolve } = require("path");

const TerserJSPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const CopyPlugin = require("copy-webpack-plugin");

module.exports = env => {
  const { NODE_ENV = "development", analyze = false, devtools = "eval" } =
    env || {};

  /**
   * Envoirement mode
   */
  const devMode = NODE_ENV === "development";

  console.log("Mode:", NODE_ENV);
  console.log("Devtools:", (devMode && devtools) || false);
  console.log("Boundle analyze:", analyze);

  /**
   * Minimizer
   */
  const minimizer = devMode
    ? []
    : [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})];

  /**
   * Plugins
   */
  const plugins = [
    // Html parser
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
      // minify: devMode
      //   ? {}
      //   : {
      //       removeAttributeQuotes: true,
      //       collapseWhitespace: true,
      //       removeComments: true
      //     }
    })
  ];
  // Clean dist folder
  !devMode && plugins.unshift(new CleanWebpackPlugin());
  !devMode &&
    plugins.push(
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        // filename: "[name].[contenthash].css",
        filename: "style.[contenthash].css",
        chunkFilename: "[id].[contenthash].css"
      })
    );
  // Copy static assets
  // !devMode && plugins.push(new CopyPlugin([{ from: "./src/img", to: "img" }]));
  // Bundle analizer
  analyze && plugins.push(new BundleAnalyzerPlugin());

  /**
   * Autoprefixer
   */
  const autoprefixer = {
    loader: "postcss-loader",
    options: {
      ident: "postcss",
      plugins: [require("autoprefixer")]
    }
  };

  return {
    mode: devMode ? "development" : "production",

    entry: {
      main: "./src/js/index.js",
      fa: "./src/js/fa.js"
    },

    output: {
      filename: devMode ? "[name].bundle.js" : "[name].[contentHash].js",
      path: resolve(__dirname, "dist")
    },

    devtool: (devMode && devtools) || false,

    optimization: {
      usedExports: true,
      minimizer: minimizer,
      splitChunks: {
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/]((react).*)[\\/]/,
            name: "react",
            chunks: "all"
          },
          commons: {
            test: /[\\/]node_modules[\\/]((?!react).*)[\\/]/,
            name: "common",
            chunks: "all"
          }
        }
      }
    },

    plugins: plugins,

    module: {
      rules: [
        // JS loader
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          include: resolve(__dirname, "src"),
          use: [
            {
              loader: "babel-loader",
              options: {
                babelrc: true
              }
            }
          ]
        },

        // Style loader
        {
          test: /\.(sa|sc|c)ss$/i,
          // exclude: /node_modules/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            autoprefixer
          ]
        },

        // // other stuff above.....
        // {
        //   test: /\.(html)$/,
        //   exclude: /node_modules/,
        //   use: {
        //     loader: "html-loader",
        //     options: {
        //       // THIS will resolve relative URLs to reference from the app/ directory
        //       root: resolve(__dirname, "src")
        //     }
        //   }
        // },

        // HTML loader
        {
          test: /\.(html)$/,
          exclude: /node_modules/,
          use: {
            loader: "html-loader",
            options: {
              attrs: ["img:src", "a:href"]
              //   // root: resolve(__dirname, "src")
            }
          }
        },

        // Image loader
        {
          test: /\.(svg|png|jpe?g|gif)$/i,
          exclude: /node_modules/,
          // include: resolve(__dirname, "src/img"),
          use: {
            loader: "file-loader",
            options: {
              // name: "[name].[ext]",
              // name: "[name].[hash].[ext]",
              // outputPath: "imgs"
              // root: resolve(__dirname, "src")
              name: "[name].[hash].[ext]",

              // ! Important for html template assets
              esModule: false,
              outputPath: "img/",
              publicPath: "img/"
            }
          }
        }
      ]
    },

    resolve: {
      alias: {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat"
        // Must be below test-utils
      }
    }
  };
};
