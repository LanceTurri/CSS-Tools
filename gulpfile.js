'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var debug = require('gulp-debug')
var sass = require('gulp-sass');
var merge = require('merge2');
var notify = require('gulp-notify');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var ext_replace = require('gulp-ext-replace');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');

var isDebugEnabled = true;

gulp.task('styles', function () {
  return gulp.src('styles/*.scss')
    .pipe(sass())
    .pipe(gulpif(isDebugEnabled, debug({ title: 'CSS |' })))
    .on("error", notify.onError(function (error) {
        return "File: " + error.message;
      }))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('scss'))
    .pipe(notify("SCSS task finished"));
});

gulp.task('scripts', function() {
  var tsResult = gulp.src(['scripts/*.ts'])
    .pipe(typescript({
      noImplicitAny: true,
      outFile: 'main.js'
    }))
    
  merge([
    tsResult.js.pipe(sourcemaps.init())
      .pipe(gulpif(isDebugEnabled, debug({ title: 'JS |' })))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(ext_replace('.min.js'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('scripts'))
      .pipe(notify("JS task finished")),
    tsResult.js.pipe(gulp.dest('scripts')) 
  ])
})

gulp.task('watch', function () {
  gulp.watch('styles/*.scss', ['styles']);
  gulp.watch('scripts/*.ts', ['scripts']);
});

gulp.task('default', ['watch']);