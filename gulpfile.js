const gulp = require("gulp");
const sass = require("gulp-sass")(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const historyFallback = require("connect-history-api-fallback");

// Compilar SCSS a CSS
function style() {
  return gulp
    .src("assets/scss/**/*.scss", { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(
      sass({ outputStyle: 'compressed' }).on("error", sass.logError)
    )
    .pipe(autoprefixer("last 2 versions"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest("assets/css"))
    .pipe(browserSync.stream());
}

// Servidor + Watch
function watch() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html",
      middleware: [historyFallback()]
    }
  });

  gulp.watch("assets/scss/**/*.scss", style);
  gulp.watch("front-end/*.html").on("change", browserSync.reload);
  gulp.watch("assets/css/*.css").on("change", browserSync.reload);
}

// Tareas exportadas
exports.style = style;
exports.watch = watch;

// Tarea de desarrollo (por defecto)
gulp.task("default", gulp.parallel(style, watch));

// 🆕 Tarea para build (sin servidor)
gulp.task("build", style);
