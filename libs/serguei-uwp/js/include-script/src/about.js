/*global console, GLightbox, imagesLoaded, LazyLoad, loadJsCss,
manageExternalLinkAll, manageMacy, manageReadMore, renderAC, scriptIsLoaded,
updateMacyThrottled*/
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

		var macyItems = [
		];

		/*!
		 * to change default style
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/rendering-cards/host-config}
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/rendering-cards/host-config#adaptivecardconfig}
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/pull/905}
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/issues/1929}
		 * @see {@link https://material.io/tools/color/#!/?view.left=0&view.right=0&secondary.color=BDBDBD&primary.color=F06292}
		 */
		var renderACOptions = {
			"fontFamily": "Roboto, Segoe UI, Segoe MDL2 Assets, Helvetica Neue, sans-serif",
			"containerStyles": {
				"default": {
					"foregroundColors": {
						"default": {
							"default": "#212121",
							"subtle": "#757575"
						},
						"dark": {
							"default": "#000000",
							"subtle": "#424242"
						},
						"light": {
							"default": "#757575",
							"subtle": "#bdbdbd"
						},
						"accent": {
							"default": "#0097a7",
							"subtle": "#26c6da"
						},
						"good": {
							"default": "#388e3c",
							"subtle": "#66bb6a"
						},
						"warning": {
							"default": "#e64a19",
							"subtle": "#ff7043"
						},
						"attention": {
							"default": "#d81b60",
							"subtle": "#f06292"
						}
					},
					"backgroundColor": "#ffffff"
				}
			}
		};

		var onExecuteAC = function (action) {
			if (action.url) {
				root[location].href = action.url;
			}
		};

		var manageAC = function (macyGrid, callback) {
			if (root.renderAC) {
				var count = 0;
				var i,
				l;
				for (i = 0, l = macyItems[_length]; i < l; i += 1) {
					renderAC(macyGrid, macyItems[i], renderACOptions, onExecuteAC, null);
					count++;
					if (count === macyItems[_length]) {
						if (callback && "function" === typeof callback) {
							callback();
						}
					}
				}
				i = l = null;
			}
		};

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
			if (!scriptIsLoaded("./cdn/glightbox/1.0.8/js/glightbox.fixed.min.js")) {
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

		var isActiveClass = "is-active";

		var onMacyRender = function () {
			macyGrid[classList].add(isActiveClass);
			/* updateMacyThrottled(); */
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
			onMacyRender();
			onMacyResize();
		};

		/* var macyItems = [
		]; */

		var isRenderedMacyItemClass = "is-rendered-macy-item";

		var addMacyItems = function (macyGrid, callback) {
			if (root.AdaptiveCards) {
				macyGrid.innerHTML = "";
				manageAC(macyGrid, callback);
			} else {
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
						macyGrid.innerHTML = html.join("");
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
					macyItems[i][classList].add(isRenderedMacyItemClass);
					count++;
					if (count === macyItems[_length]) {
						if (callback && "function" === typeof callback) {
							callback();
						}
					}
				}
				i = l = null;
			}
		};

		if (macyGrid) {

			addMacyItems(macyGrid, onMacyManage);
		}

		if (root.manageExternalLinkAll) {
			manageExternalLinkAll();
		}
	};
})("undefined" !== typeof window ? window : this, document);
