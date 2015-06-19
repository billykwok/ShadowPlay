var gulp = require('gulp'),
	del = require('del'),
	util = require('gulp-util'),
	gulpif = require('gulp-if'),
	sourcemaps = require('gulp-sourcemaps'),
	ts = require('gulp-typescript'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	connect = require('gulp-connect');

var envPaths = {
		build: './build/',
		src: './src/',
		vendor: './vendor/'
	},
	buildPaths = {
		js: envPaths.build + 'js/',
		css: envPaths.build + 'css/'
	},
	srcPaths = {
		ts: envPaths.src + 'ts/',
		tsdBundle: envPaths.src + 'ts/tsd/bundle.d.ts',
		sass: envPaths.src + 'sass/'
	},
	libPaths = {
		three: envPaths.vendor + 'threejs/'
	};

gulp.task('clean', function(cb) {
	del([
		envPaths.build
	], cb);
});

var tsProject = ts.createProject({
	noEmitOnError: false,
	removeComments: true,
	declarationFiles: false,
	noExternalResolve: false,
	module: 'commonjs',
	out: 'app.min.js'
});

gulp.task('scripts', function() {
	return gulp.src([
			srcPaths.ts + 'app.ts',
			libPaths.three + 'build/three.min.js'
		])
		.pipe(sourcemaps.init())
		.pipe(gulpif(/[.]ts$/, ts(tsProject)))
		//.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(buildPaths.js));
});

gulp.task('connect', function() {
	connect.server({
		port: 8000,
		livereload: true
	});
});

gulp.task('connectStop', function() {
	connect.serverClose();
});

gulp.task('watch', function() {
	gulp.watch([
		srcPaths.ts + '**/*.ts'
	], ['scripts']);
});

gulp.task('default', ['watch']);