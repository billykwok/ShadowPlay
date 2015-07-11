var gulp = require('gulp'),
	install = require('gulp-install'),
	tsd = require('gulp-tsd'),
	del = require('del'),
	util = require('gulp-util'),
	gulpif = require('gulp-if'),
	sourcemaps = require('gulp-sourcemaps'),
	ts = require('gulp-typescript'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imgmin = require('gulp-imagemin'),
	connect = require('gulp-connect'),
	runSequence = require('run-sequence').use(gulp),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify');

var envPaths = {
		build: './build/',
		src: './src/',
		vendor: './vendor/',
		npm: './node_modules/'
	},
	buildPaths = {
		js: envPaths.build + 'js/',
		css: envPaths.build + 'css/',
		img: envPaths.build + 'img/',
		video: envPaths.build + 'video/',
		audio: envPaths.build + 'audio/'
	},
	srcPaths = {
		html: envPaths.src + '*.html',
		ts: envPaths.src + 'ts/',
		tsdBundle: envPaths.src + 'ts/tsd/bundle.d.ts',
		sass: envPaths.src + 'sass/',
		img: envPaths.src + 'img/',
		video: envPaths.src + 'video/',
		audio: envPaths.src + 'audio/'
	},
	libPaths = {
		tscollections: envPaths.npm + 'typescript-collections/',
		three: envPaths.vendor + 'threejs/'
	};

gulp.task('clean', function() {
	del([
		envPaths.build
	]);
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
	return gulp.src(srcPaths.img + '**/*')
		.pipe(imgmin())
		.pipe(gulp.dest(buildPaths.img));
});

gulp.task('video', function() {
	return gulp.src(srcPaths.video + '**/*')
		.pipe(gulp.dest(buildPaths.video));
});

gulp.task('audio', function() {
	return gulp.src(srcPaths.audio + '**/*')
		.pipe(gulp.dest(buildPaths.audio));
});

gulp.task('html', function() {
	return gulp.src(srcPaths.html + '*')
		.pipe(gulp.dest(envPaths.build));
});

gulp.task('npm_bower_update', function() {
	gulp.src([
		'./package.json',
		'./bower.json'
	]).pipe(install());
});

gulp.task('tsd_update', function() {
	tsd({
		command: 'reinstall',
		config: './tsd.json'
	});
});

gulp.task('update', function() {
	runSequence('npm_bower_update', 'tsd_update');
});

gulp.task('build', ['clean'], function() {
	runSequence('scripts', 'img', 'video', 'html');
});

gulp.task('server', function() {
	connect.server({
		root: 'build',
		port: 8000,
		livereload: true
	});
});

gulp.task('watch', function() {
	gulp.watch([
		srcPaths.ts + '**/*.ts',
		srcPaths.img + '**/*.{png,jpg}'
	], ['build']);
	watch(envPaths.build + '**/*.*')
		.pipe(connect.reload());
});

gulp.task('default', ['build', 'server', 'watch']);