'use strict';

var gulp = require('gulp');
var debug = require('gulp-debug')
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var ext_replace = require('gulp-ext-replace');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');

var isDebugEnabled = true;

gulp.task('styles', function () {
  return gulp.src('styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', sass.logError)
    .pipe(sourcemaps.write('./'))
    .pipe(debug({ title: 'CSS |' }))
    .pipe(gulp.dest('styles'))
    .pipe(notify("SCSS task finished"));
});

gulp.task('scripts', function() {
  var tsResult = gulp.src(['scripts/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(typescript({
      noImplicitAny: true,
      outFile: 'app.js'
    }))
    .pipe(debug({ title: 'JS |' }))
    .pipe(uglify())
    .pipe(ext_replace('.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('scripts'))
    .pipe(notify("JS task finished"))
});

gulp.task('watch', function () {
  gulp.watch('styles/*.scss', ['styles']);
  gulp.watch('scripts/*.ts', ['scripts']);
});

gulp.task('default', ['watch']);