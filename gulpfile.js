const gulp = require("gulp");
const sass = require("gulp-sass")(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const historyFallback = require("connect-history-api-fallback");

// Compilar SCSS a dist
function style() {
  return gulp
    .src("assets/scss/**/*.scss", { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(
      sass({ outputStyle: 'compressed' }).on("error", sass.logError)
    )
    .pipe(autoprefixer("last 2 versions"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest("dist/assets/css"))
    .pipe(browserSync.stream());
}

// Copiar HTML a dist
function html() {
  return gulp.src("front-end/*.html")
    .pipe(gulp.dest("dist"));
}

// Watch + servidor
function watch() {
  browserSync.init({
    server: {
      baseDir: "dist",
      index: "index.html",
      middleware: [historyFallback()]
    }
  });

  gulp.watch("assets/scss/**/*.scss", style);
  gulp.watch("front-end/*.html", html).on("change", browserSync.reload);
}

// Tareas
gulp.task("build", gulp.parallel(style, html));
gulp.task("default", gulp.series("build", watch));
