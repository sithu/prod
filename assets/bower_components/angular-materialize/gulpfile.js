var gulp = require('gulp');
var concat = require('gulp-concat');
var serve = require('gulp-serve');

var filename = 'angular-materialize.js';

gulp.task('scripts', function() {
	gulp.src('./src/*.js')
			.pipe(concat(filename))
			.pipe(gulp.dest('./dist/'))
			.pipe(gulp.dest('./demo/js/'))

});

gulp.task('watch', function() {

});

gulp.task('serve', serve({
	root: ['demo'],
	port: 1337
}));

gulp.task('default', ['scripts']);
