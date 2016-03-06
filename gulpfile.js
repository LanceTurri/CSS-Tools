'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

gulp.task('sass', function () {
  return gulp.src('css/*.scss')
    .pipe(sass())
    .on("error", notify.onError(function (error) {
        return "File: " + error.message;
      }))
    .pipe(gulp.dest('css'));
});

gulp.task('images', function() {
    return gulp.src('images/art/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
        }))
        .pipe(gulp.dest('images'));
});

gulp.task('sass:watch', function () {
  gulp.watch('css/*.scss', ['sass']);
});