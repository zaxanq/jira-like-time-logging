var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'src',
            routes: {
                '/styles': 'src/styles/css'
            }
        },
    });
});

gulp.task('sass', () => {
    return gulp.src('src/styles/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/styles/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync', 'sass'], () => {
    gulp.watch('src/styles/scss/*.scss', ['sass']);
    gulp.watch('src/styles/scss/**/*.scss', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/*.hbs', browserSync.reload);
    gulp.watch('src/js/*.js', browserSync.reload);
});
