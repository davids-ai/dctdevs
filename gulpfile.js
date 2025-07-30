const gulp = require("gulp");
const sass = require("gulp-sass")(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const historyFallback = require("connect-history-api-fallback");
const { deleteAsync } = require('del');

// 🔹 Compilar SCSS para DEV (en front-end/assets/css)
function styleDev() {
  return gulp.src("front-end/assets/scss/**/*.scss", { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on("error", sass.logError))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest("front-end/assets/css"))
    .pipe(browserSync.stream());
}

// 🔹 Compilar SCSS para BUILD (en dist/assets/css)
function styleBuild() {
  return gulp.src("front-end/assets/scss/**/*.scss")
    .pipe(sass({ outputStyle: 'compressed' }).on("error", sass.logError))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(gulp.dest("dist/assets/css"));
}

// 🔹 Copiar HTML a dist/
function copyHtml() {
  return gulp.src("front-end/*.html")
    .pipe(gulp.dest("dist"));
}

// 🔹 Copiar assets excepto SCSS a dist/assets
function copyAssets() {
  return gulp.src(["front-end/assets/**/*", "!front-end/assets/scss{,/**}"])
    .pipe(gulp.dest("dist/assets"));
}

// 🔹 Eliminar carpeta dist antes del build
function clean() {
  return deleteAsync(['dist']);
}

// 🔹 Servidor de desarrollo
function watchFiles() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "front-end/index.html",
      middleware: [historyFallback()]
    }
  });

  gulp.watch("front-end/assets/scss/**/*.scss", styleDev);
  gulp.watch("front-end/*.html").on("change", browserSync.reload);
  gulp.watch("front-end/assets/css/*.css").on("change", browserSync.reload);
}

// 🔹 Exportar tareas
exports.styleDev = styleDev;
exports.watch = watchFiles;
exports.build = gulp.series(
  clean,
  gulp.parallel(styleBuild, copyHtml, copyAssets)
);
exports.default = gulp.series(styleDev, watchFiles);
