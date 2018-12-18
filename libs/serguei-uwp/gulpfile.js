/*global require */
/*!
 * @see {@link https://github.com/mildrenben/surface/blob/master/gulpfile.js}
 * @see {@link https://www.webstoemp.com/blog/gulp-setup/}
 * @see {@link https://gulpjs.com/plugins/blackList.json}
 * @see {@link https://hackernoon.com/how-to-automate-all-the-things-with-gulp-b21a3fc96885}
 */
var currentLibName = "serguei-uwp";

var getTimestamp = function () {
	var dateTime = Date.now();
	return Math.floor(dateTime / 1000);
};

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var minifyCss = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var concat = require("gulp-concat");
/* var bundle = require("gulp-bundle-assets"); */

var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

/*!
 * @see {@link https://github.com/postcss/autoprefixer#options}
 */
var autoprefixer = require("gulp-autoprefixer");
var autoprefixerOptions;
autoprefixerOptions = {
	browsers: ["last 2 versions"]
};

/*!
 * @see {@link https://github.com/babel/babel/issues/7910}
 */

var babel = require("gulp-babel");
var babelOptions;
babelOptions = {
	"sourceType": "script",
	"presets": ["@babel/env"],
	"plugins": ["@babel/plugin-transform-object-assign",
		"@babel/plugin-transform-arrow-functions",
		"@babel/plugin-transform-async-to-generator"]
};

/*!
 * @see {@link https://github.com/beautify-web/js-beautify}
 * a JSON-formatted file indicated by the --config parameter
 * a .jsbeautifyrc file containing JSON data at any level of the filesystem above $PWD
 * using external config may cause
 * failure to find it
 * if the input/output files reside higher
 * than the config file itself
 */
/* var beautify = require("gulp-jsbeautifier"); */
var beautifyOptions;
beautifyOptions = {
	/* "config": ".jsbeautifyrc", */
	"editorconfig": false,
	"indent_size": 4,
	"indent_char": "\t",
	"indent_with_tabs": true,
	"eol": "\n",
	"end_with_newline": true,
	"indent_level": 0,
	"preserve_newlines": true,
	"max_preserve_newlines": 10,
	"html": {
		"indent_inner_html": true,
		"indent_scripts": false,
		"js": {},
		"css": {}
	},
	"css": {
		"newline_between_rules": true
	},
	"js": {
		"space_in_paren": false,
		"space_in_empty_paren": false,
		"jslint_happy": false,
		"space_after_anon_function": true,
		"space_after_named_function": false,
		"brace_style": "collapse",
		"unindent_chained_methods": false,
		"break_chained_methods": true,
		"keep_array_indentation": true,
		"unescape_strings": false,
		"wrap_line_length": 0,
		"e4x": false,
		"comma_first": false,
		"operator_position": "before-newline"
	}
};

/*!
 * @see {@link https://prettier.io/docs/en/options.html}
 * using external config may cause
 * failure to find it
 * if the input/output files reside higher
 * than the config file itself
 */
var prettier = require("gulp-prettier");
var prettierOptions;
prettierOptions = {
	/* "config": ".prettierrc", */
	"tabWidth": 4,
	"useTabs": true,
	"endOfLine": "lf",
	"printWidth:": 0
};

var stripDebug = require("gulp-strip-debug");

