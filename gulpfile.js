var gulp     = require('gulp');
var svgstore = require('gulp-svgstore');
var rename   = require('gulp-rename');

// Generate src/assets/material-icons.svg which is an SVG sprite
gulp.task('svg', function() {
    return gulp
        .src([
            'svg/**/*.svg',
        ])
        .pipe(svgstore())
        .pipe(rename('material-icons.svg'))
        .pipe(gulp.dest('src/assets/'));
});
