/*global console, GLightbox, imagesLoaded, LazyLoad, loadJsCss,
manageExternalLinkAll, manageMacy, manageReadMore, scriptIsLoaded,
updateMacyThrottled*/
/*!
 * page logic
 */
(function (root, document) {
	"use strict";

	var runAbout = function () {

		var classList = "classList";
		var getElementsByClassName = "getElementsByClassName";
		var querySelectorAll = "querySelectorAll";
		var _addEventListener = "addEventListener";
		var _length = "length";

		var glightboxClass = "glightbox";

		/*!
		 * @see {@link https://glightbox.mcstudios.com.mx/#options}
		 */
		root.handleGLightbox = null;
		var manageGlightbox = function (macyGrid) {
			var initScript = function () {
				if (root.GLightbox) {
					if (root.handleGLightbox) {
						root.handleGLightbox.destroy();
						root.handleGLightbox = null;
					}
					if (macyGrid) {
						root.handleGLightbox = GLightbox({
								selector: glightboxClass
							});
					}
				}
			};
			if (!scriptIsLoaded("../../cdn/glightbox/1.0.8/js/glightbox.fixed.min.js")) {
				var load;
				load = new loadJsCss(["../../cdn/glightbox/1.0.8/css/glightbox.fixed.min.css",
							"../../cdn/glightbox/1.0.8/js/glightbox.fixed.min.js"], initScript);
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
		var onImagesLoaded = function (macyGrid) {
			if (root.imagesLoaded) {
				var imgLoad;
				imgLoad = new imagesLoaded(macyGrid);
				var onAlways = function (instance) {
					if (root.updateMacyThrottled) {
						updateMacyThrottled();
					}
					console.log("imagesLoaded: found " + instance.images[_length] + " images");
				};
				imgLoad.on("always", onAlways);
			}
		};

		var isBindedMacyItemClass = "is-binded-macy-item";

		var macyGridClass = "macy-grid";

		var macyGrid = document[getElementsByClassName](macyGridClass)[0] || "";

		var onMacyRender = function () {
			updateMacyThrottled();
			onImagesLoaded(macyGrid);
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
				var container = macyGrid ? (macyGrid.children || macyGrid[querySelectorAll]("." + macyGridClass + " > *") || "") : "";
				if (container) {
					var i,
					l;
					for (i = 0, l = container[_length]; i < l; i += 1) {
						if (!container[i][classList].contains(isBindedMacyItemClass)) {
							container[i][classList].add(isBindedMacyItemClass);
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
			onMacyRender();
			onMacyResize();
		};

		var isRenderedMacyItemClass = "is-rendered-macy-item";
		
		var addMacyItems = function (macyGrid, callback) {
				var macyItems = document[getElementsByClassName]("col") || "";
				var count = 0;
				var i,
				l;
				for (i = 0, l = macyItems[_length]; i < l; i += 1) {
					macyItems[i][classList].add(isRenderedMacyItemClass);
					count++;
					if (count === macyItems[_length]) {
						if (callback && "function" === typeof callback) {
							callback();
						}
					}
				}
				i = l = null;
		};

		if (macyGrid) {
			manageMacy(macyGridClass, {
				trueOrder: false,
				waitForImages: false,
				margin: 20,
				columns: 3,
				breakAt: {
					1280: 2,
					1024: 2,
					960: 2,
					640: 1,
					480: 1,
					360: 1
				}
			});

			addMacyItems(macyGrid, onMacyManage);
		}

		if (root.manageExternalLinkAll) {
			manageExternalLinkAll();
		}
	};
	runAbout();

})("undefined" !== typeof window ? window : this, document);
