var gulp = require('gulp');
var exec = require('child_process').exec
var livereload = require('gulp-livereload');
var WebpackDevServer = require('webpack-dev-server')
var connect = require('gulp-connect')
var RevAll = require('gulp-rev-all')
var gutil = require("gulp-util");
var webpack = require('webpack')
var clean = require('gulp-clean')
useref = require('gulp-useref')


var productionConfig = require('./webpack.config.production')

var dir = './'
gulp.task('html', function() {
  gulp.src(dir + 'index.html')
    .pipe(livereload());
})

gulp.task('watch', function() {
  gulp.watch([dir + 'index.html'], function() {
    gulp.run('html')
  })
  livereload.listen();
})

gulp.task('serve', function() {
  exec('webpack-dev-server -h --inline -d --host 127.0.0.1 --port 8080')
  gulp.run('watch')
})

gulp.task('webpack', function() {

    // gulp.src('dist', {
    //     read: false
    //   })
    //   .pipe(clean())
    // var assets = useref.assets();

    // gulp.src('index-dev.html')
    //   .pipe(assets)
    //   .pipe(assets.restore())
    //   .pipe(useref())
    //   .pipe(gulp.dest('dist'));

    // exec('webpack -p --config webpack.config.production.js')
    webpack(productionConfig, function(err, stats) {
      if (err) throw new gutil.PluginError("webpack", err)
      gutil.log("[webpack]", stats.toString())

    })
  })
  //default
gulp.task('default', ['serve'])