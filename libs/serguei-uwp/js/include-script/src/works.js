/*global console, IframeLightbox, imagesLoaded, LazyLoad, LoadingSpinner,
loadJsCss, manageExternalLinkAll, manageMacy, updateMacyThrottled*/
/*!
 * page logic
 */
(function (root, document) {
	"use strict";

	var getElementsByClassName = "getElementsByClassName";

	root.runWorks = function () {

		/*var appendChild = "appendChild";*/
		var classList = "classList";
		var querySelectorAll = "querySelectorAll";
		/*var setAttribute = "setAttribute";*/
		var _addEventListener = "addEventListener";
		var _length = "length";

		var iframeLightboxLinkClass = "iframe-lightbox-link";

		/*!
		 * @see {@link https://github.com/englishextra/iframe-lightbox}
		 */
		var manageIframeLightbox = function (iframeLightboxLinkClass) {
			var initScript = function () {
				var link = document[getElementsByClassName](iframeLightboxLinkClass) || "";
				var arrange = function (e) {
					e.lightbox = new IframeLightbox(e, {
							onLoaded: function () {
								LoadingSpinner.hide();
							},
							onClosed: function () {
								LoadingSpinner.hide();
							},
							onOpened: function () {
								LoadingSpinner.show();
							},
							touch: false
						});
				};
				if (link) {
					var i,
					l;
					for (i = 0, l = link[_length]; i < l; i += 1) {
						arrange(link[i]);
					}
					i = l = null;
				}
			};
			if (!root.IframeLightbox) {
				var load;
				load = new loadJsCss(["./cdn/iframe-lightbox/0.2.8/css/iframe-lightbox.fixed.min.css",
							"./cdn/iframe-lightbox/0.2.8/js/iframe-lightbox.fixed.min.js"], initScript);
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
			manageIframeLightbox(iframeLightboxLinkClass);
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
			onMacyRender();
			onMacyResize();
		};

		var macyItems = [{
				href: "https://englishextra.github.io/403.html",
				src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-403-html.jpg"
			}, {
				href: "https://englishextra.github.io/404.html",
				src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-404-html.jpg"
			}, {
				href: "https://englishextra.github.io/pages/more/more_irregular_verbs.html",
				src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-pages-more-more_irregular_verbs-html.jpg"
			}, {
				href: "https://englishextra.github.io/pages/more/more_newsletter_can_get_english_for_free.html",
				src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-pages-more-more_newsletter_can_get_english_for_free-html.jpg"
			}, {
				href: "https://englishextra.github.io/serguei/about.html",
				src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-serguei-about-html.jpg"
			}, {
				href: "https://englishextra.github.io/serguei/slides.html",
				src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-serguei-slides-html.jpg"
			}, {
				href: "https://englishextra.github.io/",
				src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io.jpg"
			}, {
				href: "https://englishextra.gitlab.io/",
				src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.gitlab.io.jpg"
			}, {
				href: "https://mytushino.github.io/",
				src: "./libs/serguei-uwp/img/works-screenshots/@1x/mytushino.github.io.jpg"
			}, {
				href: "https://noushevr.github.io/",
				src: "./libs/serguei-uwp/img/works-screenshots/@1x/noushevr.github.io.jpg"
			}
		];

		/*var macyItemIsRenderedClass = "macy__item--is-rendered";*/

		var addMacyItems = function (macy, callback) {
			var dataSrcImgKeyName = "src";
			var transparentPixel = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201%201%27%2F%3E";
			/*!
			 * @see {@link https://stackoverflow.com/questions/18393981/append-vs-html-vs-innerhtml-performance}
			 */
			var html = [];
			var count = 0;
			var i,
			l;
			for (i = 0, l = macyItems[_length]; i < l; i += 1) {
				html.push('<a href="javascript:void(0);" data-src="' + macyItems[i].href + '" class="iframe-lightbox-link" data-padding-bottom="56.25%" data-scrolling="true" aria-label="Ссылка"><img src="' + transparentPixel + '" class="' + dataSrcLazyClass + '" data-' + dataSrcImgKeyName + '="' + macyItems[i].src + '" alt="" /></a>\n');
				count++;
				if (count === macyItems[_length]) {
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
