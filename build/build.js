'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

/*ora终端转轮*/
const ora = require('ora')
/*使用webpack build文件项目时每次都会生成一个dist目录，有时需要把dist目录里的所以旧文件全部删掉，除了可以使用rm -rf /dist/命令删除外，还可以使用rimraf /dist/命令；*/
const rm = require('rimraf')
const path = require('path')
/*在终端改变字体样式*/
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

/*config.build.assetsRoot:'/'
config.build.assetsSubDirectory:'static'*/
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
    /*对打包的配置化，如果打包的时候有错误我们就抛出错误，我们可以在webpack()回调里拿到一个stats打包状态，process.stdout.write跟console.log一个意思因为在node环境里console.log也是用process封装的就是向cli里打印输出。但是输出的时候进行了一些格式化。 colors ： 让打包的时候有颜色。 module : 去掉内置模块信息 children ：去掉子模块 chunks : 增加包信息（设置为 false 能允许较少的冗长输出）chunkModules : 去除包里内置模块的信息*/
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
      /*process.stdout  一个指向标准输出流(stdout)的 可写的流(Writable Stream)：*/
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }
    /*cyan:青色*/
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      // '  Tip: built files are meant to be served over an HTTP server.\n' +
      // '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})

