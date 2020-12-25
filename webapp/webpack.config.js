const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    app: './index.tsx',
  },
  output: {
    filename: 'bundle.js',
    publicPath: '/',
  },
  target: 'web',
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    disableHostCheck: true,
    port: 8000,
    host: "0.0.0.0"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          "@teamsupercell/typings-for-css-modules-loader",
          {
            loader: "css-loader",
            options: { modules: true }
          }
        ]
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'index.html')
    }),
    new CopyPlugin({
      patterns: [
        { from: "**/*.css" },
      ],
    }),
  ]
};
