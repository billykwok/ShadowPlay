var gulp = require('gulp');
var del = require('del');
var copy = require('gulp-copy');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var envPaths = {
		build: 'build/',
		src: 'src/',
		vendor: 'vendor/'
	},
	buildPaths = {
		js: envPaths.build + 'js/',
		css: envPaths.build + 'css/'
	},
	srcPaths = {
		ts: envPaths.src + 'ts/',
		sass: envPaths.src + 'sass/'
	},
	libPaths = {
		three: envPaths.vendor + 'threejs/'
	};

gulp.task('clean', function(cb) {
	del(['build'], cb);
});

gulp.task('scripts', ['clean'], function() {
	return gulp.src([
			libPaths.threejs,
			srcPaths.ts
		])
		.pipe(sourcemaps.init())
		.pipe(typescript())
		.pipe(uglify())
		.pipe(concat('all.min.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(buildPaths.js));
});

gulp.task('watch', function() {
	gulp.watch(srcPaths.scripts, ['scripts']);
});

gulp.task('default', ['watch', 'scripts']);