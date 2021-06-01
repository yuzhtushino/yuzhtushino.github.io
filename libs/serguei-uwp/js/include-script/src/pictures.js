/*jslint browser: true */

/*jslint node: true */

/*global addClass, manageMacyItemAll, dataSrcImgClass, getByClass, GLightbox,
loadJsCss, macyClass, macyIsActiveClass, macyItemIsBindedClass,
manageDataSrcImgAll, manageExternalLinkAll, manageMacy, onMacyImagesLoaded,
updateMacyThrottled*/

/*!
 * page logic
 */
(function (root, document) {
	"use strict";

	root.runPictures = function () {

		/*!
		 * @see {@link https://glightbox.mcstudios.com.mx/#options}
		 */
		var glightboxClass = "glightbox";

		root.handleGLightbox = null;
		var manageGLightbox = function (linkClass) {
			var link = getByClass(document, linkClass)[0] || "";
			var initScript = function () {
				if (root.handleGLightbox) {
					root.handleGLightbox.destroy();
					root.handleGLightbox = null;
				}
				root.handleGLightbox = new GLightbox({
						selector: linkClass
					});
			};
			if (link) {
				if (!root.GLightbox) {
					var load;
					load = new loadJsCss(["./cdn/glightbox/1.0.8/css/glightbox.fixed.min.css",
								"./cdn/glightbox/1.0.8/js/glightbox.fixed.min.js"], initScript);
				} else {
					initScript();
				}
			}
		};

		var macy = getByClass(document, macyClass)[0] || "";

		var onMacyManage = function () {
			manageMacy(macyClass, {
				trueOrder: false,
				waitForImages: false,
				margin: 0,
				columns: 4,
				breakAt: {
					1280: 4,
					1024: 3,
					960: 2,
					640: 2,
					480: 1,
					360: 1
				}
			});
			addClass(macy, macyIsActiveClass);
			onMacyImagesLoaded(macy, updateMacyThrottled);
			manageMacyItemAll(macy);
			manageDataSrcImgAll(updateMacyThrottled);
			manageExternalLinkAll();
			manageGLightbox(glightboxClass);
		};

		var macyItems = [{
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26036740714_dd47df27c0_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26036740714_dd47df27c0_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26039009973_ed4b59a832_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26039009973_ed4b59a832_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26039010063_971c7482c2_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26039010063_971c7482c2_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26072583523_34e81c64eb_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26072583523_34e81c64eb_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26074591023_4cdb8c2578_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26074591023_4cdb8c2578_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26075482973_22a9cb2315_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26075482973_22a9cb2315_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26126310843_988c4cd54f_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26126310843_988c4cd54f_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26325951433_b1b2d0f6c9_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26325951433_b1b2d0f6c9_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26351278130_1f5b4f685d_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26351278130_1f5b4f685d_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26576984361_4c33589522_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26576984361_4c33589522_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26584072022_41e887d01a_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26584072022_41e887d01a_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26584858872_01827e6380_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26584858872_01827e6380_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26587130302_94a53b425c_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26587130302_94a53b425c_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26590374066_cfdfd24841_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26590374066_cfdfd24841_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26610286881_f54a485475_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26610286881_f54a485475_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26613969441_9cd6544a40_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26613969441_9cd6544a40_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26633440426_1b8f93b0c4_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26633440426_1b8f93b0c4_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26649748466_1312984841_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26649748466_1312984841_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26657054850_d8e67c6abd_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26657054850_d8e67c6abd_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26704086846_f0c831d974_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26704086846_f0c831d974_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/28333662912_b9b1d88c36_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/28333662912_b9b1d88c36_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/32677466200_7b6db6f15d_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/32677466200_7b6db6f15d_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/36136972621_02ff19e368_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/36136972621_02ff19e368_z.jpg"
			}, {
				src: "./libs/serguei-uwp/img/serguei-pictures/@1x/36229259776_09b4755088_z.jpg",
				href: "./libs/serguei-uwp/img/serguei-pictures/@2x/36229259776_09b4755088_z.jpg"
			}
		];

		var addMacyItems = function (macy, callback) {
			var transparentPixel = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201%201%27%2F%3E";
			var html = [];
			var count = 0;
			var i,
			l;
			for (i = 0, l = macyItems.length; i < l; i += 1) {
				html.push('<a href="' + macyItems[i].href + '" class="' + glightboxClass + ' ' + macyItemIsBindedClass + '" aria-label="Показать картинку"><img src="' + transparentPixel + '" class="' + dataSrcImgClass + '" data-src="' + macyItems[i].src + '" alt="" /></a>\n');
				count++;
				if (count === macyItems.length) {
					macy.innerHTML = html.join("");
					if (callback && "function" === typeof callback) {
						callback();
					}
				}
			}
			i = l = null;
		};

		if (macy) {
			addMacyItems(macy, onMacyManage);
		}

		if (root.manageExternalLinkAll) {
			manageExternalLinkAll();
		}
	};
})("undefined" !== typeof window ? window : this, document);
