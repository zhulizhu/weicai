var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var ngmin = require('gulp-ngmin');
var imageMin  = require('gulp-imagemin');
var minifycss = require('gulp-minify-css');
var paths = {
  app:['www/js/**/*.js'],
  tpl:['www/templates/**/*.html'],
};
gulp.task('app', function () {
  gulp.src(paths.app)
      .pipe(concat('release.js'))
      .pipe(gulp.dest('www/lib/yike'))
});
gulp.task('tpl', function (done) {
  gulp.src(paths.tpl)
    .pipe(templateCache({standalone:true}))
      .pipe(gulp.dest('www/lib/yike'))
      .on('end', done)
});
gulp.task('watch', function () {
  gulp.watch(paths.app, ['app']);
  gulp.watch(paths.tpl, ['tpl']);
});

