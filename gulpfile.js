var gulp = require('gulp');
var exec = require('child_process').exec
var livereload = require('gulp-livereload');
var WebpackDevServer = require('webpack-dev-server')
var connect = require('gulp-connect')
var RevAll = require('gulp-rev-all')
var gutil = require("gulp-util");
var webpack = require('webpack')
var clean = require('gulp-clean')
var useref = require('gulp-useref')
var ftp = require('vinyl-ftp')
var gutil = require('gulp-util')



var productionConfig = require('./webpack.config.production')
var secret = require('./secret')

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

//向服务器自动部署
gulp.task('deploy', function() {

  var conn = ftp.create({
    host: secret.ftp.host,
    user: secret.ftp.user,
    password: secret.ftp.password,
    parallel: 10,
    log: gutil.log
  });

  var globs = [
    'dist/**',
    'index.html'
  ];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp.src(globs, {
      base: '.',
      buffer: false
    })
    .pipe(conn.newer('/')) // only upload newer files
    .pipe(conn.dest('/'));
})

gulp.task('webpack', function() {

    // exec('webpack -p --config webpack.config.production.js')
    webpack(productionConfig, function(err, stats) {
      if (err) throw new gutil.PluginError("webpack", err)
      gutil.log("[webpack]", stats.toString())
        //webpack结束

      gulp.run('deploy')

    })
  })
  //default
gulp.task('default', ['serve'])