const gulp = require('gulp');
const pug = require('gulp-pug');
const data = require('gulp-data');
const textFile = require('./public/game/assets/text/textTemplate.js');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browsersync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babel = require('babelify');

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: '../dist/',
        },
        port: 4000,
        open: false,
    });
    done();
}

// BrowserSync reload
function browserSyncReload(done) {
    console.log('-> reloading browser...');
    setTimeout(browsersync.reload, 5000);
    done();
}   

// Clean assets
function clean() {
    return del(['../dist/game/assets'], {force: true});
}

// Assets
function moveAssets() {
    return gulp
        .src([
            'public/game/assets/**/*',
        ])
        .pipe(imagemin())
        .pipe(gulp.dest('../dist/game/assets'));
}

// Pug
function pugCompile() {
    return gulp.src('views/pages/game/index.pug')
        .pipe(data(function(file) {
            return textFile;
        }))
        .pipe(pug())
        .pipe(gulp.dest('../dist/game')); 
};

// CSS task
function css() {
    return gulp
        .src('./public/game/scss/main.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['./node_modules/sass-mq', './public/**/*.scss'],
        }))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(rename('styles-game.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('../dist/game/css'))
        .pipe(browsersync.stream());
}


// JS, browserify, babel, etc...
function compileJs(done) {
    let bundler = browserify('public/game/controllers/game/gameEntry.js', {debug: true}).transform(babel);
    bundler.bundle()
        .on('error', function(err) {
            console.error(err); 
            this.emit('end');
        })
        .pipe(source('bundle-game.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('../dist/game/js'));
    
    done();
}

// Watch files
function watchFiles() {
    console.log('The watch starts');
    gulp.watch('./public/game/**/*.scss', css).on('change', function(path, stats) {
        console.log(`File ${path} was changed`);
    });
    gulp.watch('./**/*.pug', gulp.series(pugCompile, browserSyncReload)).on('change', function(path, stats) {
        console.log(`File ${path} was changed`);
    });
    gulp.watch('./public/game/assets/**/*', gulp.series(moveAssets, browserSyncReload)).on('change', function(path, stats) {
        console.log(`File ${path} was changed`);
    });
    gulp.watch('./public/game/**/*.js', gulp.series(compileJs, browserSyncReload)).on('change', function(path, stats) {
        console.log(`File ${path} was changed`);
    });
}


// Define complex tasks
const build = gulp.series(clean, gulp.parallel(moveAssets, css, compileJs, pugCompile));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.build = build;
exports.watch = watch;
exports.default = build;
