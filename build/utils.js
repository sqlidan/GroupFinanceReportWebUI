const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('../config');
const path = require('path')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
      ? config.build.assetsSubDirectory
      : config.dev.assetsSubDirectory;

  return path.posix.join(assetsSubDirectory, _path);
}


exports.cssLoaders = function (options) {
  options = options || {}

  const scssLoader = {
    loader: 'sass-loader',
    options: {
        sourceMap: options.sourceMap
    }
  };

  const cssLoader = {
      loader: 'css-loader',
      options: {
          sourceMap: options.sourceMap
      }
  };

  const postcssLoader = {
      loader: 'postcss-loader',
      options: {
          sourceMap: options.sourceMap
      }
  };

  function generateLoaders(loader, loaderOptions) {
    const loaders = [cssLoader]//options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if(loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    if (options.extract) {
      return [MiniCssExtractPlugin.loader].concat(loaders);
    } else {
        return ['vue-style-loader'].concat(loaders);
    }

  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output;
}