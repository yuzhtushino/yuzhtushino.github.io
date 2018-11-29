/*!
 * @see {@link https://github.com/mildrenben/surface/blob/master/gulpfile.js}
 */
// gulpfile.js
var gulp = require("gulp"),
bundle = require("gulp-bundle-assets"),
sass = require("gulp-sass"),
autoprefixer = require("gulp-autoprefixer"),
minifyCss = require("gulp-minify-css"),
browserSync = require("browser-sync").create(),
reload = browserSync.reload,
babel = require("gulp-babel"),
uglify = require("gulp-uglify"),
rename = require("gulp-rename"),

uwpcss = {
	scss: "../../cdn/uwp-web-framework/2.0/scss/uwp.style.fixed.scss",
	css: "../../cdn/uwp-web-framework/2.0/css"
},

uwpjs = {
	src: "../../cdn/uwp-web-framework/2.0/src/uwp.core.fixed.js",
	js: "../../cdn/uwp-web-framework/2.0/js"
},

/* material = {
scss: "../../fonts/material-design-icons/3.0.1/scss/material-icons.scss",
css: "../../fonts/material-design-icons/3.0.1/css"
}, */

material = {
	scss: "../../fonts/MaterialDesign-Webfont/2.2.43/scss/materialdesignicons.scss",
	css: "../../fonts/MaterialDesign-Webfont/2.2.43/css"
},

roboto = {
	scss: "../../fonts/roboto-fontfacekit/2.137/scss/roboto.scss",
	css: "../../fonts/roboto-fontfacekit/2.137/css"
},

robotomono = {
	scss: "../../fonts/roboto-mono-fontfacekit/2.0.986/scss/roboto-mono.scss",
	css: "../../fonts/roboto-mono-fontfacekit/2.0.986/css"
},

highlightjs = {
	scss: "../../cdn/highlight.js/9.12.0/scss/hljs.scss",
	css: "../../cdn/highlight.js/9.12.0/css"
},

typeboost = {
	scss: "../../cdn/typeboost-uwp.css/0.1.8/scss/typeboost-uwp.scss",
	css: "../../cdn/typeboost-uwp.css/0.1.8/css"
},

glightbox = {
	scss: "../../cdn/glightbox/1.0.8/scss/glightbox.fixed.scss",
	css: "../../cdn/glightbox/1.0.8/css"
},

lightgallery = {
	scss: "../../cdn/lightgallery.js/1.1.1/scss/lightgallery.fixed.scss",
	css: "../../cdn/lightgallery.js/1.1.1/css"
},

includeStyle = {
	scss: "./css/include-style/scss/*.scss",
	css: "./css/include-style"
},

includeScript = {
	src: "./js/include-script/src/*.js",
	js: "./js/include-script"
},

bundlejs = {
	src: "./src/bundle.js",
	js: "./js"
},

bundlecss = {
	scss: "./scss/bundle.scss",
	css: "./css"
};

gulp.task("browser-sync", ["bundle-assets"], function () {
	browserSync.init({
		server: "../../"
	});

	//gulp.watch("./bower_components/mui/src/sass/**/*.scss", ["compile-uwp-scss"]);
	//gulp.watch("../../fonts/material-design-icons/3.0.1/scss/**/*.scss", ["compile-material-scss"]);
	//gulp.watch("../../fonts/MaterialDesign-Webfont/2.2.43/scss/**/*.scss", ["compile-material-scss"]);
	//gulp.watch("../../fonts/roboto-fontfacekit/2.137/scss/**/*.scss", ["compile-roboto-scss"]);
	//gulp.watch("../../fonts/roboto-mono-fontfacekit/2.0.986/scss/**/*.scss", ["compile-roboto-mono-scss"]);
	//gulp.watch("../../cdn/highlight.js/9.12.0/scss/**/*.scss", ["compile-highlightjs-scss"]);
	gulp.watch("../../**/*.html").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/js/*.js").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/json/*.json").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/css/*.css").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/src/*.js", ["compile-bundle-js"]);
	gulp.watch("../../libs/serguei-uwp/scss/*.scss", ["compile-bundle-css"]);
	gulp.watch("../../libs/serguei-uwp/js/include-script/src/*.js", ["compile-include-script-js"]);
	gulp.watch("../../libs/serguei-uwp/js/include-script/*.js").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/css/include-style/scss/*.scss", ["compile-include-style-scss"]);
	gulp.watch("../../libs/serguei-uwp/css/include-style/*.css").on("change", reload);
});

gulp.task("compile-bundle-css", function () {
	gulp.src(bundlecss.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(gulp.dest(bundlecss.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(bundlecss.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-include-style-scss", function () {
	gulp.src(includeStyle.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(gulp.dest(includeStyle.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(includeStyle.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-uwp-web-framework-scss", function () {
	gulp.src(uwpcss.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(uwpcss.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-material-scss", function () {
	gulp.src(material.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(material.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-roboto-scss", function () {
	gulp.src(roboto.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(roboto.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-roboto-mono-scss", function () {
	gulp.src(robotomono.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(robotomono.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-highlightjs-scss", function () {
	gulp.src(highlightjs.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(highlightjs.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-typeboost-uwp-scss", function () {
	gulp.src(typeboost.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(typeboost.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-lightgalleryjs-scss", function () {
	gulp.src(lightgallery.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(lightgallery.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-glightbox-scss", function () {
	gulp.src(glightbox.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(glightbox.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-bundle-js", function () {
	gulp.src(bundlejs.src)
	.pipe(babel({
			presets: ["@babel/env"],
			plugins: ["@babel/plugin-transform-object-assign",
				"@babel/plugin-transform-arrow-functions"]
		}))
	.pipe(gulp.dest(bundlejs.js))
	.pipe(uglify())
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(gulp.dest(bundlejs.js));
});

gulp.task("compile-include-script-js", function () {
	gulp.src(includeScript.src)
	.pipe(babel({
			presets: ["@babel/env"],
			plugins: ["@babel/plugin-transform-object-assign",
				"@babel/plugin-transform-arrow-functions"]
		}))
	.pipe(gulp.dest(includeScript.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(uglify())
	.pipe(gulp.dest(includeScript.js));
});

gulp.task("babel-uwp-web-framework-js", function () {
	gulp.src(uwpjs.src)
	.pipe(babel({
			presets: ["@babel/env"],
			plugins: ["@babel/plugin-transform-object-assign",
				"@babel/plugin-transform-arrow-functions"]
		}))
	.pipe(gulp.dest(uwpjs.js));
});

gulp.task("bundle-assets", function () {
	return gulp.src("./gulp-bundle-assets.config.js")
	.pipe(bundle())
	.pipe(bundle.results("./")) // arg is destination of bundle.result.json
	.pipe(gulp.dest("./"));
});

gulp.task("default", ["browser-sync"]);
