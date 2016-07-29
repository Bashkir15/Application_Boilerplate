
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var mincss = require('gulp-uglifycss');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglifyJs = require('gulp-uglify');
var filesort = require('gulp-angular-filesort');
var annotate = require('gulp-ng-annotate');

var core = require('babel-core');


var config = {
	dev: {
		mainAngular: './public/angular/app.js',
		angular: './public/angular/**/*.js',
		mainSass: './public/static/stylesheets/sass/main.sass',
		sass: './public/static/stylesheets/sass/**/*.sass',
		sass2: './public/static/stylesheets/sass/**/**/.sass'
	},

	prod: {
		angular: "./dist/angular",
		css: './dist/stylesheets'
	}
};

gulp.task('sass', function() {

	gulp.src(config.dev.mainSass)
	.pipe(plumber())
	.pipe(sass({styles: 'expanded'}))
	.pipe(mincss())
	.pipe(rename(
		function (path) {
			path.extname = '.min.css'
			}
		))
	.pipe(gulp.dest(config.prod.css))

});

gulp.task('angular', function() {

	gulp.src(config.dev.angular)
	.pipe(filesort())
	.pipe(annotate())
	.pipe(concat('app.js'))
	.pipe(babel({
		presets: ['es2015']
		}
	))
	.pipe(uglifyJs())
	.pipe(rename(
		function (path) {
			path.extname = '.min.js'
		}
	))
	.pipe(gulp.dest(config.prod.angular))

});

gulp.task('watch', function() {
	gulp.watch([config.dev.mainSass, config.dev.sass, config.dev.sass2], ['sass'])
	gulp.watch([config.dev.angular, config.dev.mainAngular], ['angular']);
	}
);

gulp.task('build:angular', function() {

	gulp.start('angular');
	gulp.start('sass');
	gulp.watch([config.dev.angular, config.dev.mainAngular], ['angular']);
	}
);