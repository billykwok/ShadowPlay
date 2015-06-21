var gulp = require('gulp'),
	del = require('del'),
	util = require('gulp-util'),
	gulpif = require('gulp-if'),
	sourcemaps = require('gulp-sourcemaps'),
	ts = require('gulp-typescript'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imgmin = require('gulp-imagemin'),
	connect = require('gulp-connect'),
	runSequence = require('run-sequence');

var envPaths = {
		build: './build/',
		src: './src/',
		vendor: './vendor/',
		npm: './node_modules/'
	},
	buildPaths = {
		js: envPaths.build + 'js/',
		css: envPaths.build + 'css/',
		img: envPaths.build + 'img/'
	},
	srcPaths = {
		ts: envPaths.src + 'ts/',
		tsdBundle: envPaths.src + 'ts/tsd/bundle.d.ts',
		sass: envPaths.src + 'sass/',
		img: envPaths.src + 'img/'
	},
	libPaths = {
		tscollections: envPaths.npm + 'typescript-collections/',
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

gulp.task('ts_settup', function() {
	return gulp.src([
			libPaths.tscollections + 'collections.ts'
		])
		.pipe(gulp.dest(srcPaths.ts));
});

gulp.task('scripts', ['ts_settup'], function() {
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

gulp.task('img', function() {
	return gulp.src(srcPaths.img + '*')
		.pipe(imgmin())
		.pipe(gulp.dest(buildPaths.img));
});

gulp.task('connect', function() {
	connect.server({
		root: envPaths.build,
		port: 8000,
		livereload: true
	});
});

gulp.task('connect_reload', function() {
	connect.reload();
});

gulp.task('build', function(callback) {
	runSequence('clean', 'scripts', 'img', callback);
});

gulp.task('watch', ['connect'], function() {
	gulp.watch([
		srcPaths.ts + '**/*.ts',
		srcPaths.img + '**/*.png|jpg'
	], function() {
		runSequence('build', 'connect_reload');
	});
});

gulp.task('default', ['watch']);