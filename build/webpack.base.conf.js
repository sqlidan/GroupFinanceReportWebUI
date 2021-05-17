const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const path = require('path')
const utils = require('./utils')
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
 const HappyPack = require('happypack')
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  entry: {
    app: ['babel-polyfill', path.resolve(__dirname,'../src/main.js')]
  },
  output: {//todo 不加path和publicPath 刷新页面->白页
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV !== 'development' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'views': path.resolve(__dirname, '../src/views'),
      'styles': path.resolve(__dirname, '../src/styles'),
      'api': path.resolve(__dirname, '../src/api'),
      'class': path.resolve(__dirname, '../src/class'),
      'consts': path.resolve(__dirname, '../src/consts'),
      'utils': path.resolve(__dirname, '../src/utils'),
      'mixin': path.resolve(__dirname, '../src/mixin'),
      'store': path.resolve(__dirname, '../src/store'),
      'router': path.resolve(__dirname, '../src/router'),
      'vendor': path.resolve(__dirname, '../src/vendor'),
      'static': path.resolve(__dirname, '../static')
    }
  },
  externals: {
    // jquery: 'jQuery',
    // CKEDITOR: 'window.CKEDITOR',
    xlsxStyle: 'XLSX'
  },
  module: {
    rules: [
      // {
      //   test: /\.less$/,
      //   use: [{
      //       loader: "vue-style-loader" // creates style nodes from JS strings
      //   }, {
      //       loader: "css-loader" // translates CSS into CommonJS
      //   }, {
      //       loader: "less-loader" // compiles Less to CSS
      //   }]
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /.js$/,
        loader: 'happypack/loader?id=happybabel',
        include: [resolve('src')],
        exclude: /node_modules/
      },
      
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 5000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
          esModule:false
          // outputPath: '/',
          // publicPath: '/',
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 5000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: './page/index.html'
    // }),
    new HappyPack({
      id: 'happybabel',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './page/index.html',
      chunks: ['app'],   //!3.2.0版本和optimization连用会导致打包js加载不上，使用4.0.0-beta.11版本解决
      inject: true,
      path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: './page/index.html',
    //   // favicon: resolveApp('favicon.ico'),
    //   inject: true,
    //   path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory
    // }),
  ]
}