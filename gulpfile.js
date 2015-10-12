var gulp = require('gulp');
var exec = require('child_process').exec
var livereload = require('gulp-livereload');
var WebpackDevServer = require('webpack-dev-server')
var connect = require('gulp-connect')



var dir = './'
gulp.task('html', function() {
  gulp.src(dir + 'index.html')
    .pipe(livereload());
})

gulp.task('watch', function() {
  gulp.watch([dir + 'index.html'], function () {
    gulp.run('html')
  })
  livereload.listen();
})

gulp.task('serve', function() {
  exec('webpack-dev-server -h --inline -d --host 127.0.0.1 --port 8080')
  gulp.run('watch')
})

gulp.task('webpack',function(){
  exec('webpack -p --config webpack.config.production.js')
})

gulp.task('connect', function() {
  connect.server({
    root: './',
  });
});

//default
gulp.task('default', ['serve'])