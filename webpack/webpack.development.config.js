const webpack = require('webpack');
const path = require('path');
const rules = require('./webpack.rules');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '..', 'src', 'demo', 'index.tsx'),
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'starlight.dev.js',
    publicPath: '/'
  },
  devtool: 'eval',

  module: {
    rules
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '~': path.resolve(__dirname, '../src'),
    },
  },

  devServer: {
    historyApiFallback: true,
    hot: true,
    devMiddleware: {
      publicPath: '/'
    },
    static: {
      directory: path.resolve(__dirname, '..', 'dist'),
    }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Starlight playground',
      template: './src/demo/index.html',
      templateParameters: {
        mode: 'development',
      },
    }),
  ]
}
