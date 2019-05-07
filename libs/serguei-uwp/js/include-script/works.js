/*jslint browser: true */

/*jslint node: true */

/*global addClass, manageMacyItemAll, dataSrcImgClass, getByClass, macyClass,
macyIsActiveClass, macyItemIsBindedClass, manageDataSrcImgAll,
manageExternalLinkAll, manageIframeLightbox, manageMacy, onMacyImagesLoaded,
updateMacyThrottled*/

/*!
 * page logic
 */
(function(root, document) {
	"use strict";

	root.runWorks = function() {
		var macy = getByClass(document, macyClass)[0] || "";

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
			addClass(macy, macyIsActiveClass);
			onMacyImagesLoaded(macy, updateMacyThrottled);
			manageMacyItemAll(macy);
			manageDataSrcImgAll(updateMacyThrottled);
			manageExternalLinkAll();
			manageIframeLightbox();
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

		var addMacyItems = function addMacyItems(macy, callback) {
			var transparentPixel =
				"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201%201%27%2F%3E";
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
						'" data-src="' +
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
