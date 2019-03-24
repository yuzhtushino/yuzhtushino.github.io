/*jslint browser: true */
/*jslint node: true */
/*global addClass, manageMacyItemAll, getByClass, GLightbox, loadJsCss,
macyClass, macyIsActiveClass, macyItemIsBindedClass, manageDataSrcImgAll,
manageExternalLinkAll, manageMacy, manageReadMore, onMacyImagesLoaded,
updateMacyThrottled*/
/*!
 * page logic
 */
(function (root, document) {
	"use strict";

	root.runAbout = function () {

		/*!
		 * @see {@link https://glightbox.mcstudios.com.mx/#options}
		 */
		var glightboxClass = "glightbox";

		root.handleGLightbox = null;
		var manageGlightbox = function (linkClass) {
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
				margin: 20,
				columns: 3,
				breakAt: {
					1280: 3,
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
			manageGlightbox(glightboxClass);
			manageReadMore(updateMacyThrottled);
		};

		var macyItems = [];

		var addMacyItems = function (macy, callback) {
			macyItems = getByClass(document, "col") || "";
			var count = 0;
			var i,
			l;
			for (i = 0, l = macyItems.length; i < l; i += 1) {
				addClass(macyItems[i], macyItemIsBindedClass);
				count++;
				if (count === macyItems.length) {
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
