/*jslint browser: true */

/*jslint node: true */

/*global console, addListener, removeListener, addListener, getByClass,
addClass, hasClass, manageDataSrcImgAll, manageExternalLinkAll,
manageIframeLightbox, manageMacy, updateMacyThrottled*/

/*!
 * page logic
 */
(function(root, document) {
	"use strict";

	root.runWorks = function() {
		var onImagesLoaded = function onImagesLoaded(macy) {
			var img = macy.getElementsByTagName("img") || "";
			var imgLength = img.length || 0;
			var imgCounter = 0;
			var onLoad;
			var onError;

			var addListeners = function addListeners(e) {
				addListener(e, "load", onLoad, false);
				addListener(e, "error", onError, false);
			};

			var removeListeners = function removeListeners(e) {
				removeListener(e, "load", onLoad, false);
				removeListener(e, "error", onError, false);
			};

			onLoad = function onLoad() {
				removeListeners(this);
				imgCounter++;

				if (imgCounter === imgLength) {
					if (root.updateMacyThrottled) {
						updateMacyThrottled();
					}

					console.log(
						"onImagesLoaded: loaded " + imgCounter + " images"
					);
				}
			};

			onError = function onError() {
				removeListeners(this);
				console.log(
					"onImagesLoaded: failed to load image: " + this.src
				);
			};

			if (img) {
				var i, l;

				for (i = 0, l = img.length; i < l; i += 1) {
					addListeners(img[i]);
				}

				i = l = null;
			}
		};

		var anyResizeEventIsBindedClass = "any-resize-event--is-binded";
		var macyClass = "macy";
		var macyItemIsBindedClass = "macy__item--is-binded";
		var macyIsActiveClass = "macy--is-active";
		var macy = getByClass(document, macyClass)[0] || "";

		var onMacyRender = function onMacyRender() {
			addClass(macy, macyIsActiveClass);
			onImagesLoaded(macy);
			manageDataSrcImgAll(updateMacyThrottled);
			manageExternalLinkAll();
			manageIframeLightbox();
		};

		var onMacyResize = function onMacyResize() {
			try {
				var item = macy
					? macy.children ||
					  macy.querySelectorAll("." + macyClass + " > *") ||
					  ""
					: "";

				if (item) {
					var i, l;

					for (i = 0, l = item.length; i < l; i += 1) {
						if (!hasClass(item[i], anyResizeEventIsBindedClass)) {
							addClass(item[i], anyResizeEventIsBindedClass);
							addListener(
								item[i],
								"onresize",
								updateMacyThrottled,
								{
									passive: true
								}
							);
						}
					}

					i = l = null;
				}
			} catch (err) {
				throw new Error("cannot onMacyResize " + err);
			}
		};

		var onMacyManage = function onMacyManage() {
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

		var macyItems = [
			{
				href: "https://englishextra.github.io/403.html",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-403-html.jpg"
			},
			{
				href: "https://englishextra.github.io/404.html",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-404-html.jpg"
			},
			{
				href:
					"https://englishextra.github.io/pages/more/more_irregular_verbs.html",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-pages-more-more_irregular_verbs-html.jpg"
			},
			{
				href:
					"https://englishextra.github.io/pages/more/more_newsletter_can_get_english_for_free.html",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-pages-more-more_newsletter_can_get_english_for_free-html.jpg"
			},
			{
				href: "https://englishextra.github.io/serguei/about.html",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-serguei-about-html.jpg"
			},
			{
				href: "https://englishextra.github.io/serguei/slides.html",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-serguei-slides-html.jpg"
			},
			{
				href: "https://englishextra.github.io/",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io.jpg"
			},
			{
				href: "https://englishextra.gitlab.io/",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.gitlab.io.jpg"
			},
			{
				href: "https://mytushino.github.io/",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/mytushino.github.io.jpg"
			},
			{
				href: "https://noushevr.github.io/",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/noushevr.github.io.jpg"
			}
		];
		var dataSrcImgClass = "data-src-img";

		var addMacyItems = function addMacyItems(macy, callback) {
			var dataSrcImgKeyName = "src";
			var transparentPixel =
				"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201%201%27%2F%3E";
			/*!
			 * @see {@link https://stackoverflow.com/questions/18393981/append-vs-html-vs-innerhtml-performance}
			 */

			var html = [];
			var count = 0;
			var i, l;

			for (i = 0, l = macyItems.length; i < l; i += 1) {
				html.push(
					'<a href="javascript:void(0);" data-src="' +
						macyItems[i].href +
						'" class="iframe-lightbox-link ' +
						macyItemIsBindedClass +
						'" data-padding-bottom="56.25%" data-scrolling="true" aria-label="Ссылка"><img src="' +
						transparentPixel +
						'" class="' +
						dataSrcImgClass +
						'" data-' +
						dataSrcImgKeyName +
						'="' +
						macyItems[i].src +
						'" alt="" /></a>\n'
				);
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
