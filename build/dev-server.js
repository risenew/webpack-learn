'use strict'
/*如果版本不对或版本过旧会报一些warning*/
require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  /*{
     NODE_ENV: '"production"',
     NODE_ENV: '"development"'
  }*/
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
/*端口号*/
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
/*是否自动打开浏览器*/
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  /*quiet - 设置为true禁用所有控制台日志记录。*/
  quiet: true
})

/*webpack-hot-middleware是用来进行页面的热重载的，刷新浏览器一般和webpack-dev-middleware配合使用，实现热加载*/
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  /*log - 用于记录行的函数，传递false到禁用。默认为console.log*/
  log: false,
  /*heartbeat - 多长时间将心跳更新发送到客户端以保持连接的活动。应小于客户的timeout设置 - 通常设置为其一半值*/
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// proxy api requests
/*http-proxy-middleware用于后台将请求转发给其它服务器。*/
/*这个一般是用来设置代理的，跨域的*/
/*config.dev.proxyTable为{}*/
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
/*当用户单击刷新按钮或直接通过输入地址的方式访问页面时，会出现找不到页面的问题，因为这两种方式都绕开了 History API，而我们的请求又找不到后端对应的路由，页面返回 404 错误。
connect-history-api-fallback 中间件很好的解决了这个问题*/
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
/*相当于app.use('/static/',express.static('./static'))*/
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
/*portfinder 帮你自动获取可用端口*/
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port)
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
