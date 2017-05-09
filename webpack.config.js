const webpack = require("webpack");
const path = require("path");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssets = require("optimize-css-assets-webpack-plugin");

let config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js"
  },
  plugins: [new ExtractTextWebpackPlugin("styles.css")],
  module: {
    rules: [
      {
        test: /\.js$/, // files ending with .js
        exclude: /node_modules/, // exclude the node_modules directory
        loader: "babel-loader" // use this (babel-core) loader
      },
      {
        test: /\.scss$/,
        loader: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        loader: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.jsx$/, // all files ending with .jsx
        loader: "babel-loader", // use the babel-loader for all .jsx files
        exclude: /node_modules/ // exclude searching for files in the node_modules directory
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          "file-loader?context=src/assets/images/&name=images/[path][name].[ext]",
          {
            loader: "image-webpack-loader",
            query: {
              mozjpeg: {
                progressive: true
              },
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 4
              },
              pngquant: {
                quality: "75-90",
                speed: 3
              }
            }
          }
        ],
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./src"),
    historyApiFallback: true,
    inline: true,
    open: false
  },
  devtool: "eval-source-map"
};

module.exports = config;

if (process.env.NODE_ENV === "production") {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin(), // call the uglify plugin
    new OptimizeCSSAssets() //call the css optimizer(minify)
  );
}
