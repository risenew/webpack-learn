'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
/*HtmlWebpackPlugin插件可以为html中引入的外部资源动态添加每次compile后的hash，防止引入缓存的外部文件的问题*/
/*该插件也可以生成html入口文件*/
const HtmlWebpackPlugin = require('html-webpack-plugin')
/*Friendly-errors-webpack-plugin识别某些类别的webpack错误，并清理，聚合和优先级，以提供更好的开发人员体验*/
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'
/*用于webpack打包时拷贝文件的插件包*/
/*new CopyWebpackPlugin([{
　　　　from: path.resolve(__dirname, '../static'), //定义要拷贝的源目录，必填项
　　　　to: config.build.assetsSubDirectory, //定义要拷贝到的目标目录，非必填，不填写则拷贝到打包的output输出地址中
}])*/
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  /*name为app*/
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    /*css-loader和style-loader*/
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  /*我们使用 cheap 模式可以大幅提高 souremap 生成的效率*/
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    /*HotModuleReplacementPlugin*/
    /*热替换插件，应该是代码替换后页面更新的插件*/
    new webpack.HotModuleReplacementPlugin(),
    /*NoEmitOnErrorsPlugin*/
    /*在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误*/
    /*启用此插件后，webpack 进程遇到错误代码将不会退出*/
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    /*不配置任何选项的html-webpack-plugin插件，他会默认将webpack中的entry配置所有入口thunk和extract-text-webpack-plugin抽取的css样式都插入到文件指定的位置*/
    new HtmlWebpackPlugin({
      /*filename配置的html文件目录是相对于webpackConfig.output.path路径而言的，不是相对于当前项目目录结构的*/
      filename: 'index.html',
      template: 'index.html',
      favicon: './favicon.ico',
      /*向template或者templateContent中注入所有静态资源，不同的配置值注入的位置不经相同*/
      /*1、true或者body：所有JavaScript资源插入到body元素的底部
        2、head: 所有JavaScript资源插入到head元素中
        3、false： 所有静态资源css和JavaScript都不会注入到模板文件中*/
        /*这个插件还有许多功能，比如可以给引入的资源再加一层hash等等*/
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
