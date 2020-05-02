import gulp from 'gulp';
import sass from 'gulp-sass';
import plugins from 'gulp-load-plugins';
import del from 'del';

const $ = plugins();

// clean directory build
export const clean = () => del('build');

// task compile scss
export const styles = () => {
  return gulp.src('src/styles/main.scss')
    .pipe($.sass.sync().on('error', sass.logError))
    .pipe($.cssmin())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('build/styles'));
};

// watch
export const watch = () =>  {
  return gulp.watch(dir.styles.src, styles);
}

// build
export const build = (done) => gulp.series(clean, gulp.parallel(styles))(done);