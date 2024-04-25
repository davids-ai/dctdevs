const gulp = require("gulp");
const sass = require("gulp-sass")(require('sass')); // Agrega (require('sass')) aquí para especificar el compilador Sass
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

//scss to css
function style() {
  return gulp
    .src("assets/scss/**/*.scss", { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'compressed'
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer("last 2 versions"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("assets/css"))
    .pipe(browserSync.reload({
      stream: true
    }));
}

// Watch function
function watch() {
  browserSync.init({
    server: {
      proxy: "localhost/voxo/html/index.html"
    }
  });
  gulp.watch("assets/scss/**/*.scss", style);
  gulp.watch("html/*").on("change", browserSync.reload);
  gulp.watch("assets/css/*.css").on("change", browserSync.reload);

}

exports.style = style;
exports.watch = watch;

const build = gulp.parallel(style, watch);
gulp.task("default", build);
