'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
/*ExtractTextPlugin*/
/*将css模块和js模块分开打包，换句话说把css代码从js文件中抽离出来，单独出一个模块*/
/*在loader中，对.vue文件也做css的抽离。让.vue组件中的所有的css也能正常抽离出来。
2、plugins中ExtractTextPlugin的allChunks要设置成true，然后配合上要点1，这样就可以顺利的将所有vue组件中的css都提取出来。*/
const ExtractTextPlugin = require('extract-text-webpack-plugin')
/*OptimizeCSSPlugin*/
/*压缩单独的css文件*/
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
/*js压缩插件*/
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const env = config.build.env

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      /*是否生成map文件*/
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    /*定义node.js的全局变量process对象的env属性 设置为{
            NODE_ENV: '"development"'和NODE_ENV: '"production"'
    }*/
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true
        }
      },
      sourceMap: config.build.productionSourceMap,
      /*使用多进程来提高构建速度*/
      parallel: true
    }),
    // 另外一种写法
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     drop_debugger: true,
    //     drop_console: true
    //   },
    //   sourceMap: true
    // }),
    
    /*应该是将vue中的css提取到单独的css文件中*/
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    /*来自不同组件的重复CSS可以被删除*/
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      favicon: './favicon.ico',
      inject: true,
      /*html压缩相关参数*/
      minify: {
        /*移除html的注释*/
        removeComments: true,
        /*折叠空白区域*/
        collapseWhitespace: true,
        /*删除属性注释*/
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      /* 允许指定的thunk在插入到html文档前进行排序*/
      /*要配合CommonsChunkPlugin插件使用*/
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vender modules does not change
    /*该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境*/
    new webpack.HashedModuleIdsPlugin(),

    // split vendor js into its own file
    /*抽取依赖*/
    /*将依赖的js分割进自己的文件*/
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // any required modules inside node_modules are extracted to vendor
        /*node_modules中的任何必需模块都被提取到vendor*/
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    /*将webpack运行时和模块清单提取到它自己的文件中，以便当app bundle被更新时，防止供应商散列被更新*/
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    /*复制static文件夹下的静态资源*/
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
})

/*开启gzip加速，需要服务器配合*/
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

/*可视化分析包大小*/
/*打包出的文件包含哪些，大小占比如何，模块包含关系，依赖项，文件是否重复，压缩后大小如何*/
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
