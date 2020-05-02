import gulp from 'gulp';
import sass from 'gulp-sass';
import plugins from 'gulp-load-plugins';
import del from 'del';
import browserSync from 'browser-sync';

const $ = plugins();

// clean directory build
export const clean = () => del('build');

// task compile scss
export const styles = () => {
  return gulp.src('src/styles/main.scss')
    .pipe($.sass.sync().on('error', sass.logError))
    .pipe($.cssmin())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('build/styles'))
    .pipe(browserSync.stream());
};

// serve
const run = () => browserSync.init({
  port: '9000',
  server: {
    baseDir: 'build',
    serveStaticOptions: {
      extensions: ['html', 'js'],
    },
  },
  notify: true,
});

// watch
export const watch = () =>  {
  return gulp.watch('src/styles/**/*.scss', gulp.series(styles));
}

// serve
export const serve = (done) =>  {
  gulp.series(clean, styles, gulp.parallel(run, watch))(done);
};

// build
export const build = (done) => gulp.series(clean, gulp.parallel(styles))(done);