var options = {
	uwp: {
		src: "../../cdn/uwp-web-framework/2.0/src/*.js",
		js: "../../cdn/uwp-web-framework/2.0/js",
		scss: "../../cdn/uwp-web-framework/2.0/scss/*.scss",
		css: "../../cdn/uwp-web-framework/2.0/css"
	},
	material: {
		scss: "../../fonts/MaterialDesign-Webfont/2.2.43/scss/*.scss",
		css: "../../fonts/MaterialDesign-Webfont/2.2.43/css"
	},
	roboto: {
		scss: "../../fonts/roboto-fontfacekit/2.137/scss/*.scss",
		css: "../../fonts/roboto-fontfacekit/2.137/css"
	},
	robotomono: {
		scss: "../../fonts/roboto-mono-fontfacekit/2.0.986/scss/*.scss",
		css: "../../fonts/roboto-mono-fontfacekit/2.0.986/css"
	},
	highlightjs: {
		src: "../../cdn/highlight.js/9.12.0/src/*.js",
		js: "../../cdn/highlight.js/9.12.0/js",
		scss: "../../cdn/highlight.js/9.12.0/scss/*.scss",
		css: "../../cdn/highlight.js/9.12.0/css"
	},
	adaptivecards: {
		custom: {
			scss: "../../cdn/adaptivecards/1.1.0/scss/*.scss",
			css: "../../cdn/adaptivecards/1.1.0/css"
		}
	},
	typeboost: {
		scss: "../../cdn/typeboost-uwp.css/0.1.8/scss/*.scss",
		css: "../../cdn/typeboost-uwp.css/0.1.8/css"
	},
	glightbox: {
		src: "../../cdn/glightbox/1.0.8/src/*.js",
		js: "../../cdn/glightbox/1.0.8/js",
		scss: "../../cdn/glightbox/1.0.8/scss/*.scss",
		css: "../../cdn/glightbox/1.0.8/css"
	},
	lightgalleryjs: {
		src: "../../cdn/lightgallery.js/1.1.1/src/*.js",
		js: "../../cdn/lightgallery.js/1.1.1/js",
		scss: "../../cdn/lightgallery.js/1.1.1/scss/*.scss",
		css: "../../cdn/lightgallery.js/1.1.1/css",
		plugins: {
			src: "../../cdn/lightgallery.js/1.1.1/src/plugins/*.js",
			js: "../../cdn/lightgallery.js/1.1.1/js",
			concatOptions: {
				js: {
					path: "lightgallery.plugins.fixed.js",
					newLine: "\n"
				}
			}
		}
	},
	includeStyle: {
		scss: "./css/include-style/scss/*.scss",
		css: "./css/include-style",
		concatOptions: {
			css: {
				path: "../pages.css",
				newLine: "\n"
			}
		}
	},
	includeScript: {
		src: "./js/include-script/src/*.js",
		js: "./js/include-script",
		concatOptions: {
			js: {
				path: "../pages.js",
				newLine: "\n"
			}
		}
	},
	libbundle: {
		src: "./src/*.js",
		js: "./js",
		scss: "./scss/*.scss",
		css: "./css"
	},
	vendors: {
		src: [
			// "../../cdn/adaptivecards/1.1.0/js/adaptivecards.fixed.js",
			"../../cdn/imagesloaded/4.1.4/js/imagesloaded.pkgd.fixed.js",
			"../../cdn/lazyload/10.19.0/js/lazyload.iife.fixed.js",
			"../../cdn/ReadMore.js/1.0.0/js/readMoreJS.fixed.js",
			"../../cdn/uwp-web-framework/2.0/js/uwp.core.fixed.js",
			"../../cdn/resize/1.0.0/js/any-resize-event.fixed.js",
			"../../cdn/macy.js/2.3.1/js/macy.fixed.js"
		],
		js: "./js",
		scss: [
			"../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
			"../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
			"../../cdn/adaptivecards/1.1.0/css/adaptivecards.custom.css",
			"../../cdn/typeboost-uwp.css/0.1.8/css/typeboost-uwp.css",
			"../../cdn/uwp-web-framework/2.0/css/uwp.style.fixed.css"
		],
		css: "./css",
		concatOptions: {
			css: {
				path: "vendors.css",
				newLine: "\n"
			},
			js: {
				path: "vendors.js",
				newLine: "\n"
			}
		}
	},
	pwabuilderServiceworkers: {
		src: "../../cdn/pwabuilder-serviceworkers/1.1.1/serviceWorker2/src/*.js",
		js: "../../"
	}
};

/*!
 * @see {@link https://browsersync.io/docs/gulp}
 */
gulp.task("browser-sync", [
		/* "bundle-assets" */
	], function () {

	browserSync.init({
		server: "../../"
	});

	//gulp.watch("./bower_components/mui/src/sass/**/*.scss", ["compile-uwp-scss"]);
	//gulp.watch("../../fonts/material-design-icons/3.0.1/scss/**/*.scss", ["compile-material-scss"]);
	//gulp.watch("../../fonts/MaterialDesign-Webfont/2.2.43/scss/**/*.scss", ["compile-material-scss"]);
	//gulp.watch("../../fonts/roboto-fontfacekit/2.137/scss/**/*.scss", ["compile-roboto-scss"]);
	//gulp.watch("../../fonts/roboto-mono-fontfacekit/2.0.986/scss/**/*.scss", ["compile-roboto-mono-scss"]);
	//gulp.watch("../../cdn/highlight.js/9.12.0/scss/**/*.scss", ["compile-highlightjs-css"]);
	gulp.watch("../../**/*.html").on("change", reload);
	gulp.watch("../../libs/" + currentLibName + "/css/*.css").on("change", reload);
	gulp.watch("../../libs/" + currentLibName + "/css/include-style/*.css").on("change", reload);
	gulp.watch("../../libs/" + currentLibName + "/css/include-style/scss/*.scss", ["compile-include-style-css"]);
	gulp.watch("../../libs/" + currentLibName + "/scss/*.scss", ["compile-libbundle-css"]);
	gulp.watch("../../libs/" + currentLibName + "/js/*.js").on("change", reload);
	gulp.watch("../../libs/" + currentLibName + "/js/include-script/*.js").on("change", reload);
	gulp.watch("../../libs/" + currentLibName + "/js/include-script/src/*.js", ["compile-include-script-js"]);
	gulp.watch("../../libs/" + currentLibName + "/src/*.js", ["compile-libbundle-js"]);
	gulp.watch("../../libs/" + currentLibName + "/json/*.json").on("change", reload);
});

