/**
 * Modules
 */
var gulp            = require('gulp'),
    watch           = require('gulp-watch'),
    prefixer        = require('gulp-autoprefixer'),
    uglify          = require('gulp-uglify'),
    sass            = require('gulp-sass'),
    sourcemaps      = require('gulp-sourcemaps'),
    rigger          = require('gulp-rigger'),
    fileinclude     = require('gulp-file-include'),
    cssmin          = require('gulp-minify-css'),
    imagemin        = require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant'),
    rimraf          = require('rimraf'),
    browserSync     = require("browser-sync"),
    pug             = require('gulp-pug'),
    plumber         = require('gulp-plumber'),
    reload          = browserSync.reload;

    var path = {
        build: { 
            html: 'build/',
            js: 'build/js/',
            css: 'build/css/',
            img: 'build/img/',
            fonts: 'build/fonts/'
        },
        src: { 
            pug: 'src/*.pug',
            js: 'src/js/script.js',
            style: 'src/sass/style.sass',
            img: 'src/img/**/*.*', 
            fonts: 'src/fonts/**/*.*'
        },
        watch: { 
            pug: 'src/**/*.pug',
            js: 'src/js/**/*.js',
            style: 'src/sass/**/*.sass',
            img: 'src/img/**/*.*',
            fonts: 'src/fonts/**/*.*'
        },
        clean: './build'
    };

    var config = {
        server: {
            baseDir: "./build"
        },
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: "FrontEnd"
    };

    gulp.task('html:build', function () {
        gulp.src(path.src.pug) 
            .pipe(plumber())
            .pipe(fileinclude({indent: true}))
            .pipe(pug())            
            .pipe(gulp.dest(path.build.html)) 
            .pipe(reload({stream: true})); 
    });

    gulp.task('js:build', function () {
        gulp.src(path.src.js) 
            .pipe(plumber())
            .pipe(fileinclude())
            .pipe(sourcemaps.init()) 
            .pipe(uglify()) 
            .pipe(sourcemaps.write()) 
            .pipe(gulp.dest(path.build.js)) 
            .pipe(reload({stream: true})); 
    });

    gulp.task('style:build', function () {
        gulp.src(path.src.style) 
            .pipe(plumber())
            .pipe(sourcemaps.init()) 
            .pipe(sass()) 
            .pipe(prefixer()) 
            .pipe(cssmin()) 
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path.build.css)) 
            .pipe(reload({stream: true}));
    });

    gulp.task('image:build', function () {
        gulp.src(path.src.img) 
            .pipe(imagemin({ 
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            }))
            .pipe(gulp.dest(path.build.img)) 
            .pipe(reload({stream: true}));
    });

    gulp.task('fonts:build', function() {
        gulp.src(path.src.fonts)
            .pipe(gulp.dest(path.build.fonts))
    });

    gulp.task('build', [
        'html:build',
        'js:build',
        'style:build',
        'fonts:build',
        'image:build'
    ]);

    gulp.task('watch', function(){
        watch([path.watch.pug], function(event, cb) {
            gulp.start('html:build');
        });
        watch([path.watch.style], function(event, cb) {
            setTimeout(function(){gulp.start('style:build')}, 500);
        });
        watch([path.watch.js], function(event, cb) {
            gulp.start('js:build');
        });
        watch([path.watch.img], function(event, cb) {
            gulp.start('image:build');
        });
        watch([path.watch.fonts], function(event, cb) {
            gulp.start('fonts:build');
        });
    });

    gulp.task('webserver', function () {
        browserSync(config);
    });

    gulp.task('clean', function (cb) {
        rimraf(path.clean, cb);
    });

    gulp.task('default', ['build', 'webserver', 'watch']);