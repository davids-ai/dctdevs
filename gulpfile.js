const gulp = require("gulp");
const sass = require("gulp-sass")(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const historyFallback = require("connect-history-api-fallback"); // Importa el middleware

// Función para compilar SCSS a CSS
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
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest("assets/css"))
    .pipe(browserSync.stream());
}

// Función para observar cambios
function watch() {
  browserSync.init({
    server: {
      baseDir: "./", // Directorio base del servidor
      index: "index.html", // Archivo de entrada principal
      middleware: [historyFallback()] // Middleware para redirigir todas las solicitudes a index.html
    }
  });

  gulp.watch("assets/scss/**/*.scss", style);
  gulp.watch("front-end/*.html").on("change", browserSync.reload);
  gulp.watch("assets/css/*.css").on("change", browserSync.reload);
}

exports.style = style;
exports.watch = watch;

const build = gulp.parallel(style, watch);
gulp.task("default", build);
