var gulp = require('gulp');
var sass= require('gulp-sass');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({ lazy: true });

gulp.task('vet', function () {
    log('I am inside the vet task');
    log({ 'msg1': 'error1', 'msg2': 'error2' });
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', function () {
    
    return gulp
        .src(config.scss)
        .pipe($.print())
        .pipe(sass().on('error', sass.logError))
        .pipe($.autoprefixer({ browsers: ['Last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.temp));
});

////////////////////
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.green(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.bgGreen(msg));
    }

}