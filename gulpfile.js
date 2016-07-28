
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglifyJs = require('gulp-uglify');
var filesort = require('gulp-angular-filesort');
var annotate = require('gulp-ng-annotate');


var config = {
	dev: {
		mainAngular: './public/angular/app.js',
		angular: './public/angular/**/*.js'
	},

	prod: {
		angular: "./dist/angular"
	}
};

gulp.task('angular', function() {

	gulp.src(config.dev.angular)
	.pipe(filesort())
	.pipe(annotate())
	.pipe(concat('app.js'))
	.pipe(uglifyJs())
	.pipe(rename(
		function (path) {
			path.extname = '.min.js'
		}
	))
	.pipe(gulp.dest(config.prod.angular))

});

gulp.task('build:angular', function() {

	gulp.start('angular');
	gulp.watch([config.dev.angular, config.dev.mainAngular], ['angular']);

	}
);