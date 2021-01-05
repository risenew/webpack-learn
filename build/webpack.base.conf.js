'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const webpack = require('webpack')
const cesiumSource = '../node_modules/cesium/Source'
const CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve(dir) {
  // 将路径合成一个路径，例如/目录1/目录2/目录3
  return path.join(__dirname, '..', dir)
}

module.exports = {
  /*入口*/
  entry: {
    app: ["event-source-polyfill", "babel-polyfill", "./src/main.js"]
  },
  /*输出*/
  output: {
    /*config.build.assetsRoot为dist文件夹*/
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath,
    /*sourcePrefix默认为''，可以不用管*/
    sourcePrefix: ''
  },
  /*对amd语法的支持，没有amd语法的可以不要*/
  amd: {
　　  toUrlUndefined: true
  },
  /*解析*/
  resolve: {
    //resolve.extensions  自动解析确定的扩展,默认值是['.js','.json']
    //使得用户在引入时可以不带扩展，如import loading from '@/component/loading.vue'可以写作import loading from '@/component/loading'
    extensions: ['.js', '.vue', '.json'],
    //resolve.alias  创建 import 或 require 的别名，来确保模块引入变得更简单。例如，一些位于 src/ 文件夹下的常用模块
    alias: {
      //也可以在给定对象的键后的末尾添加 $，以表示精准匹配
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      //path.resolve也是一种路径拼接工具
      cesium: path.resolve(__dirname, cesiumSource)
    }
  },
  /*模块*/
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [resolve('src'), resolve('test')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('/node_modules/element-ui/src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
         test:/\.scss$/,
         use:[
          {loader:"style-loader"},
          {loader:"css-loader"},
          {loader:"scss-loader"}
          ]   
      }
    ],
    // 模块上下文，应该避免使用下面2个属性
    unknownContextRegExp: /^.\/.*$/,
    unknownContextCritical:false
  },
  /*插件*/
  plugins: [
      /*webpack配置ProvidePlugin后，在使用时将不再需要import和require进行引入，直接使用即可。*/
      new webpack.ProvidePlugin({
        $: "jquery",
      })
  ],
}
