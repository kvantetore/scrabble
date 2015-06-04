var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var connect = require('gulp-connect');
var Builder = require('systemjs-builder');
var runSequence = require('run-sequence');

var tsProject = ts.createProject({
  target: "es5",
  module: "system",
  emitDecoratorMetadata: true,
  declaration: false,
  noImplicitAny: false,
  typescript: require("typescript")
});

var config = {
  dist: "./dist",
  tsFiles: [
    "./src/**/*.ts",
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
  var appJs = config.tsOut + "/**/*"
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
    .src("./src/**/*.html")
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

gulp.task("vendor:systemjs", function(cb) {
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
  gulp.src([
    "jspm_packages/system.js",
    "jspm_packages/es6-module-loader.js",
    "./jspm_packages/github/jmcriffey/bower-traceur-runtime@0.0.88/traceur-runtime.js",
    "./jspm_packages/npm/reflect-metadata@0.1.0/Reflect.js"
  ])
  .pipe(gulp.dest("dist/js"));
})

gulp.task("vendor", ["vendor:globals", "vendor:systemjs"], function() {
});


/**
 * Main Tasks
 */

gulp.task("default", ["typescript", "vendor"], function() {

})

gulp.task("clean", function(cb) {
  del([config.dist, config.tsOut], cb)
});


gulp.task("connect", function() {
    connect.server({
        root: "./dist",
        port: 8080,
        host: "0.0.0.0"
    })
});
