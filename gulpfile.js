var gulp = require('gulp'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    footer  = require('gulp-footer'),
    header  = require('gulp-header');

gulp.task('clean', function(cb){
    del('dest', cb);
    cb();
});

gulp.task('build', function(cb){
    gulp.src(['src/**/*.js'])
        .pipe(concat("require.js"))
        .pipe(header('(function(){\n'))
        .pipe(footer('\n})();'))
        .pipe(gulp.dest("dest"))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest("dest"));
    cb();
});
gulp.task('demo', function(cb){
    gulp.src(['demo/**/*'])
        .pipe(gulp.dest("dest/demo"));
    cb();
});

gulp.task('watch', function(cb){
    gulp.watch('src/**/*.js', gulp.series('build'));
    gulp.watch('demo/**/*', gulp.series('demo'));
});

gulp.task('default', gulp.parallel('build', 'demo'));



