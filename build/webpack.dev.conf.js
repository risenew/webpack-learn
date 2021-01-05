'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new CopyWebpackPlugin([
      { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }
    ]),
    new CopyWebpackPlugin([
      { from: path.join(cesiumSource, 'Assets'), to: 'Assets' }
    ]),
    new CopyWebpackPlugin([
      { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }
    ]),
    // new CopyWebpackPlugin([
    //   {
    //     from: path.join(cesiumSource, 'ThirdParty/Workers'),
    //     to: 'ThirdParty/Workers'
    //   }
    // ]),
    new webpack.DefinePlugin({
      CESIUM_BASE_URL: JSON.stringify('')
    }),
    // new CopyWebpackPlugin([{from: path.join('./static', 'model'), to: 'model3D'}]),
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      favicon: './favicon.ico',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
