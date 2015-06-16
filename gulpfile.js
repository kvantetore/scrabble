var gulp = require('gulp');
var sass = require('gulp-sass')
var autoprefier = require('gulp-autoprefixer')
var filter = require('gulp-filter');
var del = require('del');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');

gulp.task("default", ["vendor:css"], function() {
})

gulp.task("clean", function(cb) {
	del("public/css", cb);
})

gulp.task("vendor:css", function() {
	return gulp
		.src("src/angular2_material/**/*.scss", {base: "src"})
		.pipe(filter(function(a){ return a.stat && a.stat.size }))
		.pipe(sass())
		.pipe(autoprefier())
		.pipe(gulp.dest("public/css"))
		;
});

var tsProject = ts.createProject("src/tsconfig.json", { typescript: require("typescript")});

var through = require('through2');

/** 
 * Converts an external typescript definition file to an ambient external module.
 */
function toAmbientModule() {
	function convert(file, enc, callback) {
		var contents = String(file.contents);
		//remove export declare on each
		contents = contents.replace(/^[ \t]*export declare /gm, "");

		//remove import statements		
		//contents = contents.replace(/^[ \t]*import .*/gm, "")
		
		//add indent
		contents = contents.replace(/^/gm, "    ");
		
		//wrap content in ambient external module declaration
		contents = "declare module '" + file.relative.replace(/\.d\.ts$/, "") + "' {\n" + contents + "\n}\n";
		
		//replace original file contents		 
		file.contents = new Buffer(contents);
		callback(null, file);
	}
	
	return through.obj(convert);
}

gulp.task("vendor:d.ts", function() {
	return gulp
		.src("typings/angular2_material/src/**/*.d.ts", { base: "typings"})
		.pipe(toAmbientModule())
		.pipe(concat("/angular2_material/angular2_material.d.ts"))
		.pipe(gulp.dest("typings"));
})

gulp.task("vendor:ts", function() {
	var tsResult = gulp
		.src([
			"src/angular2_material/**/*.ts",
			"src/references.d.ts"
		])
		.pipe(ts(tsProject))
		.pipe(gulp.dest("vendor/angular2_material"))
})

gulp.task("app:ts", function() {
	var tsResult = gulp
		.src([
			"src/app/components/home/*.ts",
			"src/references.d.ts"
		])
		.pipe(ts(tsProject))
		.pipe(gulp.dest("./tsout"))
})
