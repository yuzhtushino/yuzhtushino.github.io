/*global console, GLightbox, imagesLoaded, LazyLoad, loadJsCss,
manageExternalLinkAll, manageMacy, manageReadMore, updateMacyThrottled*/
/*!
 * page logic
 */
(function (root, document) {
	"use strict";

	var getElementsByClassName = "getElementsByClassName";

	root.runAbout = function () {

		var classList = "classList";
		var querySelectorAll = "querySelectorAll";
		var _addEventListener = "addEventListener";
		var _length = "length";

		var glightboxClass = "glightbox";

		/*!
		 * @see {@link https://glightbox.mcstudios.com.mx/#options}
		 */
		root.handleGLightbox = null;
		var manageGlightbox = function (macy) {
			var initScript = function () {
				if (root.handleGLightbox) {
					root.handleGLightbox.destroy();
					root.handleGLightbox = null;
				}
				if (macy) {
					root.handleGLightbox = GLightbox({
							selector: glightboxClass
						});
				}
			};
			if (!root.GLightbox) {
				var load;
				load = new loadJsCss(["./cdn/glightbox/1.0.8/css/glightbox.fixed.min.css",
							"./cdn/glightbox/1.0.8/js/glightbox.fixed.min.js"], initScript);
			} else {
				initScript();
			}
		};

		var dataSrcLazyClass = "data-src-lazy";

		/*!
		 * @see {@link https://github.com/verlok/lazyload}
		 */
		var manageLazyLoad = function (dataSrcLazyClass) {
			if (root.LazyLoad) {
				var lzld;
				lzld = new LazyLoad({
						elements_selector: "." + dataSrcLazyClass
					});
			}
		};

		/*!
		 * @see {@link https://imagesloaded.desandro.com/}
		 * Triggered after all images have been either loaded or confirmed broken.
		 */
		var onImagesLoaded = function (macy) {
			if (root.imagesLoaded) {
				var imgLoad;
				imgLoad = new imagesLoaded(macy);
				var onAlways = function (instance) {
					if (root.updateMacyThrottled) {
						updateMacyThrottled();
					}
					console.log("imagesLoaded: found " + instance.images[_length] + " images");
				};
				imgLoad.on("always", onAlways);
			}
		};

		var anyResizeEventIsBindedClass = "any-resize-event--is-binded";

		var macyClass = "macy";

		var macy = document[getElementsByClassName](macyClass)[0] || "";

		var macyIsActiveClass = "is-active";

		var onMacyRender = function () {
			macy[classList].add(macyIsActiveClass);
			onImagesLoaded(macy);
			manageLazyLoad(dataSrcLazyClass);
			manageExternalLinkAll();
			manageGlightbox(glightboxClass);
			manageReadMore(null, {
				target: ".dummy",
				numOfWords: 10,
				toggle: true,
				moreLink: "БОЛЬШЕ",
				lessLink: "МЕНЬШЕ",
				inline: true,
				customBlockElement: "p"
			});
		};

		var onMacyResize = function () {
			try {
				var container = macy ? (macy.children || macy[querySelectorAll]("." + macyClass + " > *") || "") : "";
				if (container) {
					var i,
					l;
					for (i = 0, l = container[_length]; i < l; i += 1) {
						if (!container[i][classList].contains(anyResizeEventIsBindedClass)) {
							container[i][classList].add(anyResizeEventIsBindedClass);
							container[i][_addEventListener]("onresize", updateMacyThrottled, {
								passive: true
							});
						}
					}
					i = l = null;
				}
			} catch (err) {
				throw new Error("cannot onMacyResize " + err);
			}
		};

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
			onMacyRender();
			onMacyResize();
		};

		var macyItems = [];

		var macyItemIsRenderedClass = "macy__item--is-rendered";

		var addMacyItems = function (macy, callback) {
			/*!
			 * @see {@link https://stackoverflow.com/questions/18393981/append-vs-html-vs-innerhtml-performance}
			 */
			/* var html = [];
			var count = 0;
			var i,
			l;
			for (i = 0, l = macyItems[_length]; i < l; i += 1) {
				html.push(macyItems[i]);
				count++;
				if (count === macyItems[_length]) {
					macy.innerHTML = html.join("");
					if (callback && "function" === typeof callback) {
						callback();
					}
				}
			}
			i = l = null; */
			macyItems = document[getElementsByClassName]("col") || "";
			var count = 0;
			var i,
			l;
			for (i = 0, l = macyItems[_length]; i < l; i += 1) {
				macyItems[i][classList].add(macyItemIsRenderedClass);
				count++;
				if (count === macyItems[_length]) {
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
