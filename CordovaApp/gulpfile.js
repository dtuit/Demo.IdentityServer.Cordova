var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');

gulp.task('bowercopy', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('www/lib'));
});