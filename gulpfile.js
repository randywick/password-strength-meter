'use strict';


const del = require('del');
const es = require('event-stream');
const path = require('path');
const glob = require('glob');
const browserify = require('browserify');
const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const $ = require('gulp-load-plugins')();


const DIST = 'dist';
const dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};


gulp.task('clean', done => {
  del.sync([dist()])
  done();
})


gulp.task('browserify', ['clean'], done => {

  // map function for browserify and friends
  const browserifyMapper = entry => {
    const transform = [['babelify', {presets: ['es2015']}]]
    const entries = [entry];
    const b = browserify({entries, transform})

    return b.bundle()
      .pipe(source(entry))
      .pipe(buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.uglify())
        .on('error', $.util.log)
      .pipe($.sourcemaps.write('./'))
      .pipe($.rename({
        extname: '.bundle.js',
        dirname: ''
      }))
      .pipe(gulp.dest(dist()))
  }

  glob(`./lib/index.js`, (err, files) => {
    if (err) {
      done(err);
    }

    const tasks = files.map(browserifyMapper);
    es.merge(tasks).on('end', done);
  })
})


gulp.task('babelify-dist', done => {

  // map function for browserify and friends
  const browserifyMapper = entry => {
    const transform = [['babelify', {presets: ['es2015']}]]
    const entries = [entry];
    const b = browserify({entries, transform})

    return b.bundle()
      .pipe(source(entry))
      .pipe(buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.uglify())
        .on('error', $.util.log)
      .pipe($.sourcemaps.write('./'))
      .pipe($.rename({
        extname: '.bundle.js',
        dirname: ''
      }))
      .pipe(gulp.dest(dist()))
  }

  glob(`./tests/integration.js`, (err, files) => {
    if (err) {
      done(err);
    }

    const tasks = files.map(browserifyMapper);
    es.merge(tasks).on('end', done);
  })
})


gulp.task('js-watch', ['browserify', 'babelify-dist'], browserSync.reload);


gulp.task('serve-test', ['browserify', 'babelify-dist'], () => {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch(['**/*.js', 'index.html'], ['js-watch']);
});



gulp.task('default', [
  'clean',
  'browserify',
  'babelify-dist'
])