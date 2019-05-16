var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var autoprefixer = require('autoprefixer');

gulp.task('copy-html', gulp.series(function(){
    return gulp.src('./source/**/*.html')
        .pipe(gulp.dest('./public/'))
}));

gulp.task('sass', gulp.series(function(){
    var plugins = [
        autoprefixer({ browsers: ['last 2 version', '> 5%'] })
    ];
    return gulp.src('./source/sass/**/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'nested',
            includePaths: ['./node_modules/bootstrap/scss']
        }).on('error', $.sass.logError))
        .pipe($.postcss(plugins))
        // .pipe($.if(options.env === 'production', $.cleanCss()))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/stylesheet'))
        // .pipe(browserSync.stream());
})); 

gulp.task('babel', gulp.series(function(){
    return gulp.src('./source/javascript/**/*.js')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['@babel/env']
        }))
        .pipe($.concat('main.js'))
        // .pipe($.if(options.env === 'production', $.uglify()))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/javascript'))
        // .pipe(browserSync.stream());
}));

gulp.task('copy-images', gulp.series(function(){
    return gulp.src(['./source/images/**/*.png', './source/images/**/*.jpg', './source/images/**/*.svg'])
        .pipe(gulp.dest('./public/images'))
}));

gulp.task('watch', gulp.series(function () {
    gulp.watch('./source/**/*.html', gulp.series('copy-html'));
    gulp.watch('./source/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('./source/javascript/**/*.js', gulp.series('babel'));
}));

gulp.task('stream', gulp.series(function () {
    $.watch('./source/**/*.html', gulp.series('copy-html'));
    $.watch('./source/sass/**/*.scss', gulp.series('sass'));
    $.watch('./source/javascript/**/*.js', gulp.series('babel'));
}));

gulp.task('default', gulp.series(['copy-html', 'sass', 'babel', 'copy-images', 'watch', 'stream']));