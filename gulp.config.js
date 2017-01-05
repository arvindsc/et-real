module.exports = (function () {
    var base = './client/src/';
    var temp='./.tmp/';
    var config = {
        temp: temp,
        alljs: [base + '**/*.js',
            './*.js'
        ],
        base: base,
        css: temp + 'style.css',
        js: [base + '**/*.js'],
        index: base + 'index.html',
        scss: base + 'styles/style.scss',
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
        defaultPort:7302,
        nodeServer: './src/server/app.js'

    };
    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    }
    return config;
})();

