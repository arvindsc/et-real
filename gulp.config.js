module.exports = function () {
    var config = {
        temp: './.tmp/',
        alljs: ['./src/**/*.js',
            './*.js'
        ],
        scss: './src/styles/style.scss'
    };
    return config;
};