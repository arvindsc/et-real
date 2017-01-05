module.exports = (function () {
    var client = './src/client/';
    var server = './src/server/';
    var temp = './.tmp/';
    var config = {
    
        alljs: [client + '**/*.js',
            './*.js'
        ],
        build:'./build/',
        client: client,
        css: temp + 'style.css',
        fonts:'./bower_components/font-awesome/fonts/**/*.*/', 
        js: [client + '**/*.js'],
        htmltemplates: client + '**/*.html',
        images: client+ 'images/**/*.*',
        index: client + 'index.html',
        scss: client + 'styles/style.scss',
        server:server,
        temp: temp,

        /**
         * templates cache
         */
        templateCache:{

        },

        /**
         * Bower and NPM locations
         */
        bower: {
            bowerJson: './bower.json',
            directory: './bower_components',
            ignorePath: '../..'
        },
        /**
         * Node Settings
         */
        defaultPort: 7302,
        nodeServer: './src/server/app.js',
        browserReloadDelay:1000,


    };
    config.getWiredepDefaultOptions = function () {
        var options = {
            json: config.bower.bowerJson,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };
    return config;
})();

