var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var connect = require('gulp-connect');
var Builder = require('systemjs-builder');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var mergeStream = require('merge-stream');
var history = require('connect-history-api-fallback');
var watch = require('gulp-watch');

var tsProject = ts.createProject("tsconfig.json", {
  typescript: require("typescript")
});

var config = {
  dist: "./dist",
  tsFiles: [
    "./src/**/*.ts"
  ],
  htmlFiles: [
    "./src/**/*.html"
  ],
  tsOut: "./tsout"
}


/**
 * App
 */

gulp.task("app:ts", function() {
  var tsResult = gulp.src(config.tsFiles)
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));

  return tsResult.js
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(config.tsOut))
});

gulp.task("app:systemjs", function(cb) {
  var appJs = config.tsOut + "/app"
  var buildTask = appJs + " - " + "dist/js/vendor";

  var builder = new Builder();
  builder.reset();
  builder.loadConfig("config.js")
    .then(function() {
      return builder.build(buildTask, "dist/js/app.js");
    })
     .then(function() {
        cb();
     })
     .catch(function(err) {
        console.log(err);
        cb(err);
     });
})

gulp.task("app:html", function() {
  return gulp
    .src(config.htmlFiles)
    .pipe(gulp.dest(config.dist))
})

gulp.task("app:js", function(cb) {
  runSequence("app:ts", "app:systemjs", cb)
})

gulp.task("app", ["app:js", "app:html"], function() {
})

/**
 * Vendor
 */

gulp.task("vendor:systemjs", ["app:ts"], function(cb) {
   var appJs = config.tsOut + "/**/*"
   var buildTask = appJs + " - [" + appJs + "]";

   var builder = new Builder();
   builder.reset();
   builder.loadConfig("config.js")
     .then(function() {
       return builder.build(buildTask, config.dist + "/js/vendor.js");
     })
     .then(function() {
        cb();
     })
     .catch(function(err) {
        console.log(err);
        cb(err);
     });
 });

gulp.task("vendor:globals", function() {
  var globals = gulp.src([
    "jspm_packages/system.js",
    "./jspm_packages/github/jmcriffey/bower-traceur-runtime@0.0.88/traceur-runtime.js",
    "./jspm_packages/npm/reflect-metadata@0.1.0/Reflect.js",
    "./jspm_packages/github/moment/moment@2.10.3/moment.js"
  ])
  .pipe(concat("globals.js"));

  var moduleLoader = gulp.src("jspm_packages/es6-module-loader.js")

  return mergeStream(globals, moduleLoader)
    .pipe(gulp.dest("dist/js"));
})

gulp.task("vendor", ["vendor:globals", "vendor:systemjs"], function() {
});


/**
 * Main Tasks
 */

gulp.task("default", ["app", "vendor"], function() {

})

gulp.task("clean", function(cb) {
  del([config.dist, config.tsOut], cb)
});

gulp.task("dev", ["default"], function(cb) {
  gulp.watch(config.tsFiles, ["app:js"])
  gulp.watch(config.htmlFiles, ["app:html"])
  watch(config.dist)
    .pipe(connect.reload());

  connect
    .server({
      root: "./dist",
      port: 8080,
      host: "0.0.0.0",
      livereload: true,
      middleware: function(connect, opt) {
        return [ history() ];
      }
    })
})
