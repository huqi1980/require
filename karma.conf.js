module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'dest/require.js',
            'test/**/*.spec.js',
            {pattern: 'test/res/*', included: false}
        ],
        exclude: [
        ],
        preprocessors: {
            'dest/require.js': ['coverage']
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            dir: 'coverage',
            reporters: [
                {type: 'cobertura', subdir: '.'},
                {type:'lcovonly', subdir: '.'},
                {type:'json', subdir: 'json'},
                {type:'html',subdir : 'html'}
            ]
        },

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        //browsers: ['Chrome'],
        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher'
        ],

        //browsers: ['Chrome'],
        singleRun: true,
        concurrency: Infinity
    })
};
