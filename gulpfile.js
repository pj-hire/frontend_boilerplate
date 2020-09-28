'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const csslint = require('gulp-csslint');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
var reload = browserSync.reload;
const zip = require('gulp-zip');
const size = require('gulp-size');

sass.compiler = require('sass');

function clean() {
  return del(['./dist']);
}

function styles() {
  return gulp.src('./src/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(csslint())
    .pipe(csslint.formatter())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(rename({
      basename: 'styles',
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(reload({stream: true}));
}

function scripts() {
  return gulp.src('./src/scripts/**/*.js', { sourcemaps: true })
    .pipe(babel({
            presets: ['@babel/env']
        }))
    .pipe(eslint({"rules": {}}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist'))
}

function watch() {
  browserSync.init({
    server: "./dist",
    browser: 'google chrome'
  });
  gulp.watch('./src/scripts/**/*.js', scripts);
  gulp.watch('./src/styles/**/*.scss', styles);
  gulp.watch('./dist/index.html').on('change', browserSync.reload);
}

const build = gulp.series(clean, styles, scripts);
// const build = gulp.series(clean, gulp.parallel(styles, scripts));
  //runs styles and scripts at the same time to save a milliseconds

function images() {
  gulp.src('./src/images/**')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
}

function zipper() {
  return gulp.src('./src/scripts/**/*.js')
    .pipe(zip('archieve.zip'))
    .pipe(gulp.dest('./dist'))
    //creates a zip file in dist folder will all scripts
}

function sizeFinder() {
  gulp.src('./dist/**')
		.pipe(size())
}

exports.styles = styles;
exports.scripts = scripts;
exports.clean = clean;
exports.watch = watch;
exports.images = images;
exports.zipper = zipper;
exports.build = build;
exports.sizeFinder = sizeFinder;
