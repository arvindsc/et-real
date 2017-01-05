var args = require('yargs').argv,
    config = require('./gulp.config'),
    del = require('del'),
    gulp = require('gulp'),
    port = process.env.PORT || config.defaultPort,
    sass = require('gulp-sass'),
    $ = require('gulp-load-plugins')({ lazy: true });


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

gulp.task('wiredep', function () {
    log('Wire up the bower css js and app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.print())
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.base));

});

gulp.task('inject', ['wiredep', 'styles'], function () {
    log("Wire up the app css into the html, and call wiredep");
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.print())
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.base));

});

gulp.task('serve-dev', function () {

    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': '',
            'NOE_ENV': isDev ? 'dev' : 'build'
        }
    };
    return $.nodemon(nodeOptions);
});

//////////////////// Utility Functions \\\\\\\\\\\\\\\\\\\\\\\

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