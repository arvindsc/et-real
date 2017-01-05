var args = require('yargs').argv,
    browerSync = require('browser-sync'),
    config = require('./gulp.config'),
    del = require('del'),
    gulp = require('gulp'),
    port = process.env.PORT || config.defaultPort,
    sass = require('gulp-sass'),
    $ = require('gulp-load-plugins')({ lazy: true });

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

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
    log('Compling Sass --> css');
    log(config.scss);
    return gulp
        .src(config.scss)
        .pipe($.plumber())
        .pipe(sass())
        .pipe($.autoprefixer({ browsers: ['Last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean', function () {
    var delconfig = [].concat(config.build, config.temp);
    log('Cleaning :' + $.util.colors.blue(delconfig));
    del(delconfig);
});

gulp.task('clean-fonts', function () {
    clean(config.fonts + 'fonts/**/*.*');
});

gulp.task('clean-images', function () {
    clean(config.images + 'images/**/*.*');
});

gulp.task('clean-styles', function () {
    clean(config.temp + '**/*.css');
});

gulp.task('clean-code', function () {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    clean(files);

});

gulp.task('templatecache', function () {
    log('Creating template cache');
    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({ empty: true }))//include empty container 
        .pipe()//template builder plugins
        .pipe(gulp.dest(config.temp));
});

gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying fonts');
    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('images', ['clean-images'], function () {
    log('Copying the images ');
    return gulp
        .src(config.images)
        .pipe($.imagemin({ optimizationLevel: 4 }))
        .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('optimize', function () {
    log('Optimize the javascript, css, html');
log($.useref);
    var assest = $.useref().assets({ searchPath: './' });
    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(templateCache, { read: false, }, {
            starttag: '<!-- inject:templates:js -->'
        })))
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(gulp.dest(config.build));
});

gulp.task('sass-watcher', function () {
    gulp.watch(config.scss, ['styles']);
});

gulp.task('wiredep', function () {
    log('Wire up the bower css js and app js into the html');
    var options = config.getWiredepDefaultOptions();
    console.log(options);
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.print())
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));

});

gulp.task('inject', ['wiredep', 'styles'/* ,templateCache */], function () {
    log('Wire up the app css into the html, and call wiredep');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));

});

gulp.task('serve-dev', function () {
    var isDev = true;
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NOE_ENV': isDev ? 'dev' : 'build',
            watch: [config.server]
        }
    };
    log(nodeOptions);
    return $.nodemon(nodeOptions)
        .on('restart', function (ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function () {
                browerSync.notify('reloading now ...');
                browerSync.reload({ stream: false });
            }, config.browserReloadDelay);
        })
        .on('start', function () {

            log('*** nodemon started');
            startBrowserSync();
        })
        .on('crash', function () { })
        .on('exit', function () {
            log('***  nodemon exited');
        });
});



//////////////////// Utility Functions \\\\\\\\\\\\\\\\\\\\\\\
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function startBrowserSync() {

    if (args.nosync || browerSync.active) {
        return;
    }
    log('Starting browser-sync on port ' + port);
    gulp.watch([config.scss], ['styles'])
        .on('change', function (event) {
            changeEvent(event);
        });

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: [
            config.client + '**/*.*',
            '!' + config.scss,
            config.temp + '**/*.css'

        ],
        ghostMode: {
            click: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0//1000
    };

    browerSync(options);
}

function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
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