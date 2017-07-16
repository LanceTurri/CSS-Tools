const gulp = require('gulp');
const debug = require('gulp-debug')
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const ext_replace = require('gulp-ext-replace');
const sourcemaps = require('gulp-sourcemaps');
const deploy = require('gulp-gh-pages');

const typescript = require('gulp-typescript');
const tsProject = typescript.createProject('tsconfig.json');

gulp.task('styles', () => {
  return gulp.src('./styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', sass.logError)
    .pipe(sourcemaps.write('./'))
    .pipe(debug({ title: 'CSS |' }))
    .pipe(gulp.dest('styles'))
    .pipe(notify("SCSS task finished"));
});

gulp.task('scripts', () => {
  return gulp.src(['./scripts/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(debug({ title: 'JS |' }))
    .pipe(uglify())
    .pipe(ext_replace('.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('scripts'))
    .pipe(notify("JS task finished"));
});

gulp.task('watch', ['styles', 'scripts'], () => {
  gulp.watch('styles/*.scss', ['styles']);
  gulp.watch('scripts/*.ts', ['scripts']);
});

gulp.task('default', ['watch']);