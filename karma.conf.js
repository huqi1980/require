module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'dest/require.js',
            'test/**/*.spec.js',
            {pattern: 'dest/demo/*', included: false}
        ],
        exclude: [
        ],
        preprocessors: {
            'dest/require.js': ['coverage'],
            'dest/demo/index.html': ['html2js']
        },

        reporters: ['progress', 'coverage'],

        html2JsPreprocessor: {
            // stripPrefix: 'public/',
            // prependPrefix: 'served/',
            processPath: function(filePath) {
                var p = filePath.replace(/\.html$/, '');
                p = p.replace(/\\/g, '-');
                return p.replace(/\//g, '-');
            }
        },

        coverageReporter: {
            dir: 'coverage',
            reporters: [
                {type: 'cobertura', subdir: '.'},
                {type:'lcovonly', subdir: '.'},
                // {type:'json', subdir: 'json'},
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
            'karma-html2js-preprocessor',
            'karma-chrome-launcher'
        ],

        //browsers: ['Chrome'],
        singleRun: true,
        concurrency: Infinity
    })
};
