/* setting proper plugins */
var gulp       = require('gulp'),
    gulputil   = require('gulp-util'),
    browserify = require('gulp-browserify'),
    gulpif     = require('gulp-if'),
    uglify     = require('gulp-uglify'),
    connect    = require('gulp-connect'),
    minifyHTML = require('gulp-minify-html'),
    concat     = require('gulp-concat'), // bundle js files into one files
    sass       = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

/* setting variables */
var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle;

env = 'dev';


if (env==='dev') {
  outputDir = 'build/dev/';
  sassStyle = 'expanded';
} else {
  outputDir = 'build/prod/';
  sassStyle = 'compressed';
}



jsSources   = ["components/js/app.js"];
sassSources = ["components/sass/style.scss"];
htmlSources = [outputDir + '*.html'];


/* copy fontawesome and bootstrap files to outputDir 'build' or 'prod' */
gulp.task('movecss', function () {
  return gulp.src([
      "./node_modules/font-awesome/css/font-awesome.min.css",
      "./node_modules/bootstrap/dist/css/bootstrap.min.css"
                    ])
    .pipe(gulp.dest(outputDir + 'css'));
});

/* copy bootstrap js files to outputDir*/
gulp.task('movejs', function () {
  return gulp.src([
      "./node_modules/bootstrap/dist/js/bootstrap.min.js"
                    ])
    .pipe(gulp.dest(outputDir + 'js'));
});

/* copy fonts to outputDir */
gulp.task('movefonts', function () {
  return gulp.src([
      "./node_modules/font-awesome/fonts/*"
                    ])
    .pipe(gulp.dest(outputDir + 'fonts'));
});

/* require and bundle js files into one file app.js */
gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('app.js'))
    .pipe(browserify())
    .on('error', gulputil.log)
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
});

/* handle sass files */
gulp.task('sass', function () {
  return gulp.src(sassSources)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(outputDir + 'css'));
});

/* setting watch rules : watch for sass & js & html files and trigger a task for each change */
gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch(['components/sass/*.scss', 'components/sass/*/*.scss'], ['sass']);
  gulp.watch('build/dev/*.html', ['html']);
});

/* server launch */
gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
});


gulp.task('html', function() {
  gulp.src('build/dev/*.html')
    .pipe(gulpif(env === 'prod', minifyHTML()))
    .pipe(gulpif(env === 'prod', gulp.dest(outputDir)))
});

// Copy images to production
gulp.task('move', function() {
  gulp.src('build/dev/images/**/*.*')
  .pipe(gulpif(env === 'prod', gulp.dest(outputDir+'images')))
});


/* the default tast, first task called */
gulp.task('default', ['watch', 'html', 'js','sass', 'move', 'connect','movecss','movejs','movefonts']);