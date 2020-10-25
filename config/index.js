'use strict'
const path = require('path')
const devEnv = require('./dev.env')
module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: devEnv.OPEN_PROXY === false ? {} : {
      '/proxyApi': {
        target: 'http://poliprivil.mng.ivtech.tech/privil-mng-poli/',
        changeOrigin: true,
        pathRewrite: {
          '^/proxyApi': '/'
        }
      }
    },
    host: 'localhost', // can be overwritten by process.env.HOST  0.0.0.0
    port: 60617, // can be overwritten by process.env.PORT
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    useEslint: true,
    showEslintErrorsInOverlay: false,
    devtool: 'eval-source-map',
    cacheBusting: true,
    cssSourceMap: false,
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report,
    output: {
      path: '../dist', 
      filename: '[name].bundle.js' 
  },
  }
}
