"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const imagemin = require('gulp-imagemin');
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const pug = require("gulp-pug")

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  'SotBF\n*/'
].join('');




// Pug
function pugCompile() {
    return gulp.src('resources/index.pug') 
        .pipe(pug())
        // .pipe(rename('game.html'))
        .pipe(gulp.dest('../dist/resources/')); 
};

function pugComp() {
    return gulp.src('conclusion/*') 
        .pipe(pug())
        // .pipe(rename('game.html'))
        .pipe(gulp.dest('../dist/conclusion')); 
};

// Copy image files
function copyImg() {
  return gulp
    .src([
      './img-website/**/*',
    ])
    .pipe(imagemin())
    .pipe(gulp.dest('../dist/img-website/'));
}


// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "../dist/"
    },
    port: 4000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["../dist/vendor/"], {"force": true});
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap
  var bootstrap = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('../dist/vendor/bootstrap/css/'));
  var bootstrapJs = gulp.src('./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
    .pipe(gulp.dest('../dist/vendor/bootstrap/js/'));
  // Font Awesome
  var fontAwesome = gulp.src('./node_modules/@fortawesome/fontawesome-free/css/all.min.css')
    .pipe(gulp.dest('../dist/vendor/fontawesome-free/css/'));
  var fontAwesomeFont = gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest('../dist/vendor/fontawesome-free/webfonts/'));
  // jQuery Easing
  var jqueryEasing = gulp.src('./node_modules/jquery.easing/jquery.easing.min.js')
    .pipe(gulp.dest('../dist/vendor/jquery-easing/'));
  // jQuery
  var jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('../dist/vendor/jquery'));
  return merge(bootstrap, bootstrapJs, fontAwesome, fontAwesomeFont, jquery, jqueryEasing);
}

// CSS task
function css() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename("styles-website.min.css"))
    .pipe(cleanCSS())
    .pipe(gulp.dest("../dist/css"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    .src([
      './js/*.js',
      '!./js/*.min.js',
      '!./js/contact_me.js',
      '!./js/jqBootstrapValidation.js'
    ])
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename("scripts-website.min.js"))
    .pipe(gulp.dest('../dist/'))
    .pipe(browsersync.stream());
}

// Copy HTML files
function copyHtml() {
  return gulp
    .src([
      './**/*.html',
      '!./node_modules/**/*'
    ])
    .pipe(gulp.dest('../dist/'));
}

// Copy image files
function copyImg() {
  return gulp
    .src([
      './img-website/**/*',
    ])
    .pipe(imagemin())
    .pipe(gulp.dest('../dist/img-website/'));
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css).on('add', function(path, stats) {
    console.log(`File ${path} was added`);
  });
  gulp.watch("./js/**/*", js).on('add', function(path, stats) {
    console.log(`File ${path} was added`);
  });
  gulp.watch('./resources/*', gulp.series(pugCompile,browserSyncReload)).on('add', function(path, stats) {
        console.log(`File ${path} was added`);
    });

  gulp.watch('./conclusion/*', gulp.series(pugComp, browserSyncReload)).on('add', function(path, stats) {
        console.log(`File ${path} was added`);
    });


  gulp.watch(["!./node_modules", "./**/*.html"], browserSyncReload).on('add', function(path, stats) {
    console.log(`File ${path} was added`);
  });
}


// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, gulp.parallel(css, js, copyHtml, copyImg, pugCompile, pugComp));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
