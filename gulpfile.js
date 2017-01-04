var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');
var gulp = require('gulp');
var sass = require('gulp-sass');
var $ = require('gulp-load-plugins')({ lazy: true });

gulp.task('vet', function () {

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function () {
    log('Compling Sass --> css')
    return gulp
        .src(config.scss)
        .pipe($.plumber())
        .pipe(sass())
        .pipe($.autoprefixer({ browsers: ['Last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function () {
    var files = config.temp + '**/*.css';
    clean(files);
})

gulp.task('sass-watcher', function () {
    gulp.watch(config.scss, ['styles']);
})

////////////////////

function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path))
    del(path);
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }

}