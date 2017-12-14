'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var preprocess = require('gulp-preprocess');
var uglify = require('gulp-uglify');

function processJS(filenames, ctx, output_name) {
	return gulp.src(filenames)
    .pipe(preprocess({context: ctx}))
    .pipe(concat(output_name))
    .pipe(gulp.dest('./dist/js'))
    .pipe(rename(function (path) { path.extname = ".min.js" }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
}
gulp.task('all', function() {
	return processJS(['./src/js/core.js', './src/js/bgimages.js', './src/js/images.js'], 
		{ BP_IMG: true, BP_BG_IMG: true}, 
		'bluepil.js');
});
gulp.task('bgOnly', function() {
	return processJS(['./src/js/core.js', './src/js/bgimages.js'], 
		{ BP_BG_IMG: true}, 
		'bluepil-bg.js');
});
gulp.task('imgOnly', function() {
  return processJS(['./src/js/core.js', './src/js/images.js'], 
		{ BP_IMG: true}, 
		'bluepil-img.js');
});
gulp.task('css-min', function() {
    return gulp.src('./src/css/*.css')
    	.pipe(autoprefixer())
    	.pipe(gulp.dest('./dist/css'))
        .pipe(cssnano())
        .pipe(rename(function (path) {
    		path.extname = ".min.css"
  		}))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('default',['all', 'css-min']);