var gulp = require('gulp');
    gutil = require('gulp-util');
    concat = require('gulp-concat');

var jsSources = [
    'components/scripts/lib.js',
    'components/scripts/main.js'
];

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(gulp.dest('builds/development/js'))
});

