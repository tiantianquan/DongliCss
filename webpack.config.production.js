var webpack = require('webpack')
var path = require('path')
var AssetsPlugin = require('assets-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var glob = require('glob')
var fs = require('fs')


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
    filename: 'bundle.[hash].js',
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
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "url-loader?limit=10000&minetype=application/font-woff"
    }, {
      test: /\.(png|jpg|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader"
    }],
  },
  plugins: [
    new CleanDist(['./dist/bundle.*.js', './dist/*.css']),
    new ExtractTextPlugin("[name].[contenthash].css"),
    // new ExtractTextPlugin("[name].css"),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new AssetsPlugin(),
    new ReplaceRev()
  ]
}


//清除之前的文件
function CleanDist(paths) {
  this.paths = paths
}

CleanDist.prototype.apply = function(compiler) {
  this.paths.forEach(function(path) {
    glob(path, function(er, files) {
      files.forEach(function(file) {
        fs.unlink(file)
      })
    })
  })
}

function ReplaceRev(path) {
  this.path = path
}

ReplaceRev.prototype.apply = function(compiler) {
  var filename = JSON.parse(fs.readFileSync('webpack-assets.json'))
  var indexFile = fs.readFileSync('index-dev.html').toString()

  var result = indexFile.replace(/bundle.js/g, './dist/'+filename.entry.js)
  .replace(/<script src="http:\/\/localhost:8080\/webpack-dev-server.js"><\/script>/g,'')
  .replace(/<!-- <link rel="stylesheet" type="text\/css" href="\.\/dist\/entry.css"> -->/g,
    '<link rel="stylesheet" type="text/css" href="./dist/' + filename.entry.css + '">')

  fs.writeFileSync('index.html',result)
}