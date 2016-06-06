'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var debug = require('gulp-debug')
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var ext_replace = require('gulp-ext-replace');
var pngquant = require('imagemin-pngquant');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var tslint = require('gulp-tslint');

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

gulp.task('typescript', ['scripts'], function() {
  return gulp.src(['scripts/*.ts'])
    .pipe(typescript({
      noImplicitAny: true,
      outFile: 'main.js'
    }))
    .pipe(gulp.dest('scripts'));
});

gulp.task('scripts', function() {
  var tsResult = gulp.src(['scripts/*.js', '!scripts/*.min.js'])
    .pipe(sourcemaps.init())
    .pipe(gulpif(isDebugEnabled, debug({ title: 'JS |' })))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(ext_replace('.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('scripts'))
    .pipe(notify("JS task finished"))    
})

gulp.task('images', function() {
    return gulp.src('images/art/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
        }))
        .pipe(gulp.dest('images'));
});

gulp.task('watch', function () {
  gulp.watch('styles/*.scss', ['styles']);
  gulp.watch('scripts/*.ts', ['typescript']);
});

gulp.task('default', ['watch']);