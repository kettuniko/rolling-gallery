'use strict'
const webpack = require('webpack')

const useOptimizedBuild = process.argv.includes('-p')
const plugins = useOptimizedBuild
  ? [new webpack.optimize.ModuleConcatenationPlugin()]
  : []

module.exports = {
  entry: './src/main.js',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins
}
