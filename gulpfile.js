'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var preprocess = require('gulp-preprocess');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');

// fetch command line arguments
const arg = (argList => {

  let arg = {}, opt, thisOpt, curOpt;
  for (var a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');
    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    }
    else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;
    }
  }

  return arg;

})(process.argv);


function processJS(filenames, ctx, output_name) {
	return gulp.src(filenames)
    .pipe(preprocess({context: ctx}))
    .pipe(concat(output_name))
    .pipe(gulp.dest('./dist/js'))
    .pipe(rename(function (path) { path.extname = ".min.js" }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(gzip())
    .pipe(gulp.dest('./dist/js'));
}
function buildContextFromArgs() {
	var ctx = {};
	if (arg.hasOwnProperty("no-seq")) {
		ctx["NO_SEQ"] = true;
	}
	if (arg.hasOwnProperty("no-scroll")) {
		ctx["NO_SCROLL_LOADED"] = true;
	}
	return ctx;
}
gulp.task('all', function() {
	var ctx = { BP_IMG: true, BP_BG_IMG: true};
	return processJS(['./src/js/core.js', './src/js/bgimages.js', './src/js/images.js'], 
		Object.assign(ctx, buildContextFromArgs()), 
		'bluepil.js');
});
gulp.task('bgOnly', function() {
	var ctx = { BP_BG_IMG: true};
	return processJS(['./src/js/core.js', './src/js/bgimages.js'], 
		Object.assign(ctx, buildContextFromArgs()), 
		'bluepil-bg.js');
});
gulp.task('imgOnly', function() {
	var ctx = { BP_IMG: true};
  return processJS(['./src/js/core.js', './src/js/images.js'], 
		Object.assign(ctx, buildContextFromArgs()), 
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