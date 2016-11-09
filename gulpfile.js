var gulp       = require('gulp'),
    gulputil   = require('gulp-util'),
    browserify = require('gulp-browserify'),
    gulpif     = require('gulp-if'),
    uglify     = require('gulp-uglify'),
    connect    = require('gulp-connect'),
    minifyHTML = require('gulp-minify-html'),
    concat     = require('gulp-concat'),
    sass       = require('gulp-sass');


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


/* copylibs */
gulp.task('movecss', function () {
  return gulp.src([
      "./node_modules/font-awesome/css/font-awesome.min.css",
      "./node_modules/bootstrap/dist/css/bootstrap.min.css"
                    ])
    .pipe(gulp.dest(outputDir + 'css'));
});

gulp.task('movejs', function () {
  return gulp.src([
      "./node_modules/bootstrap/dist/js/bootstrap.min.js"
                    ])
    .pipe(gulp.dest(outputDir + 'js'));
});

gulp.task('movefonts', function () {
  return gulp.src([
      "./node_modules/font-awesome/fonts/*"
                    ])
    .pipe(gulp.dest(outputDir + 'fonts'));
});




gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('app.js'))
    .pipe(browserify())
    .on('error', gulputil.log)
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
});

gulp.task('sass', function () {
  return gulp.src(sassSources)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(outputDir + 'css'));
});


gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch(['components/sass/*.scss', 'components/sass/*/*.scss'], ['sass']);
  gulp.watch('build/dev/*.html', ['html']);
});


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

gulp.task('default', ['watch', 'html', 'js','sass', 'move', 'connect','movecss','movejs','movefonts']);