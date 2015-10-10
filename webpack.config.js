var webpack = require('webpack')
var path = require('path')

var ExtractTextPlugin = require("extract-text-webpack-plugin")


// PATHS

module.exports = {
  entry: {
    entry: [
      // 'webpack/hot/dev-server',
      './script.js'
    ]
  },
  output: {
    path: __dirname + '/dist/',
    filename: 'bundle.js',
    sourceMapFilename: '[file].map'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        stage: 0,
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.scss$/,
      // loader: 'style-loader!css-loader!sass-loader'
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "url-loader?limit=10000&minetype=application/font-woff"
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader"
    }],
  },
  plugins: [
    new ExtractTextPlugin("[name].css")
  ]
}