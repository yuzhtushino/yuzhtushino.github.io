/*global console, imagesLoaded, LazyLoad, manageExternalLinkAll, manageMacy,
updateMacyThrottled*/
/*!
 * page logic
 */
(function (root, document) {
	"use strict";

	var run = function () {

		var appendChild = "appendChild";
		var classList = "classList";
		var getElementsByClassName = "getElementsByClassName";
		var querySelectorAll = "querySelectorAll";
		var setAttribute = "setAttribute";
		var _addEventListener = "addEventListener";
		var _length = "length";

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

		var macyItems = [{
				"href": "https://build.phonegap.com/apps/1824701/share",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/build.phonegap.com-apps-1824701-share.jpg"
			}, {
				"href": "https://englishextra.github.io/403.html",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-403-html.jpg"
			}, {
				"href": "https://englishextra.github.io/404.html",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-404-html.jpg"
			}, {
				"href": "https://englishextra.github.io/pages/more/more_irregular_verbs.html",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-pages-more-more_irregular_verbs-html.jpg"
			}, {
				"href": "https://englishextra.github.io/pages/more/more_newsletter_can_get_english_for_free.html",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-pages-more-more_newsletter_can_get_english_for_free-html.jpg"
			}, {
				"href": "https://englishextra.github.io/serguei/about.html",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-serguei-about-html.jpg"
			}, {
				"href": "https://englishextra.github.io/serguei/slides.html",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-serguei-slides-html.jpg"
			}, {
				"href": "https://englishextra.github.io/",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io.jpg"
			}, {
				"href": "https://englishextra.gitlab.io/",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.gitlab.io.jpg"
			}, {
				"href": "https://github.com/englishextra",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/github.com-englishextra.jpg"
			}, {
				"href": "https://mytushino.github.io/",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/mytushino.github.io.jpg"
			}, {
				"href": "https://noushevr.github.io/",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/noushevr.github.io.jpg"
			}, {
				"href": "https://www.behance.net/englishextra",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/www.behance.net-englishextra.jpg"
			}, {
				"href": "https://www.domestika.org/en/englishextra",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/www.domestika.org-en-englishextra.jpg"
			}, {
				"href": "https://www.npmjs.com/~englishextra",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/www.npmjs.com-englishextra.jpg"
			}
		];

		var isRenderedMacyItemClass = "is-rendered-macy-item";
		
		var addMacyItems = function (macyGrid, callback) {
			var dataSrcImgKeyName = "src";
			var transparentPixel = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201%201%27%2F%3E";
			/* var html = "";
			var i,
			l;
			for (i = 0, l = macyItems[_length]; i < l; i += 1) {
				html += '<a href="' + macyItems[i].href + '" aria-label="Ссылка"><img src="' + transparentPixel + '" class="' + dataSrcImgClass + '" data-' + dataSrcImgKeyName + '="' + macyItems[i].src + '" alt="" /></a>\n';
			}
			i = l = null;
			macyGrid.innerHTML = html;
			if (callback && "function" === typeof callback) {
				callback();
			} */
			var count = 0;
			var i,
			l;
			for (i = 0, l = macyItems[_length]; i < l; i += 1) {
				var macyItem = document.createElement("a");
				macyItem[classList].add(isRenderedMacyItemClass);
				macyItem[setAttribute]("href", macyItems[i].href);
				macyItem[setAttribute]("aria-label", "Ссылка");
				var img = document.createElement("img");
				macyItem[appendChild](img);
				img[setAttribute]("src", transparentPixel);
				img[setAttribute]("class", dataSrcLazyClass);
				img[setAttribute]("data-" + dataSrcImgKeyName, macyItems[i].src);
				macyGrid[appendChild](macyItem);
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

			addMacyItems(macyGrid, onMacyManage);
		}

		if (root.manageExternalLinkAll) {
			manageExternalLinkAll();
		}
	};
	run();

})("undefined" !== typeof window ? window : this, document);
