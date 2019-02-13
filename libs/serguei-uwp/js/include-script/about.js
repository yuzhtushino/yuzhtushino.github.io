/*jslint browser: true */

/*jslint node: true */

/*global console, GLightbox, loadJsCss, addListener, removeListener, getByClass,
addClass, hasClass, manageDataSrcImgAll, manageExternalLinkAll, manageMacy,
manageReadMore, updateMacyThrottled*/

/*!
 * page logic
 */
(function(root, document) {
	"use strict";

	root.runAbout = function() {
		var getElementsByTagName = "getElementsByTagName";
		var querySelectorAll = "querySelectorAll";
		var _length = "length";
		var isActiveClass = "is-active";
		var glightboxClass = "glightbox";
		/*!
		 * @see {@link https://glightbox.mcstudios.com.mx/#options}
		 */

		root.handleGLightbox = null;

		var manageGlightbox = function manageGlightbox(macy, glightboxClass) {
			var initScript = function initScript() {
				if (root.handleGLightbox) {
					root.handleGLightbox.destroy();
					root.handleGLightbox = null;
				}

				if (macy) {
					root.handleGLightbox = new GLightbox({
						selector: glightboxClass
					});
				}
			};

			if (!root.GLightbox) {
				var load;
				load = new loadJsCss(
					[
						"./cdn/glightbox/1.0.8/css/glightbox.fixed.min.css",
						"./cdn/glightbox/1.0.8/js/glightbox.fixed.min.js"
					],
					initScript
				);
			} else {
				initScript();
			}
		};

		var onImagesLoaded = function onImagesLoaded(macy) {
			var img = macy[getElementsByTagName]("img") || "";
			var imgLength = img[_length] || 0;
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

				for (i = 0, l = img[_length]; i < l; i += 1) {
					addListeners(img[i]);
				}

				i = l = null;
			}
		};

		var anyResizeEventIsBindedClass = "any-resize-event--is-binded";
		var macyClass = "macy";
		var macy = getByClass(document, macyClass)[0] || "";

		var onMacyRender = function onMacyRender() {
			addClass(macy, isActiveClass);
			onImagesLoaded(macy);
			manageDataSrcImgAll(updateMacyThrottled);
			manageExternalLinkAll();
			manageGlightbox(macy, glightboxClass);
			manageReadMore(updateMacyThrottled);
		};

		var onMacyResize = function onMacyResize() {
			try {
				var item = macy
					? macy.children ||
					  macy[querySelectorAll]("." + macyClass + " > *") ||
					  ""
					: "";

				if (item) {
					var i, l;

					for (i = 0, l = item[_length]; i < l; i += 1) {
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
		var macyItemIsBindedClass = "macy__item--is-binded";

		var addMacyItems = function addMacyItems(macy, callback) {
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
			macyItems = getByClass(document, "col") || "";
			var count = 0;
			var i, l;

			for (i = 0, l = macyItems[_length]; i < l; i += 1) {
				addClass(macyItems[i], macyItemIsBindedClass);
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
