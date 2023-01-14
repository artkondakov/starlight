const webpack = require('webpack');
const path = require('path');
const rules = require('./webpack.rules');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '..', 'src', 'index.tsx'),
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'index.js',
    publicPath: './',
    libraryTarget: 'umd'
  },

  module: {
    rules
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '~': path.resolve(__dirname, '../src'),
    },
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
  ]
}