gulp.task("compile-material-css", function () {
	gulp.src(options.material.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.material.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.material.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-roboto-css", function () {
	gulp.src(options.roboto.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.roboto.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.roboto.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-roboto-mono-css", function () {
	gulp.src(options.robotomono.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.robotomono.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.robotomono.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-libbundle-css", function () {
	gulp.src(options.libbundle.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.libbundle.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.libbundle.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-libbundle-js", function () {
	gulp.src(options.libbundle.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.libbundle.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.libbundle.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-include-style-css", function () {
	gulp.src(options.includeStyle.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(concat(options.includeStyle.concatOptions.css))
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.includeStyle.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.includeStyle.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-include-script-js", function () {
	gulp.src(options.includeScript.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(concat(options.includeScript.concatOptions.js))
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.includeScript.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.includeScript.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-vendors-css", function () {
	gulp.src(options.vendors.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(concat(options.vendors.concatOptions.css))
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.vendors.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.vendors.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-vendors-js", function () {
	gulp.src(options.vendors.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(concat(options.vendors.concatOptions.js))
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.vendors.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.vendors.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-typeboost-uwp-css", function () {
	gulp.src(options.typeboost.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.typeboost.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.typeboost.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-adaptivecards-custom-css", function () {
	gulp.src(options.adaptivecards.custom.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.adaptivecards.custom.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.adaptivecards.custom.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-uwp-web-framework-css", function () {
	gulp.src(options.uwp.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.uwp.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.uwp.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-uwp-web-framework-js", function () {
	gulp.src(options.uwp.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.uwp.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.uwp.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-highlightjs-css", function () {
	gulp.src(options.highlightjs.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.highlightjs.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.highlightjs.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-highlightjs-js", function () {
	gulp.src(options.highlightjs.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.highlightjs.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.highlightjs.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-lightgalleryjs-css", function () {
	gulp.src(options.lightgalleryjs.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.lightgalleryjs.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.lightgalleryjs.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-lightgalleryjs-js", function () {
	gulp.src(options.lightgalleryjs.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.lightgalleryjs.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.lightgalleryjs.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-lightgalleryjs-plugins-js", function () {
	gulp.src(options.lightgalleryjs.plugins.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(concat(options.lightgalleryjs.plugins.concatOptions.js))
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.lightgalleryjs.plugins.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.lightgalleryjs.plugins.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-glightbox-css", function () {
	gulp.src(options.glightbox.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.glightbox.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.glightbox.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-glightbox-js", function () {
	gulp.src(options.glightbox.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.glightbox.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.glightbox.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-pwabuilder-serviceworkers-js", function () {
	gulp.src(options.pwabuilderServiceworkers.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(rename(function (path) {
			/* path.basename = path.basename.replace("pwabuilder-", "");
			path.basename = path.basename.replace(".fixed", ""); */
			var pattern = /pwabuilder-|.fixed/ig;
			path.basename = path.basename.replace(pattern, "");
		}))
	.pipe(replace("pwabuilder-offline", "" + currentLibName + "-offline-v" + getTimestamp()))
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.pwabuilderServiceworkers.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.pwabuilderServiceworkers.js))
	.pipe(reload({
			stream: true
		}));
});

/* gulp.task("bundle-assets", function () {
return gulp.src("./gulp-bundle-assets.config.js")
.pipe(bundle())
.pipe(bundle.results("./"))
.pipe(gulp.dest("./"));
}); */

gulp.task("default", ["browser-sync"]);
