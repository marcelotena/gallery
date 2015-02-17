var gulp = require('gulp');
    gutil = require('gulp-util');
    compass = require('gulp-compass');
    concat = require('gulp-concat');

var jsSources = [
    'components/scripts/lib.js',
    'components/scripts/main.js'
];
var sassSources = ['components/sass/style.scss'];

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(gulp.dest('builds/development/js'))
});

gulp.task('compass', function() {
    gulp.src(sassSources)
        .pipe(compass({
        sass: 'components/sass',
        image: 'builds/development/images',
        style: 'expanded'
    })
        .on('error', gutil.log))
        .pipe(gulp.dest('builds/development/css'))
});

gulp.task('watch', function() {
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
});

gulp.task('default', ['js', 'compass', 'watch']);