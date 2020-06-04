import gulp from 'gulp';
import sass from 'gulp-sass';
import plugins from 'gulp-load-plugins';
import del from 'del';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.babel';

const $ = plugins();

const paths = {
  pages: [
    'src/pages/*.pug',
    'src/pages/**/*.pug',
  ],
  styles: 'src/styles/main.scss',
  images: 'src/images/**/*',
  javascript: 'src/scripts/**/*.js',
};

// clean directory build
export const clean = () => del('build');

// task compile scss
export const styles = () => gulp.src(paths.styles)
  .pipe($.sass.sync().on('error', sass.logError))
  .pipe($.cssmin())
  .pipe($.rename({ suffix: '.min' }))
  .pipe(gulp.dest('build/styles'))
  .pipe(browserSync.stream());

// task compile pages
export const pages = () => gulp.src(paths.pages)
  .pipe($.changed('build', { extension: '.html' }))
  .pipe($.cached('pug-files'))
  .pipe($.if(!global.firstRun, $.pugInheritance({ basedir: 'src/pages', extension: '.pug', skip: 'node_modules' })))
  .pipe($.plumber())
  .pipe($.pug({ pretty: true }))
  .pipe(gulp.dest('build'))
  .pipe(browserSync.stream());

// task compile images
export const images = () => gulp.src(paths.images, { since: gulp.lastRun(images) })
  .pipe($.plumber())
  .pipe($.newer('build/images'))
  .pipe($.imagemin({ optimizationLevel: 5 }))
  .pipe(gulp.dest('build/images'));

// task compile javascript
export const javascript = () => gulp.src(paths.javascript)
  .pipe(webpackStream(webpackConfig), webpack)
  .pipe(gulp.dest('build/scripts'))
  .pipe(browserSync.stream());

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
export const watch = () => {
  gulp.watch(paths.pages, pages);
  gulp.watch(paths.styles, styles);
  gulp.watch(paths.images, images);
  gulp.watch(paths.javascript, javascript);
};

// serve
export const serve = done => gulp.series(
  clean,
  styles,
  pages,
  images,
  javascript,
  gulp.parallel(run, watch),
)(done);

// build
export const build = done => gulp.series(
  clean,
  gulp.series(
    styles,
    pages,
    images,
    javascript,
  ),
)(done);
