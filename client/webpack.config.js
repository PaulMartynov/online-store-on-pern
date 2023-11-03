const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv");

module.exports = (env) => {
  const minifyOps = {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    collapseBooleanAttributes: true,
    removeScriptTypeAttributes: true,
  };
  const minimizer = [];
  const plugins = [
    new HtmlWebpackPlugin({
      favicon: "public/favicon.ico",
      filename: "index.html",
      template: "public/index.html",
      inject: "body",
      minify: env.production ? false : minifyOps,
    }),
  ];
  const babelLoaderOptions = {
    presets: ["@babel/preset-env"],
  };
  if (env.production) {
    babelLoaderOptions.plugins = ["babel-plugin-jsx-remove-data-test-id"];
    minimizer.push(
      new TerserPlugin({
        // default webpack plugin for js-optimization which should be configured: https://v4.webpack.js.org/configuration/optimization/#optimizationminimizer
        // speedest alternative of UglifyJS (it improves minifying js files)
        test: /\.m?js(\?.*)?$/i,
        // exclude: /\.m?js(\?.*)?$/i, // uncomment if we don't need uglifying (for debug purpose)
        extractComments: false, // disable extracting comments to a different file
        terserOptions: {
          toplevel: true, // https://github.com/terser/terser#minify-options
          output: {
            comments: false, // remove comments from files
          },
          mangle: {
            safari10: true, // for preventing Safari 10/11 bugs in loop scoping and await
          },
          compress: {
            pure_funcs: ["console.info", "console.debug", "console.warn"],
          }, // remove this functions when their return values are not used
        },
      }),
    );
  } else {
    Dotenv.config();
  }
  return {
    entry: { index: "./src/index.tsx" },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      environment: {
        arrowFunction: false,
      },
      clean: true,
      filename: "[name].[contenthash:8].js", // contenthash-this is version for avoding browser-cache issue: user always has to get the last version of files
      chunkFilename: "[name].[contenthash:8].js",
      publicPath: "/",
    },
    optimization: {
      // config is taken from vue-cli
      splitChunks: {
        // for avoiding duplicated dependencies across modules
        minChunks: 1, // Minimum number of chunks that must share a module before splitting.
        cacheGroups: {
          reactVendor: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            name: "vendor-react",
            priority: -5,
            chunks: "all",
          },
          defaultVendors: {
            name: "chunk-vendors", // move js-files from node_modules into splitted file [chunk-vendors].js
            test: /[\\/]node_modules[\\/]/, // filtering files that should be included
            priority: -10, // a module can belong to multiple cache groups. The optimization will prefer the cache group with a higher priority
            chunks: "initial", // type of optimization: [initial | async | all]
          },
          common: {
            name: "chunk-common", // move reusable nested js-files into splitted file [chunk-common].js
            minChunks: 2, // minimum number of chunks that must share a module before splitting
            priority: -20,
            chunks: "initial",
            reuseExistingChunk: true, // If the current chunk contains modules already split out from the main bundle, it will be reused instead of a new one being generated. This can impact the resulting file name of the chunk
          },
        },
      },
      minimizer,
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.(js|tsx|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: babelLoaderOptions,
          },
        },
        {
          test: /\.(css|scss)$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
        {
          test: /\.mp3$/i,
          type: "asset/resource",
        },
      ],
    },
    devServer: {
      compress: true,
      port: 9199,
      hot: true,
      historyApiFallback: true,
      proxy: {
        "/api/**": {
          target: `http://${process.env.BACKEND_ADDR}:${process.env.BACKEND_PORT}/`,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: { "http://10.10.20.117:5000": "localhost:9199" },
          withCredentials: true,
        },
      },
    },
  };
};
