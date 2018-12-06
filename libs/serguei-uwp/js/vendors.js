function _typeof(obj) {
	if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
		_typeof = function _typeof(obj) {
			return typeof obj;
		};
	} else {
		_typeof = function _typeof(obj) {
			return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
		};
	}
	return _typeof(obj);
}

/*!
 * imagesLoaded PACKAGED v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */
(function (global, factory) {
	// universal module definition

	/* jshint strict: false */

	/* globals define, module, window */
	if (typeof define == 'function' && define.amd) {
		// AMD - RequireJS
		define('ev-emitter/ev-emitter', factory);
	} else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module.exports) {
		// CommonJS - Browserify, Webpack
		module.exports = factory();
	} else {
		// Browser globals
		global.EvEmitter = factory();
	}
})(typeof window != 'undefined' ? window : this, function () {
	"use strict";

	function EvEmitter() {}

	var proto = EvEmitter.prototype;

	proto.on = function (eventName, listener) {
		if (!eventName || !listener) {
			return;
		} // set events hash


		var events = this._events = this._events || {}; // set listeners array

		var listeners = events[eventName] = events[eventName] || []; // only add once

		if (listeners.indexOf(listener) == -1) {
			listeners.push(listener);
		}

		return this;
	};

	proto.once = function (eventName, listener) {
		if (!eventName || !listener) {
			return;
		} // add event


		this.on(eventName, listener); // set once flag
		// set onceEvents hash

		var onceEvents = this._onceEvents = this._onceEvents || {}; // set onceListeners object

		var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {}; // set flag

		onceListeners[listener] = true;
		return this;
	};

	proto.off = function (eventName, listener) {
		var listeners = this._events && this._events[eventName];

		if (!listeners || !listeners.length) {
			return;
		}

		var index = listeners.indexOf(listener);

		if (index != -1) {
			listeners.splice(index, 1);
		}

		return this;
	};

	proto.emitEvent = function (eventName, args) {
		var listeners = this._events && this._events[eventName];

		if (!listeners || !listeners.length) {
			return;
		} // copy over to avoid interference if .off() in listener


		listeners = listeners.slice(0);
		args = args || []; // once stuff

		var onceListeners = this._onceEvents && this._onceEvents[eventName];

		for (var i = 0; i < listeners.length; i++) {
			var listener = listeners[i];
			var isOnce = onceListeners && onceListeners[listener];

			if (isOnce) {
				// remove listener
				// remove before trigger to prevent recursion
				this.off(eventName, listener); // unset once flag

				delete onceListeners[listener];
			} // trigger listener


			listener.apply(this, args);
		}

		return this;
	};

	proto.allOff = function () {
		delete this._events;
		delete this._onceEvents;
	};

	return EvEmitter;
});
/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */


(function (window, factory) {
	'use strict'; // universal module definition

	/*global define: false, module: false, require: false */

	if (typeof define == 'function' && define.amd) {
		// AMD
		define(['ev-emitter/ev-emitter'], function (EvEmitter) {
			return factory(window, EvEmitter);
		});
	} else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == 'object' && module.exports) {
		// CommonJS
		module.exports = factory(window, require('ev-emitter'));
	} else {
		// browser global
		window.imagesLoaded = factory(window, window.EvEmitter);
	}
})(typeof window !== 'undefined' ? window : this, // --------------------------  factory -------------------------- //
	function factory(window, EvEmitter) {
		"use strict";

		var $ = window.jQuery;
		var console = window.console; // -------------------------- helpers -------------------------- //
		// extend objects

		function extend(a, b) {
			for (var prop in b) {
				if (b.hasOwnProperty(prop)) {
					a[prop] = b[prop];
				}
			}

			return a;
		}

		var arraySlice = Array.prototype.slice; // turn element or nodeList into an array

		function makeArray(obj) {
			if (Array.isArray(obj)) {
				// use object if already an array
				return obj;
			}

			var isArrayLike = _typeof(obj) == 'object' && typeof obj.length == 'number';

			if (isArrayLike) {
				// convert nodeList to array
				return arraySlice.call(obj);
			} // array of single index


			return [obj];
		} // -------------------------- imagesLoaded -------------------------- //

		/**
		 * @param {Array, Element, NodeList, String} elem
		 * @param {Object or Function} options - if function, use as callback
		 * @param {Function} onAlways - callback function
		 */


		function ImagesLoaded(elem, options, onAlways) {
			// coerce ImagesLoaded() without new, to be new ImagesLoaded()
			if (!(this instanceof ImagesLoaded)) {
				return new ImagesLoaded(elem, options, onAlways);
			} // use elem as selector string


			var queryElem = elem;

			if (typeof elem == 'string') {
				queryElem = document.querySelectorAll(elem);
			} // bail if bad element


			if (!queryElem) {
				console.error('Bad element for imagesLoaded ' + (queryElem || elem));
				return;
			}

			this.elements = makeArray(queryElem);
			this.options = extend({}, this.options); // shift arguments if no options set

			if (typeof options == 'function') {
				onAlways = options;
			} else {
				extend(this.options, options);
			}

			if (onAlways) {
				this.on('always', onAlways);
			}

			this.getImages();

			if ($) {
				// add jQuery Deferred object
				this.jqDeferred = new $.Deferred();
			} // HACK check async to allow time to bind listeners


			setTimeout(this.check.bind(this));
		}

		ImagesLoaded.prototype = Object.create(EvEmitter.prototype);
		ImagesLoaded.prototype.options = {};

		ImagesLoaded.prototype.getImages = function () {
			this.images = []; // filter & find items if we have an item selector

			this.elements.forEach(this.addElementImages, this);
		};
		/**
		 * @param {Node} element
		 */


		ImagesLoaded.prototype.addElementImages = function (elem) {
			// filter siblings
			if (elem.nodeName == 'IMG') {
				this.addImage(elem);
			} // get background image on element


			if (this.options.background === true) {
				this.addElementBackgroundImages(elem);
			} // find children
			// no non-element nodes, #143


			var nodeType = elem.nodeType;

			if (!nodeType || !elementNodeTypes[nodeType]) {
				return;
			}

			var childImgs = elem.querySelectorAll('img'); // concat childElems to filterFound array

			for (var i = 0; i < childImgs.length; i++) {
				var img = childImgs[i];
				this.addImage(img);
			} // get child background images


			if (typeof this.options.background == 'string') {
				var children = elem.querySelectorAll(this.options.background);

				for (i = 0; i < children.length; i++) {
					var child = children[i];
					this.addElementBackgroundImages(child);
				}
			}
		};

		var elementNodeTypes = {
			1: true,
			9: true,
			11: true
		};

		ImagesLoaded.prototype.addElementBackgroundImages = function (elem) {
			var style = getComputedStyle(elem);

			if (!style) {
				// Firefox returns null if in a hidden iframe https://bugzil.la/548397
				return;
			} // get url inside url("...")


			var reURL = /url\((['"])?(.*?)\1\)/gi;
			var matches = reURL.exec(style.backgroundImage);

			while (matches !== null) {
				var url = matches && matches[2];

				if (url) {
					this.addBackground(url, elem);
				}

				matches = reURL.exec(style.backgroundImage);
			}
		};
		/**
		 * @param {Image} img
		 */


		ImagesLoaded.prototype.addImage = function (img) {
			var loadingImage = new LoadingImage(img);
			this.images.push(loadingImage);
		};

		ImagesLoaded.prototype.addBackground = function (url, elem) {
			var background = new Background(url, elem);
			this.images.push(background);
		};

		ImagesLoaded.prototype.check = function () {
			var _this = this;

			this.progressedCount = 0;
			this.hasAnyBroken = false; // complete if no images

			if (!this.images.length) {
				this.complete();
				return;
			}

			function onProgress(image, elem, message) {
				// HACK - Chrome triggers event before object properties have changed. #83
				setTimeout(function () {
					_this.progress(image, elem, message);
				});
			}

			this.images.forEach(function (loadingImage) {
				loadingImage.once('progress', onProgress);
				loadingImage.check();
			});
		};

		ImagesLoaded.prototype.progress = function (image, elem, message) {
			this.progressedCount++;
			this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded; // progress event

			this.emitEvent('progress', [this, image, elem]);

			if (this.jqDeferred && this.jqDeferred.notify) {
				this.jqDeferred.notify(this, image);
			} // check if completed


			if (this.progressedCount == this.images.length) {
				this.complete();
			}

			if (this.options.debug && console) {
				console.log('progress: ' + message, image, elem);
			}
		};

		ImagesLoaded.prototype.complete = function () {
			var eventName = this.hasAnyBroken ? 'fail' : 'done';
			this.isComplete = true;
			this.emitEvent(eventName, [this]);
			this.emitEvent('always', [this]);

			if (this.jqDeferred) {
				var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
				this.jqDeferred[jqMethod](this);
			}
		}; // --------------------------  -------------------------- //


		function LoadingImage(img) {
			this.img = img;
		}

		LoadingImage.prototype = Object.create(EvEmitter.prototype);

		LoadingImage.prototype.check = function () {
			// If complete is true and browser supports natural sizes,
			// try to check for image status manually.
			var isComplete = this.getIsImageComplete();

			if (isComplete) {
				// report based on naturalWidth
				this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
				return;
			} // If none of the checks above matched, simulate loading on detached element.


			this.proxyImage = new Image();
			this.proxyImage.addEventListener('load', this);
			this.proxyImage.addEventListener('error', this); // bind to image as well for Firefox. #191

			this.img.addEventListener('load', this);
			this.img.addEventListener('error', this);
			this.proxyImage.src = this.img.src;
		};

		LoadingImage.prototype.getIsImageComplete = function () {
			// check for non-zero, non-undefined naturalWidth
			// fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671
			return this.img.complete && this.img.naturalWidth;
		};

		LoadingImage.prototype.confirm = function (isLoaded, message) {
			this.isLoaded = isLoaded;
			this.emitEvent('progress', [this, this.img, message]);
		}; // ----- events ----- //
		// trigger specified handler for event type


		LoadingImage.prototype.handleEvent = function (event) {
			var method = 'on' + event.type;

			if (this[method]) {
				this[method](event);
			}
		};

		LoadingImage.prototype.onload = function () {
			this.confirm(true, 'onload');
			this.unbindEvents();
		};

		LoadingImage.prototype.onerror = function () {
			this.confirm(false, 'onerror');
			this.unbindEvents();
		};

		LoadingImage.prototype.unbindEvents = function () {
			this.proxyImage.removeEventListener('load', this);
			this.proxyImage.removeEventListener('error', this);
			this.img.removeEventListener('load', this);
			this.img.removeEventListener('error', this);
		}; // -------------------------- Background -------------------------- //


		function Background(url, element) {
			this.url = url;
			this.element = element;
			this.img = new Image();
		} // inherit LoadingImage prototype


		Background.prototype = Object.create(LoadingImage.prototype);

		Background.prototype.check = function () {
			this.img.addEventListener('load', this);
			this.img.addEventListener('error', this);
			this.img.src = this.url; // check if image is already complete

			var isComplete = this.getIsImageComplete();

			if (isComplete) {
				this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
				this.unbindEvents();
			}
		};

		Background.prototype.unbindEvents = function () {
			this.img.removeEventListener('load', this);
			this.img.removeEventListener('error', this);
		};

		Background.prototype.confirm = function (isLoaded, message) {
			this.isLoaded = isLoaded;
			this.emitEvent('progress', [this, this.element, message]);
		}; // -------------------------- jQuery -------------------------- //


		ImagesLoaded.makeJQueryPlugin = function (jQuery) {
			jQuery = jQuery || window.jQuery;

			if (!jQuery) {
				return;
			} // set local variable


			$ = jQuery; // $().imagesLoaded()

			$.fn.imagesLoaded = function (options, callback) {
				var instance = new ImagesLoaded(this, options, callback);
				return instance.jqDeferred.promise($(this));
			};
		}; // try making plugin


		ImagesLoaded.makeJQueryPlugin(); // --------------------------  -------------------------- //

		return ImagesLoaded;
	});

var _extends = Object.assign || function (target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i];

		for (var key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				target[key] = source[key];
			}
		}
	}

	return target;
};

var LazyLoad = function () {
	'use strict';

	var defaultSettings = {
		elements_selector: "img",
		container: document,
		threshold: 300,
		thresholds: null,
		data_src: "src",
		data_srcset: "srcset",
		data_sizes: "sizes",
		data_bg: "bg",
		class_loading: "loading",
		class_loaded: "loaded",
		class_error: "error",
		load_delay: 0,
		callback_load: null,
		callback_error: null,
		callback_set: null,
		callback_enter: null,
		callback_finish: null,
		to_webp: false
	};

	var getInstanceSettings = function getInstanceSettings(customSettings) {
		return _extends({}, defaultSettings, customSettings);
	};

	var dataPrefix = "data-";
	var processedDataName = "was-processed";
	var timeoutDataName = "ll-timeout";
	var trueString = "true";

	var getData = function getData(element, attribute) {
		return element.getAttribute(dataPrefix + attribute);
	};

	var setData = function setData(element, attribute, value) {
		var attrName = dataPrefix + attribute;

		if (value === null) {
			element.removeAttribute(attrName);
			return;
		}

		element.setAttribute(attrName, value);
	};

	var setWasProcessedData = function setWasProcessedData(element) {
		return setData(element, processedDataName, trueString);
	};

	var getWasProcessedData = function getWasProcessedData(element) {
		return getData(element, processedDataName) === trueString;
	};

	var setTimeoutData = function setTimeoutData(element, value) {
		return setData(element, timeoutDataName, value);
	};

	var getTimeoutData = function getTimeoutData(element) {
		return getData(element, timeoutDataName);
	};

	var purgeProcessedElements = function purgeProcessedElements(elements) {
		return elements.filter(function (element) {
			return !getWasProcessedData(element);
		});
	};

	var purgeOneElement = function purgeOneElement(elements, elementToPurge) {
		return elements.filter(function (element) {
			return element !== elementToPurge;
		});
	};
	/* Creates instance and notifies it through the window element */


	var createInstance = function createInstance(classObj, options) {
		var event;
		var eventString = "LazyLoad::Initialized";
		var instance = new classObj(options);

		try {
			// Works in modern browsers
			event = new CustomEvent(eventString, {
				detail: {
					instance: instance
				}
			});
		} catch (err) {
			// Works in Internet Explorer (all versions)
			event = document.createEvent("CustomEvent");
			event.initCustomEvent(eventString, false, false, {
				instance: instance
			});
		}

		window.dispatchEvent(event);
	};
	/* Auto initialization of one or more instances of lazyload, depending on the
		options passed in (plain object or an array) */


	function autoInitialize(classObj, options) {
		if (!options) {
			return;
		}

		if (!options.length) {
			// Plain object
			createInstance(classObj, options);
		} else {
			// Array of objects
			for (var i = 0, optionsItem; optionsItem = options[i]; i += 1) {
				createInstance(classObj, optionsItem);
			}
		}
	}

	var replaceExtToWebp = function replaceExtToWebp(value, condition) {
		return condition ? value.replace(/\.(jpe?g|png)/gi, ".webp") : value;
	};

	var detectWebp = function detectWebp() {
		var webpString = "image/webp";
		var canvas = document.createElement("canvas");

		if (canvas.getContext && canvas.getContext("2d")) {
			return canvas.toDataURL(webpString)
				.indexOf("data:" + webpString) === 0;
		}

		return false;
	};

	var runningOnBrowser = typeof window !== "undefined";
	var isBot = runningOnBrowser && !("onscroll" in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);
	var supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;
	var supportsClassList = runningOnBrowser && "classList" in document.createElement("p");
	var supportsWebp = runningOnBrowser && detectWebp();

	var setSourcesInChildren = function setSourcesInChildren(parentTag, attrName, dataAttrName, toWebpFlag) {
		for (var i = 0, childTag; childTag = parentTag.children[i]; i += 1) {
			if (childTag.tagName === "SOURCE") {
				var attrValue = getData(childTag, dataAttrName);
				setAttributeIfValue(childTag, attrName, attrValue, toWebpFlag);
			}
		}
	};

	var setAttributeIfValue = function setAttributeIfValue(element, attrName, value, toWebpFlag) {
		if (!value) {
			return;
		}

		element.setAttribute(attrName, replaceExtToWebp(value, toWebpFlag));
	};

	var setSourcesImg = function setSourcesImg(element, settings) {
		var toWebpFlag = supportsWebp && settings.to_webp;
		var srcsetDataName = settings.data_srcset;
		var parent = element.parentNode;

		if (parent && parent.tagName === "PICTURE") {
			setSourcesInChildren(parent, "srcset", srcsetDataName, toWebpFlag);
		}

		var sizesDataValue = getData(element, settings.data_sizes);
		setAttributeIfValue(element, "sizes", sizesDataValue);
		var srcsetDataValue = getData(element, srcsetDataName);
		setAttributeIfValue(element, "srcset", srcsetDataValue, toWebpFlag);
		var srcDataValue = getData(element, settings.data_src);
		setAttributeIfValue(element, "src", srcDataValue, toWebpFlag);
	};

	var setSourcesIframe = function setSourcesIframe(element, settings) {
		var srcDataValue = getData(element, settings.data_src);
		setAttributeIfValue(element, "src", srcDataValue);
	};

	var setSourcesVideo = function setSourcesVideo(element, settings) {
		var srcDataName = settings.data_src;
		var srcDataValue = getData(element, srcDataName);
		setSourcesInChildren(element, "src", srcDataName);
		setAttributeIfValue(element, "src", srcDataValue);
		element.load();
	};

	var setSourcesBgImage = function setSourcesBgImage(element, settings) {
		var toWebpFlag = supportsWebp && settings.to_webp;
		var srcDataValue = getData(element, settings.data_src);
		var bgDataValue = getData(element, settings.data_bg);

		if (srcDataValue) {
			var setValue = replaceExtToWebp(srcDataValue, toWebpFlag);
			element.style.backgroundImage = "url(\"" + setValue + "\")";
		}

		if (bgDataValue) {
			var _setValue = replaceExtToWebp(bgDataValue, toWebpFlag);

			element.style.backgroundImage = _setValue;
		}
	};

	var setSourcesFunctions = {
		IMG: setSourcesImg,
		IFRAME: setSourcesIframe,
		VIDEO: setSourcesVideo
	};

	var setSources = function setSources(element, instance) {
		var settings = instance._settings;
		var tagName = element.tagName;
		var setSourcesFunction = setSourcesFunctions[tagName];

		if (setSourcesFunction) {
			setSourcesFunction(element, settings);

			instance._updateLoadingCount(1);

			instance._elements = purgeOneElement(instance._elements, element);
			return;
		}

		setSourcesBgImage(element, settings);
	};

	var addClass = function addClass(element, className) {
		if (supportsClassList) {
			element.classList.add(className);
			return;
		}

		element.className += (element.className ? " " : "") + className;
	};

	var removeClass = function removeClass(element, className) {
		if (supportsClassList) {
			element.classList.remove(className);
			return;
		}

		element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ")
			.replace(/^\s+/, "")
			.replace(/\s+$/, "");
	};

	var callbackIfSet = function callbackIfSet(callback, argument) {
		if (callback) {
			callback(argument);
		}
	};

	var genericLoadEventName = "load";
	var mediaLoadEventName = "loadeddata";
	var errorEventName = "error";

	var addEventListener = function addEventListener(element, eventName, handler) {
		element.addEventListener(eventName, handler);
	};

	var removeEventListener = function removeEventListener(element, eventName, handler) {
		element.removeEventListener(eventName, handler);
	};

	var addEventListeners = function addEventListeners(element, loadHandler, errorHandler) {
		addEventListener(element, genericLoadEventName, loadHandler);
		addEventListener(element, mediaLoadEventName, loadHandler);
		addEventListener(element, errorEventName, errorHandler);
	};

	var removeEventListeners = function removeEventListeners(element, loadHandler, errorHandler) {
		removeEventListener(element, genericLoadEventName, loadHandler);
		removeEventListener(element, mediaLoadEventName, loadHandler);
		removeEventListener(element, errorEventName, errorHandler);
	};

	var eventHandler = function eventHandler(event, success, instance) {
		var settings = instance._settings;
		var className = success ? settings.class_loaded : settings.class_error;
		var callback = success ? settings.callback_load : settings.callback_error;
		var element = event.target;
		removeClass(element, settings.class_loading);
		addClass(element, className);
		callbackIfSet(callback, element);

		instance._updateLoadingCount(-1);
	};

	var addOneShotEventListeners = function addOneShotEventListeners(element, instance) {
		var loadHandler = function loadHandler(event) {
			eventHandler(event, true, instance);
			removeEventListeners(element, loadHandler, errorHandler);
		};

		var errorHandler = function errorHandler(event) {
			eventHandler(event, false, instance);
			removeEventListeners(element, loadHandler, errorHandler);
		};

		addEventListeners(element, loadHandler, errorHandler);
	};

	var managedTags = ["IMG", "IFRAME", "VIDEO"];

	var loadAndUnobserve = function loadAndUnobserve(element, observer, instance) {
		revealElement(element, instance);
		observer.unobserve(element);
	};

	var cancelDelayLoad = function cancelDelayLoad(element) {
		var timeoutId = getTimeoutData(element);

		if (!timeoutId) {
			return; // do nothing if timeout doesn't exist
		}

		clearTimeout(timeoutId);
		setTimeoutData(element, null);
	};

	var delayLoad = function delayLoad(element, observer, instance) {
		var loadDelay = instance._settings.load_delay;
		var timeoutId = getTimeoutData(element);

		if (timeoutId) {
			return; // do nothing if timeout already set
		}

		timeoutId = setTimeout(function () {
			loadAndUnobserve(element, observer, instance);
			cancelDelayLoad(element);
		}, loadDelay);
		setTimeoutData(element, timeoutId);
	};

	function revealElement(element, instance, force) {
		var settings = instance._settings;

		if (!force && getWasProcessedData(element)) {
			return; // element has already been processed and force wasn't true
		}

		callbackIfSet(settings.callback_enter, element);

		if (managedTags.indexOf(element.tagName) > -1) {
			addOneShotEventListeners(element, instance);
			addClass(element, settings.class_loading);
		}

		setSources(element, instance);
		setWasProcessedData(element);
		callbackIfSet(settings.callback_set, element);
	}
	/* entry.isIntersecting needs fallback because is null on some versions of MS Edge, and
	   entry.intersectionRatio is not enough alone because it could be 0 on some intersecting elements */


	var isIntersecting = function isIntersecting(entry) {
		return entry.isIntersecting || entry.intersectionRatio > 0;
	};

	var getObserverSettings = function getObserverSettings(settings) {
		return {
			root: settings.container === document ? null : settings.container,
			rootMargin: settings.thresholds || settings.threshold + "px"
		};
	};

	var LazyLoad = function LazyLoad(customSettings, elements) {
		this._settings = getInstanceSettings(customSettings);

		this._setObserver();

		this._loadingCount = 0;
		this.update(elements);
	};

	LazyLoad.prototype = {
		_manageIntersection: function _manageIntersection(entry) {
			var observer = this._observer;
			var loadDelay = this._settings.load_delay;
			var element = entry.target; // WITHOUT LOAD DELAY

			if (!loadDelay) {
				if (isIntersecting(entry)) {
					loadAndUnobserve(element, observer, this);
				}

				return;
			} // WITH LOAD DELAY


			if (isIntersecting(entry)) {
				delayLoad(element, observer, this);
			} else {
				cancelDelayLoad(element);
			}
		},
		_onIntersection: function _onIntersection(entries) {
			entries.forEach(this._manageIntersection.bind(this));
		},
		_setObserver: function _setObserver() {
			if (!supportsIntersectionObserver) {
				return;
			}

			this._observer = new IntersectionObserver(this._onIntersection.bind(this), getObserverSettings(this._settings));
		},
		_updateLoadingCount: function _updateLoadingCount(plusMinus) {
			this._loadingCount += plusMinus;

			if (this._elements.length === 0 && this._loadingCount === 0) {
				callbackIfSet(this._settings.callback_finish);
			}
		},
		update: function update(elements) {
			var _this = this;

			var settings = this._settings;
			var nodeSet = elements || settings.container.querySelectorAll(settings.elements_selector);
			this._elements = purgeProcessedElements(Array.prototype.slice.call(nodeSet) // NOTE: nodeset to array for IE compatibility
			);

			if (isBot || !this._observer) {
				this.loadAll();
				return;
			}

			this._elements.forEach(function (element) {
				_this._observer.observe(element);
			});
		},
		destroy: function destroy() {
			var _this2 = this;

			if (this._observer) {
				this._elements.forEach(function (element) {
					_this2._observer.unobserve(element);
				});

				this._observer = null;
			}

			this._elements = null;
			this._settings = null;
		},
		load: function load(element, force) {
			revealElement(element, this, force);
		},
		loadAll: function loadAll() {
			var _this3 = this;

			var elements = this._elements;
			elements.forEach(function (element) {
				_this3.load(element);
			});
		}
	};
	/* Automatic instances creation if required (useful for async script loading) */

	if (runningOnBrowser) {
		autoInitialize(LazyLoad, window.lazyLoadOptions);
	}

	return LazyLoad;
}();

/*!
 * @app ReadMoreJS
 * @desc Breaks the content of an element to the specified number of words
 * @version 1.0.0
 * @license The MIT License (MIT)
 * @author George Raptis | http://georap.gr
 * @see {@link https://github.com/georapbox/ReadMore.js/blob/master/src/readMoreJS.js}
 * changed: rmLink = doc.querySelectorAll('.rm-link');
 * to: rmLink = doc.getElementsByClassName('rm-link') || "";
 * changed: var target = doc.querySelectorAll(options.target)
 * to: var target = elementsSelector(options.target)
 */
(function (win, doc, undef) {
	'use strict';

	var RM = {};
	RM.helpers = {
		extendObj: function extendObj() {
			for (var i = 1, l = arguments.length; i < l; i++) {
				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {
						if (arguments[i][key] && arguments[i][key].constructor && arguments[i][key].constructor === Object) {
							arguments[0][key] = arguments[0][key] || {};
							this.extendObj(arguments[0][key], arguments[i][key]);
						} else {
							arguments[0][key] = arguments[i][key];
						}
					}
				}
			}

			return arguments[0];
		}
	};

	RM.countWords = function (str) {
		return str.split(/\s+/)
			.length;
	};

	RM.generateTrimmed = function (str, wordsNum) {
		return str.split(/\s+/)
			.slice(0, wordsNum)
			.join(' ') + '...';
	};

	RM.init = function (options) {
		var defaults = {
			target: '',
			numOfWords: 50,
			toggle: true,
			moreLink: 'read more...',
			lessLink: 'read less'
		};
		options = RM.helpers.extendObj({}, defaults, options);
		var elementsSelector;

		elementsSelector = function elementsSelector(selector, context, undefined) {
			var matches = {
				"#": "getElementById",
				".": "getElementsByClassName",
				"@": "getElementsByName",
				"=": "getElementsByTagName",
				"*": "querySelectorAll"
			} [selector[0]];
			var el = (context === undefined ? document : context)[matches](selector.slice(1));
			return el.length < 2 ? el[0] : el;
		};

		var target = elementsSelector(options.target) || "",
			targetLen = target.length,
			targetContent,
			trimmedTargetContent,
			targetContentWords,
			initArr = [],
			trimmedArr = [],
			i,
			j,
			l,
			moreContainer,
			rmLink,
			moreLinkID,
			index;

		for (i = 0; i < targetLen; i++) {
			targetContent = target[i].innerHTML;
			trimmedTargetContent = RM.generateTrimmed(targetContent, options.numOfWords);
			targetContentWords = RM.countWords(targetContent);
			initArr.push(targetContent);
			trimmedArr.push(trimmedTargetContent);

			if (options.numOfWords < targetContentWords - 1) {
				target[i].innerHTML = trimmedArr[i];

				if (options.inline) {
					moreContainer = doc.createElement('span');
				} else {
					if (options.customBlockElement) {
						moreContainer = doc.createElement(options.customBlockElement);
					} else {
						moreContainer = doc.createElement('div');
					}
				}

				moreContainer.innerHTML = '<a href="javascript:void(0);" id="rm-more_' + i + '" class="rm-link" style="cursor:pointer;">' + options.moreLink + '</a>';

				if (options.inline) {
					target[i].appendChild(moreContainer);
				} else {
					target[i].parentNode.insertBefore(moreContainer, target[i].nextSibling);
				}
			}
		}

		rmLink = doc.getElementsByClassName('rm-link') || "";

		var func = function func() {
			moreLinkID = this.getAttribute('id');
			index = moreLinkID.split('_')[1];

			if (this.getAttribute('data-clicked') !== 'true') {
				target[index].innerHTML = initArr[index];

				if (options.toggle !== false) {
					this.innerHTML = options.lessLink;
					this.setAttribute('data-clicked', true);
				} else {
					this.innerHTML = '';
				}
			} else {
				target[index].innerHTML = trimmedArr[index];
				this.innerHTML = options.moreLink;
				this.setAttribute('data-clicked', false);
			}
		};

		for (j = 0, l = rmLink.length; j < l; j++) {
			rmLink[j].onclick = func;
		}
	};

	window.$readMoreJS = RM;
})("undefined" !== typeof window ? window : this, document);

/*global ActiveXObject, console */
(function (root, document) {
	"use strict";
	/* Helpers */

	Element.prototype.prependChild = function (child) {
		return this.insertBefore(child, this.firstChild);
	};

	Element.prototype.insertAfter = function (newNode, referenceNode) {
		return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	};

	var toArray = function toArray(obj) {
		if (!obj) {
			return [];
		}

		return Array.prototype.slice.call(obj);
	};

	var parseColor = function parseColor(color) {
		var RGB_match = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
		var hex_match = /^#(([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2}))$/;

		var _color = color.toLowerCase();

		if (RGB_match.test(_color)) {
			return _color.match(RGB_match)
				.slice(1);
		} else if (hex_match.test(_color)) {
			return _color.match(hex_match)
				.slice(2)
				.map(function (piece) {
					return parseInt(piece, 16);
				});
		}

		console.error("Unrecognized color format.");
		return null;
	};

	var calculateBrightness = function calculateBrightness(color) {
		return color.reduce(function (p, c) {
			return p + parseInt(c, 10);
		}, 0) / 3;
	};
	/*!
	 * @see {@link http://www.javascriptkit.com/javatutors/loadjavascriptcss2.shtml}
	 */


	var removeJsCssFile = function removeJsCssFile(filename, filetype) {
		var targetelement = filetype == "js" ? "script" : filetype == "css" ? "link" : "none";
		var targetattr = filetype == "js" ? "src" : filetype == "css" ? "href" : "none";
		var allsuspects = document.getElementsByTagName(targetelement) || "";

		for (var i = allsuspects.length; i >= 0; i--) {
			if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr)
				.indexOf(filename) != -1) {
				allsuspects[i].parentNode.removeChild(allsuspects[i]);
				/* remove element by calling parentNode.removeChild() */
			}
		}
	};

	var _extends = function _extends() {
		var _extends = Object.assign || function (target) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i];

				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}

			return target;
		};

		return _extends.apply(this, arguments);
	};

	var parseDomFromString = function parseDomFromString(responseText) {
		var tempDiv = document.createElement('div');
		tempDiv.innerHTML = responseText;
		return tempDiv;
	};
	/* Define UWP namespace */


	var UWP = {
		version: "2.0.0",

		/* Default config */
		config: {
			pageTitle: "UWP web framework",
			layoutType: "docked-minimized",
			activeColor: "#26C6DA",
			mainColor: "#373737",
			mainColorDarkened: "#0097A7",
			includes: "./includes/serguei-uwp",
			includeScript: "./libs/serguei-uwp/js/include-script",
			includeStyle: "./libs/serguei-uwp/css/include-style",
			navContainer: "nav-container",
			home: "home",
			hashNavKey: "page"
		},

		/* Main init function */
		init: function init(params) {
			console.log("UWP.init()");
			/* Define main elements */

			UWP.head = document.head;
			UWP.body = document.body;
			/* UWP.pageTitle = document.createElement("h1"); */

			var pageTitle = document.createElement("div");
			pageTitle.setAttribute("class", "uwp-title");
			pageTitle.style.display = "none";
			UWP.pageTitle = pageTitle;
			document.body.appendChild(UWP.pageTitle);
			UWP.container = null;

			var _uwp_container = document.getElementsByClassName("uwp-container")[0] || "";

			if (!_uwp_container) {
				var container = document.createElement("div");
				container.setAttribute("class", "uwp-container");
				container.setAttribute("role", "document");
				UWP.container = container;
				document.body.appendChild(UWP.container);
			} else {
				UWP.container = _uwp_container;
			}

			UWP.header = null;

			var _UWP_header = document.getElementsByClassName("uwp-header")[0] || "";

			if (!_UWP_header) {
				var header = document.createElement("div");
				header.setAttribute("class", "uwp-header");
				header.setAttribute("role", "navigation");
				UWP.header = header;
				UWP.container.appendChild(UWP.header);
			} else {
				UWP.header = _UWP_header;
			}

			UWP.main = null;

			var _uwp_main = document.getElementsByClassName("uwp-main")[0] || "";

			if (!_uwp_main) {
				var main = document.createElement("div");
				main.setAttribute("class", "uwp-main");
				main.setAttribute("role", "main");
				main.innerHTML = '<div class="uwp-error"><p>Loading&#8230;</p></div>\n';
				UWP.main = main;
				UWP.container.appendChild(UWP.main);
			} else {
				UWP.main = _uwp_main;
			}

			UWP.loading = null;

			var _uwp_loading = document.getElementsByClassName("uwp-loading")[0] || "";

			if (!_uwp_loading) {
				var loading = document.createElement("div");
				loading.setAttribute("class", "uwp-loading");
				loading.setAttribute("role", "main");
				loading.innerHTML = '<div class="uwp-loading__part"><div class="uwp-loading__rotator"></div></div><div class="uwp-loading__part uwp-loading__part--bottom"><div class="uwp-loading__rotator"></div></div>\n';
				UWP.loading = loading;
				document.body.appendChild(UWP.loading);
			} else {
				UWP.loading = _uwp_loading;
			}

			UWP.revealUWPLoading = function () {
				UWP.loading.classList.add("is-active");
			};

			UWP.concealUWPLoading = function () {
				var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					UWP.loading.classList.remove("is-active");
				}, 1000);
			};

			UWP.removeUWPLoading = function () {
				UWP.loading.classList.remove("is-active");
			};
			/* Gets user-set config */


			UWP.getConfig(params);
			/* Set page title */

			UWP.pageTitle = UWP.config.pageTitle;
			/* Define additional variables */

			UWP.header.type = UWP.config.layoutType;
			UWP.body.setAttribute("data-layout-type", UWP.header.type);
			/* Handles clicking internal links */

			UWP.body.addEventListener("click", function (event) {
				if (event.target.getAttribute("data-target") !== null) {
					event.stopPropagation();
					event.preventDefault();
					UWP.navigate(event.target.getAttribute("data-target"));
				}
			});
			/* Gets navigation */

			UWP.getNavigation();
			/* Creates custom styles */

			UWP.createStyles();
			/* Handles navigation between pages */

			/* UWP.navigate(root.location.hash.split("=")[1], false); */

			UWP.navigate(root.location.hash.split(/#\//)[1], false);

			root.onhashchange = function () {
				/* UWP.navigate(root.location.hash.split("=")[1], false); */
				UWP.navigate(root.location.hash.split(/#\//)[1], false);
			};
			/* Prepares space for document's title, puts it in place */


			UWP.pageTitle = document.createElement("span");
			UWP.header.prependChild(UWP.pageTitle);
		},

		/* Gets document's navigation, puts it in place */
		getConfig: function getConfig(params) {
			console.log("UWP.getConfig()");
			UWP.config = _extends(UWP.config, params);
		},

		/* Gets document's navigation, puts it in place */
		getNavigation: function getNavigation(target) {
			console.log("UWP.getNavigation()");

			if (typeof target === "undefined") {
				target = UWP.config.navContainer;
			}

			function parseNavElement(el) {
				var elLabel = el ? el.getElementsByTagName("nav-label")[0] || "" : "";
				var navLabel = elLabel.textContent || "";
				var elTarget = el ? el.getElementsByTagName("nav-target")[0] || "" : "";
				var navTarget = elTarget.textContent || "";
				var elIcon = el ? el.getElementsByTagName("nav-icon")[0] || "" : "";
				var navIconSource = elIcon;
				var navElement = document.createElement("li");
				var navLink = document.createElement("a");
				/* jshint -W107 */

				navLink.href = "javascript:void(0);";
				/* jshint +W107 */

				navLink.title = navLabel;
				navLink.innerHTML = navLabel;

				if (navIconSource) {
					var navIcon = document.createElement("span");
					/* If that's a file, we'll create an img object with src pointed to it */

					if (/\.(jpg|png|gif|svg)/.test(navIconSource.textContent)) {
						var navIconImage = document.createElement("img");
						navIconImage.src = navIconSource.textContent;
						navIcon.appendChild(navIconImage);
					}
					/* ...otherwise, it must be Segoe MDL2 symbol */
					else {
						/* navIcon.innerHTML = navIconSource.textContent; */
						navIcon.innerHTML = navIconSource.innerHTML;
					}

					navLink.prependChild(navIcon);
				}

				navLink.addEventListener("click", function (event) {
					event.stopPropagation();
					event.preventDefault();
					/* if (root.location.hash !== "".concat("#", UWP.config.hashNavKey, "=", navTarget)) { */

					if (root.location.hash !== "".concat("#/", navTarget)) {
						UWP.menuList.classList.remove("active");
						UWP.navigate(navTarget);
					}
				});
				navLink.setAttribute("data-target", navTarget);
				navElement.appendChild(navLink);
				return navElement;
			}

			var URL = "".concat(UWP.config.includes, "/", target, ".html");
			var UWP_navigation_request = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			UWP_navigation_request.overrideMimeType("text/html;charset=utf-8");
			UWP_navigation_request.open("GET", URL, true);
			UWP_navigation_request.withCredentials = false;

			UWP_navigation_request.onreadystatechange = function () {
				if (UWP_navigation_request.status === 404 || UWP_navigation_request.status === 0) {
					console.log("Error XMLHttpRequest-ing file", UWP_navigation_request.status);
				} else if (UWP_navigation_request.readyState === 4 && UWP_navigation_request.status === 200 && UWP_navigation_request.responseText) {
					/* var parser = new DOMParser();
					var parsed = parser.parseFromString(UWP_navigation_request.responseText, "text/xml"); */
					var parsed = parseDomFromString(UWP_navigation_request.responseText);
					var elMainMenu = parsed.getElementsByTagName("nav-container")[0] || "";
					var navsSource = elMainMenu || "";
					/* UWP.nav = document.createElement("nav"); */

					var nav = document.createElement("div");
					nav.setAttribute("class", "uwp-nav");
					UWP.nav = nav;
					/* Adds all the navigations to the DOM tree */

					var elList = navsSource ? navsSource.getElementsByTagName("nav-list") || "" : "";
					toArray(elList)
						.forEach(function (navSource) {
							var navMain = document.createElement("ul");
							UWP.nav.appendChild(navMain);
							var elEl = navsSource ? navSource.getElementsByTagName("nav-item") || "" : "";
							toArray(elEl)
								.forEach(function (el) {
									navMain.appendChild(parseNavElement(el));
								});
						});
					/* If navigation was constructed, adds it to the DOM tree and displays menu button */

					if (toArray(elList)
						.length) {
						UWP.header.appendChild(UWP.nav);
						UWP.addMenuButton();
					}
				}
			};

			UWP_navigation_request.send(null);
		},

		/* Highlights current page in navigation */
		updateNavigation: function updateNavigation() {
			console.log("UWP.updateNavigation()");
			/* var nav = document.getElementsByTagName("nav")[0] || ""; */

			var nav = document.getElementsByClassName("uwp-nav")[0] || "";
			var navA = nav ? nav.getElementsByTagName("a") || "" : "";
			toArray(navA)
				.forEach(function (link) {
					if (link.getAttribute("data-target") === UWP.config.currentPage) {
						link.parentElement.classList.add("active");
					} else {
						link.parentElement.classList.remove("active");
					}
				});
		},

		/* Creates custom styles based on config */
		createStyles: function createStyles() {
			console.log("UWP.createStyles()");
			UWP.customStyle = document.createElement("style");

			if (UWP.config.mainColor) {
				var mainColor_RGB = parseColor(UWP.config.mainColor);

				if (mainColor_RGB) {
					var mainColor_brightness = calculateBrightness(mainColor_RGB);

					if (mainColor_brightness >= 128) {
						UWP.body.classList.add("uwp-theme--light");
					} else {
						UWP.body.classList.add("uwp-theme--dark");
					}

					var mainColorDarkened = mainColor_RGB.map(function (color) {
						var newColor = color - 20;
						if (newColor < 0) newColor = 0;
						return newColor;
					});

					if (!UWP.config.mainColorDarkened) {
						UWP.config.mainColorDarkened = "rgb(".concat(mainColorDarkened, ")");
					}
				}
				/* var Darkened_RGB = parseColor(UWP.config.Darkened); */


				UWP.customStyle.innerHTML += "\n\t[data-layout-type=\"tabs\"] .uwp-header {\n\tbackground: ".concat(UWP.config.mainColor, ";\n\t}\n\n\t[data-layout-type=\"overlay\"] .uwp-header {\n\tbackground: ")
					.concat(UWP.config.mainColor, ";\n\t}\n\t[data-layout-type=\"overlay\"] .uwp-header .uwp-nav:nth-of-type(1) {\n\tbackground-color: ")
					.concat(UWP.config.mainColorDarkened, ";\n\t}\n\n\t[data-layout-type=\"docked-minimized\"] .uwp-header {\n\tbackground: ")
					.concat(UWP.config.mainColor, ";\n\t}\n\t[data-layout-type=\"docked-minimized\"] .uwp-header .uwp-nav:nth-of-type(1) {\n\tbackground: ")
					.concat(UWP.config.mainColorDarkened, ";\n\t}\n\n\t[data-layout-type=\"docked\"] .uwp-header {\n\tbackground: ")
					.concat(UWP.config.mainColor, ";\n\t}\n\t[data-layout-type=\"docked\"] .uwp-header .uwp-nav:nth-of-type(1) {\n\tbackground: ")
					.concat(UWP.config.mainColorDarkened, ";\n\t}\n\t");
			}

			if (UWP.config.activeColor) {
				var activeColor_RGB = parseColor(UWP.config.activeColor);

				if (activeColor_RGB) {
					var activeColor_brightness = calculateBrightness(activeColor_RGB);

					if (activeColor_brightness >= 128) {
						UWP.body.classList.add("uwp-theme--active-light");
					} else {
						UWP.body.classList.add("uwp-theme--active-dark");
					}
				}

				UWP.customStyle.innerHTML += "\n\t[data-layout-type=\"tabs\"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\tcolor: ".concat(UWP.config.activeColor, ";\n\tborder-bottom-color: ")
					.concat(UWP.config.activeColor, ";\n\t}\n\t[data-layout-type=\"overlay\"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\tbackground-color: ")
					.concat(UWP.config.activeColor, ";\n\t}\n\t[data-layout-type=\"docked-minimized\"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\tbackground-color: ")
					.concat(UWP.config.activeColor, ";\n\t}\n\t[data-layout-type=\"docked\"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\tbackground-color: ")
					.concat(UWP.config.activeColor, ";\n\t}\n\t");
			}

			if (UWP.customStyle.innerHTML.length) {
				UWP.body.appendChild(UWP.customStyle);
				/* UWP.body.insertBefore(UWP.customStyle, UWP.body.firstChild); */
			}
		},

		/* Puts a menu button in title bar */
		addMenuButton: function addMenuButton() {
			console.log("UWP.addMenuButton()");
			UWP.menuButton = null;

			var _uwp_menu_button = document.getElementsByClassName("uwp-menu-button")[0] || "";

			if (!_uwp_menu_button) {
				var menuButton = document.createElement("button");
				menuButton.setAttribute("class", "uwp-menu-button");
				menuButton.setAttribute("aria-label", "Menu");
				menuButton.innerHTML = '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" transform="scale(1.75 1.75) translate(0 0)" d="M1024 320h-1024v-64h1024v64zm0 512h-1024v-64h1024v64zm0-256.5h-1024v-63.5h1024v63.5z"/></svg>';
				UWP.menuButton = menuButton;
				UWP.header.prependChild(UWP.menuButton);
			} else {
				UWP.menuButton = _uwp_menu_button;
			}
			/* UWP.menuButton.innerHTML = "&#xE700;"; */

			/* var GlobalNavButton = document.createElement("img");
			GlobalNavButton.src = "./static/img/svg/GlobalNavButton.svg";
			UWP.menuButton.appendChild(GlobalNavButton); */

			/* var headerNav = UWP.header.getElementsByTagName("nav")[0] || ""; */


			UWP.menuList = UWP.header.getElementsByClassName("uwp-nav")[0] || "";

			if (UWP.menuList) {
				UWP.menuButton.addEventListener("click", function () {
					UWP.menuList.classList.toggle("active");
				});
				UWP.main.addEventListener("click", function () {
					UWP.menuList.classList.remove("active");
				});
			}
		},

		/* Puts content in place */
		navigate: function navigate(target, addHistory) {
			console.log("UWP.navigate()");

			if (typeof target === "undefined") {
				target = UWP.config.home;
			}

			UWP.config.currentPage = target;
			/* Pushes history state */

			if (addHistory !== false) {
				/* history.pushState("", "", "".concat(root.location.href.split("#")[0], "#", UWP.config.hashNavKey, "=", target)); */
				history.pushState("", "", "".concat(root.location.href.split(/#\//)[0], "#/", target));
			}
			/* Clears the page content */


			UWP.main.innerHTML = "";
			/* Displays error message */

			function displayError(title) {
				UWP.main.innerHTML = "\n\t<div class=\"uwp-error\">\n\t<p>".concat(title, "</p>\n\t<p><a href=\"javascript:void(0);\" class=\"error-link\">Go Home</a></p>\n\t</div>\n\t");
				var mainA = UWP.main.getElementsByClassName("error-link")[0] || "";
				mainA.addEventListener("click", function (event) {
					event.stopPropagation();
					event.preventDefault();
					UWP.navigate(UWP.config.home);
				});
				UWP.updateNavigation();
				UWP.removeUWPLoading();
			}

			var URL = "".concat(UWP.config.includes, "/")
				.concat(target, ".html");
			/* Requests page data */

			var UWP_navigate_request = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			UWP_navigate_request.overrideMimeType("text/html;charset=utf-8");
			UWP_navigate_request.open("GET", URL, true);
			UWP_navigate_request.withCredentials = false;

			UWP_navigate_request.onreadystatechange = function () {
				if (UWP_navigate_request.status === 404 || UWP_navigate_request.status === 0) {
					console.log("Error XMLHttpRequest-ing file", UWP_navigate_request.status);
					console.error("Something went wrong");
					displayError("Something went wrong");
				} else if (UWP_navigate_request.readyState === 4 && UWP_navigate_request.status === 200 && UWP_navigate_request.responseText) {
					/* var parser = new DOMParser();
					var parsed = parser.parseFromString(UWP_navigate_request.responseText, "text/xml"); */
					var parsed = parseDomFromString(UWP_navigate_request.responseText);
					var page = parsed.getElementsByTagName("page-container")[0] || "";

					if (!page) {
						console.error("Something went wrong");
						displayError("Something went wrong");
					}

					UWP.revealUWPLoading();
					var elTitle = page ? page.getElementsByTagName("page-title")[0] || "" : "";
					var pageTitle = elTitle.textContent || "";
					var elBody = page ? page.getElementsByTagName("page-content")[0] || "" : "";
					var pageBody = elBody.innerHTML || "";
					var pageIncludeScript = page ? page.getElementsByTagName("include-script")[0] || "" : "";
					var pageIncludeStyle = page ? page.getElementsByTagName("include-style")[0] || "" : "";
					/* Puts the new content in place */

					UWP.main.innerHTML = "";
					UWP.main.innerHTML = pageBody;
					UWP.main.classList.remove("uwp-main--with-animation");
					/*!
					 * @see {@link https://stackoverflow.com/questions/30453078/uncaught-typeerror-cannot-set-property-offsetwidth-of-htmlelement-which-has/53089566#53089566}
					 */

					(function () {
						return UWP.main.offsetWidth;
					})();

					UWP.main.classList.add("uwp-main--with-animation");
					/* Puts the new page title in place */

					UWP.pageTitle.innerHTML = pageTitle;
					document.title = "".concat(pageTitle, " - ")
						.concat(UWP.config.pageTitle);
					/* Runs defined script */

					if (pageIncludeScript) {
						var scriptName = pageIncludeScript.textContent;

						var _src = "".concat(UWP.config.includeScript, "/")
							.concat(scriptName);

						removeJsCssFile(_src, "js");
						var script = document.createElement("script");
						script.setAttribute("src", _src);
						script.async = true;
						UWP.body.appendChild(script);
					}
					/* Loads defined style */


					if (pageIncludeStyle) {
						var styleName = pageIncludeStyle.textContent;

						var _href = "".concat(UWP.config.includeStyle, "/")
							.concat(styleName);

						removeJsCssFile(_href, "css");
						var link = document.createElement("link");
						link.setAttribute("href", _href);
						link.setAttribute("property", "stylesheet");
						link.rel = "stylesheet";
						link.media = "all";
						/* UWP.head.appendChild(link); */

						UWP.body.appendChild(link);
					}

					UWP.updateNavigation();
					UWP.concealUWPLoading();
				}
			};

			UWP_navigate_request.send(null);
		}
	};
	root.UWP = UWP;
})("undefined" !== typeof window ? window : this, document);

function _typeof(obj) {
	if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
		_typeof = function _typeof(obj) {
			return typeof obj;
		};
	} else {
		_typeof = function _typeof(obj) {
			return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
		};
	}
	return _typeof(obj);
}

/*!
LegoMushroom @legomushroom http://legomushroom.com
MIT License 2014
 */

/*!
 * @see {@link https://github.com/legomushroom/resize/blob/master/dist/any-resize-event.js}
 * v1.0.0
 * fixed functions within the loop and some variables
 * not defined on more upper level
 * and if (proto.prototype === null || proto.prototype === undefined)
 * passes jshint
 */

/*global define, module*/

/*!
LegoMushroom @legomushroom http://legomushroom.com
MIT License 2014
 */
(function () {
	var Main;

	Main = function () {
		function Main(o) {
			this.o = o != null ? o : {};

			if (window.isAnyResizeEventInited) {
				return;
			}

			this.vars();
			this.redefineProto();
		}

		Main.prototype.vars = function () {
			window.isAnyResizeEventInited = true;
			this.allowedProtos = [HTMLDivElement, HTMLFormElement, HTMLLinkElement, HTMLBodyElement, HTMLParagraphElement, HTMLFieldSetElement, HTMLLegendElement, HTMLLabelElement, HTMLButtonElement, HTMLUListElement, HTMLOListElement, HTMLLIElement, HTMLHeadingElement, HTMLQuoteElement, HTMLPreElement, HTMLBRElement, HTMLFontElement, HTMLHRElement, HTMLModElement, HTMLParamElement, HTMLMapElement, HTMLTableElement, HTMLTableCaptionElement, HTMLImageElement, HTMLTableCellElement, HTMLSelectElement, HTMLInputElement, HTMLTextAreaElement, HTMLAnchorElement, HTMLObjectElement, HTMLTableColElement, HTMLTableSectionElement, HTMLTableRowElement];
			return this.timerElements = {
				img: 1,
				textarea: 1,
				input: 1,
				embed: 1,
				object: 1,
				svg: 1,
				canvas: 1,
				tr: 1,
				tbody: 1,
				thead: 1,
				tfoot: 1,
				a: 1,
				select: 1,
				option: 1,
				optgroup: 1,
				dl: 1,
				dt: 1,
				br: 1,
				basefont: 1,
				font: 1,
				col: 1,
				iframe: 1
			};
		};

		Main.prototype.redefineProto = function () {
			var i, it, proto, t;
			it = this;
			return t = function () {
				var _i, _len, _ref, _results;

				_ref = this.allowedProtos;
				_results = [];

				var fn = function fn(proto) {
					var listener, remover;
					listener = proto.prototype.addEventListener || proto.prototype.attachEvent;
					var wrappedListener;

					(function (listener) {
						wrappedListener = function wrappedListener() {
							var option;

							if (this !== window || this !== document) {
								option = arguments[0] === 'onresize' && !this.isAnyResizeEventInited;

								if (option) {
									it.handleResize({
										args: arguments,
										that: this
									});
								}
							}

							return listener.apply(this, arguments);
						};

						if (proto.prototype.addEventListener) {
							return proto.prototype.addEventListener = wrappedListener;
						} else if (proto.prototype.attachEvent) {
							return proto.prototype.attachEvent = wrappedListener;
						}
					})(listener);

					remover = proto.prototype.removeEventListener || proto.prototype.detachEvent;
					return function (remover) {
						var wrappedRemover;

						wrappedRemover = function wrappedRemover() {
							this.isAnyResizeEventInited = false;

							if (this.iframe) {
								this.removeChild(this.iframe);
							}

							return remover.apply(this, arguments);
						};

						if (proto.prototype.removeEventListener) {
							return proto.prototype.removeEventListener = wrappedRemover;
						} else if (proto.prototype.detachEvent) {
							return proto.prototype.detachEvent = wrappedListener;
						}
					}(remover);
				};

				for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
					proto = _ref[i];

					if (proto.prototype == null) {
						continue;
					}
					/* _results.push(fn.bind(null, proto)()); */


					_results.push(fn(proto));
				}

				return _results;
			}.call(this);
		};

		Main.prototype.handleResize = function (args) {
			var computedStyle, el, iframe, isEmpty, isStatic, _ref;

			el = args.that;

			if (!this.timerElements[el.tagName.toLowerCase()]) {
				iframe = document.createElement('iframe');
				el.appendChild(iframe);
				iframe.style.width = '100%';
				iframe.style.height = '100%';
				iframe.style.position = 'absolute';
				iframe.style.zIndex = -999;
				iframe.style.opacity = 0;
				iframe.style.top = 0;
				iframe.style.left = 0;
				iframe.setAttribute("title", "any-resize-event");
				iframe.setAttribute("aria-hidden", true);
				computedStyle = window.getComputedStyle ? getComputedStyle(el) : el.currentStyle;
				isStatic = computedStyle.position === 'static' && el.style.position === '';
				isEmpty = computedStyle.position === '' && el.style.position === '';

				if (isStatic || isEmpty) {
					el.style.position = 'relative';
				}

				if ((_ref = iframe.contentWindow) != null) {
					_ref.onresize = function (_this) {
						return function (e) {
							return _this.dispatchEvent(el);
						};
					}(this);
				}

				el.iframe = iframe;
			} else {
				this.initTimer(el);
			}

			return el.isAnyResizeEventInited = true;
		};

		Main.prototype.initTimer = function (el) {
			var height, width;
			width = 0;
			height = 0;
			return this.interval = setInterval(function (_this) {
				return function () {
					var newHeight, newWidth;
					newWidth = el.offsetWidth;
					newHeight = el.offsetHeight;

					if (newWidth !== width || newHeight !== height) {
						_this.dispatchEvent(el);

						width = newWidth;
						return height = newHeight;
					}
				};
			}(this), this.o.interval || 62.5);
		};

		Main.prototype.dispatchEvent = function (el) {
			var e;

			if (document.createEvent) {
				e = document.createEvent('HTMLEvents');
				e.initEvent('onresize', false, false);
				return el.dispatchEvent(e);
			} else if (document.createEventObject) {
				e = document.createEventObject();
				return el.fireEvent('onresize', e);
			} else {
				return false;
			}
		};

		Main.prototype.destroy = function () {
			var i, it, proto, _i, _len, _ref, _results;

			clearInterval(this.interval);
			this.interval = null;
			window.isAnyResizeEventInited = false;
			it = this;
			_ref = this.allowedProtos;
			_results = [];

			var fn = function fn(proto) {
				var listener;
				listener = proto.prototype.addEventListener || proto.prototype.attachEvent;

				if (proto.prototype.addEventListener) {
					proto.prototype.addEventListener = Element.prototype.addEventListener;
				} else if (proto.prototype.attachEvent) {
					proto.prototype.attachEvent = Element.prototype.attachEvent;
				}

				if (proto.prototype.removeEventListener) {
					return proto.prototype.removeEventListener = Element.prototype.removeEventListener;
				} else if (proto.prototype.detachEvent) {
					return proto.prototype.detachEvent = Element.prototype.detachEvent;
				}
			};

			for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
				proto = _ref[i];

				if (proto.prototype == null) {
					continue;
				}

				_results.push(fn(proto));
			}

			return _results;
		};

		return Main;
	}();

	if (typeof define === "function" && define.amd) {
		define("any-resize-event", [], function () {
			return new Main();
		});
	} else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
		module.exports = new Main();
	} else {
		if (typeof window !== "undefined" && window !== null) {
			window.AnyResizeEvent = Main;
		}

		if (typeof window !== "undefined" && window !== null) {
			window.anyResizeEvent = new Main();
		}
	}
})
.call(this);

function _typeof(obj) {
	if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
		_typeof = function _typeof(obj) {
			return typeof obj;
		};
	} else {
		_typeof = function _typeof(obj) {
			return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
		};
	}
	return _typeof(obj);
}

/*!
 * Macy.js - v2.3.1
 * @see {@link https://github.com/bigbitecreative/macy.js}
 * passes jshint
 */
(function (global, factory) {
	if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		global.Macy = factory();
	}
})("undefined" !== typeof window ? window : this, function () {
	'use strict';

	var $e = function $e(parameter, context) {
		if (!(this instanceof $e)) {
			return new $e(parameter, context);
		}

		parameter = parameter.replace(/^\s*/, '')
			.replace(/\s*$/, '');

		if (context) {
			return this.byCss(parameter, context);
		}

		for (var key in this.selectors) {
			if (this.selectors.hasOwnProperty(key)) {
				context = key.split('/');

				if (new RegExp(context[1], context[2])
					.test(parameter)) {
					return this.selectors[key](parameter);
				}
			}
		}

		return this.byCss(parameter);
	};

	$e.prototype.byCss = function (parameter, context) {
		return (context || document)
			.querySelectorAll(parameter);
	};

	$e.prototype.selectors = {};

	$e.prototype.selectors[/^\.[\w\-]+$/] = function (param) {
		return document.getElementsByClassName(param.substring(1));
	};

	$e.prototype.selectors[/^\w+$/] = function (param) {
		return document.getElementsByTagName(param);
	};

	$e.prototype.selectors[/^\#[\w\-]+$/] = function (param) {
		return document.getElementById(param.substring(1));
	};

	function wait(func, delta) {
		var to = void 0;
		return function () {
			if (to) {
				clearTimeout(to);
			}

			to = setTimeout(func, delta);
		};
	}

	var foreach = function foreach(iterable, callback) {
		var i = iterable.length,
			len = i;

		while (i--) {
			callback(iterable[len - i - 1]);
		}
	};

	function map(iterable, callback) {
		var i = iterable.length,
			len = i;
		var returns = [];

		while (i--) {
			returns.push(callback(iterable[len - i - 1]));
		}

		return returns;
	}

	var Queue = function Queue() {
		var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		this.running = false;
		this.events = [];
		this.add(events);
	};

	Queue.prototype.run = function () {
		if (!this.running && this.events.length > 0) {
			var fn = this.events.shift();
			this.running = true;
			fn();
			this.running = false;
			this.run();
		}
	};

	Queue.prototype.add = function () {
		var _this = this;

		var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		if (!event) {
			return false;
		}

		if (Array.isArray(event)) {
			return foreach(event, function (evt) {
				return _this.add(evt);
			});
		}

		this.events.push(event);
		this.run();
	};

	Queue.prototype.clear = function () {
		this.events = [];
	};

	var Event = function Event(instance) {
		var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		this.instance = instance;
		this.data = data;
		return this;
	};

	var EventManager = function EventManager() {
		var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		this.events = {};
		this.instance = instance;
	};

	EventManager.prototype.on = function () {
		var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		if (!key || !func) {
			return false;
		}

		if (!Array.isArray(this.events[key])) {
			this.events[key] = [];
		}

		return this.events[key].push(func);
	};

	EventManager.prototype.emit = function () {
		var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		if (!key || !Array.isArray(this.events[key])) {
			return false;
		}

		var evt = new Event(this.instance, data);
		foreach(this.events[key], function (fn) {
			return fn(evt);
		});
	};

	var imageHasLoaded = function imageHasLoaded(img) {
		return !('naturalHeight' in img && img.naturalHeight + img.naturalWidth === 0) || img.width + img.height !== 0;
	};

	var promise = function promise(ctx, image) {
		var emitOnLoad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		return new Promise(function (resolve, reject) {
				if (image.complete) {
					if (!imageHasLoaded(image)) {
						return reject(image);
					}

					return resolve(image);
				}

				image.addEventListener('load', function () {
					if (imageHasLoaded(image)) {
						return resolve(image);
					}

					return reject(image);
				});
				image.addEventListener('error', function () {
					return reject(image);
				});
			})
			.then(function (img) {
				if (emitOnLoad) {
					ctx.emit(ctx.constants.EVENT_IMAGE_LOAD, {
						img: img
					});
				}
			})
			.catch(function (img) {
				return ctx.emit(ctx.constants.EVENT_IMAGE_ERROR, {
					img: img
				});
			});
	};

	var getImagePromises = function getImagePromises(ctx, images) {
		var emitOnLoad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		return map(images, function (image) {
			return promise(ctx, image, emitOnLoad);
		});
	};

	var imageLoaderPromise = function imageLoaderPromise(ctx, images) {
		var emitOnLoad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		return Promise.all(getImagePromises(ctx, images, emitOnLoad))
			.then(function () {
				ctx.emit(ctx.constants.EVENT_IMAGE_COMPLETE);
			});
	};

	function imagesLoadedNew(ctx, imgs) {
		var during = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		imageLoaderPromise(ctx, imgs, during);
	}

	var createResizeEvent = function createResizeEvent(ctx) {
		return wait(function () {
			ctx.emit(ctx.constants.EVENT_RESIZE);
			ctx.queue.add(function () {
				return ctx.recalculate(true, true);
			});
		}, 100);
	};

	var setupContainer = function setupContainer(ctx) {
		ctx.container = $e(ctx.options.container);

		if (ctx.container instanceof $e || !ctx.container) {
			return ctx.options.debug ? console.error('Error: Container not found') : false;
		}

		delete ctx.options.container;

		if (ctx.container.length) {
			ctx.container = ctx.container[0];
		}

		ctx.container.style.position = 'relative';
	};

	var setupState = function setupState(ctx) {
		ctx.queue = new Queue();
		ctx.events = new EventManager(ctx);
		ctx.rows = [];
		ctx.resizer = createResizeEvent(ctx);
	};

	var setupEventListeners = function setupEventListeners(ctx) {
		var imgs = $e('img', ctx.container);
		window.addEventListener('resize', ctx.resizer);
		ctx.on(ctx.constants.EVENT_IMAGE_LOAD, function () {
			return ctx.recalculate(false, false);
		});
		ctx.on(ctx.constants.EVENT_IMAGE_COMPLETE, function () {
			return ctx.recalculate(true, true);
		});

		if (!ctx.options.useOwnImageLoader) {
			imagesLoadedNew(ctx, imgs, !ctx.options.waitForImages);
		}

		ctx.emit(ctx.constants.EVENT_INITIALIZED);
	};

	var setup = function setup(ctx) {
		setupContainer(ctx);
		setupState(ctx);
		setupEventListeners(ctx);
	};

	var isObject = function isObject(obj) {
		return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
	};

	var replaceOptionsResponsively = function replaceOptionsResponsively(tempOpts, responsiveOptions) {
		if (!isObject(tempOpts)) {
			responsiveOptions.columns = tempOpts;
		}

		if (isObject(tempOpts) && tempOpts.columns) {
			responsiveOptions.columns = tempOpts.columns;
		}

		if (isObject(tempOpts) && tempOpts.margin && !isObject(tempOpts.margin)) {
			responsiveOptions.margin = {
				x: tempOpts.margin,
				y: tempOpts.margin
			};
		}

		if (isObject(tempOpts) && tempOpts.margin && isObject(tempOpts.margin) && tempOpts.margin.x) {
			responsiveOptions.margin.x = tempOpts.margin.x;
		}

		if (isObject(tempOpts) && tempOpts.margin && isObject(tempOpts.margin) && tempOpts.margin.y) {
			responsiveOptions.margin.y = tempOpts.margin.y;
		}
	};

	function getOptionsAsMobileFirst(_ref) {
		var options = _ref.options,
			responsiveOptions = _ref.responsiveOptions,
			keys = _ref.keys,
			docWidth = _ref.docWidth;
		var tempOpts = void 0;

		for (var i = 0; i < keys.length; i++) {
			var widths = parseInt(keys[i], 10);

			if (docWidth >= widths) {
				tempOpts = options.breakAt[widths];
				replaceOptionsResponsively(tempOpts, responsiveOptions);
			}
		}

		return responsiveOptions;
	}

	function getOptionsAsDesktopFirst(_ref2) {
		var options = _ref2.options,
			responsiveOptions = _ref2.responsiveOptions,
			keys = _ref2.keys,
			docWidth = _ref2.docWidth;
		var tempOpts = void 0;

		for (var i = keys.length - 1; i >= 0; i--) {
			var widths = parseInt(keys[i], 10);

			if (docWidth <= widths) {
				tempOpts = options.breakAt[widths];
				replaceOptionsResponsively(tempOpts, responsiveOptions);
			}
		}

		return responsiveOptions;
	}

	function getResponsiveOptions(options) {
		var docWidth = window.innerWidth;
		var responsiveOptions = {
			columns: options.columns
		};

		if (!isObject(options.margin)) {
			responsiveOptions.margin = {
				x: options.margin,
				y: options.margin
			};
		} else {
			responsiveOptions.margin = {
				x: options.margin.x,
				y: options.margin.y
			};
		}

		var keys = Object.keys(options.breakAt);

		if (options.mobileFirst) {
			return getOptionsAsMobileFirst({
				options: options,
				responsiveOptions: responsiveOptions,
				keys: keys,
				docWidth: docWidth
			});
		}

		return getOptionsAsDesktopFirst({
			options: options,
			responsiveOptions: responsiveOptions,
			keys: keys,
			docWidth: docWidth
		});
	}

	function getCurrentColumns(options) {
		var noOfColumns = getResponsiveOptions(options)
			.columns;
		return noOfColumns;
	}

	function getCurrentMargin(options) {
		var margin = getResponsiveOptions(options)
			.margin;
		return margin;
	}

	function getWidths(options) {
		var marginsIncluded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
		var noOfColumns = getCurrentColumns(options);
		var margins = getCurrentMargin(options)
			.x;
		var width = 100 / noOfColumns;

		if (!marginsIncluded) {
			return width;
		}

		if (noOfColumns === 1) {
			return '100%';
		}

		margins = (noOfColumns - 1) * margins / noOfColumns;
		return 'calc(' + width + '% - ' + margins + 'px)';
	}

	function getLeftPosition(ctx, col) {
		var noOfColumns = getCurrentColumns(ctx.options);
		var totalLeft = 0;
		var margin = void 0,
			str = void 0,
			baseMargin = void 0;
		col++;

		if (col === 1) {
			return 0;
		}

		baseMargin = getCurrentMargin(ctx.options)
			.x;
		margin = (baseMargin - (noOfColumns - 1) * baseMargin / noOfColumns) * (col - 1);
		totalLeft += getWidths(ctx.options, false) * (col - 1);
		str = 'calc(' + totalLeft + '% + ' + margin + 'px)';
		return str;
	}

	function setContainerHeight(ctx) {
		var largest = 0;
		var container = ctx.container,
			rows = ctx.rows;
		foreach(rows, function (row) {
			largest = row > largest ? row : largest;
		});
		container.style.height = largest + 'px';
	}

	var prop = function prop(element, property) {
		return window.getComputedStyle(element, null)
			.getPropertyValue(property);
	};

	var setUpRows = function setUpRows(ctx, cols) {
		var refresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		if (!ctx.lastcol) {
			ctx.lastcol = 0;
		}

		if (ctx.rows.length < 1) {
			refresh = true;
		}

		if (refresh) {
			ctx.rows = [];
			ctx.cols = [];
			ctx.lastcol = 0;

			for (var i = cols - 1; i >= 0; i--) {
				ctx.rows[i] = 0;
				ctx.cols[i] = getLeftPosition(ctx, i);
			}

			return;
		}

		if (ctx.tmpRows) {
			ctx.rows = [];

			for (var j = cols - 1; j >= 0; j--) {
				ctx.rows[j] = ctx.tmpRows[j];
			}

			return;
		}

		ctx.tmpRows = [];

		for (var k = cols - 1; k >= 0; k--) {
			ctx.tmpRows[k] = ctx.rows[k];
		}
	};

	function shuffle(ctx, $eles) {
		var refresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		var markasComplete = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
		var cols = getCurrentColumns(ctx.options);
		var margin = getCurrentMargin(ctx.options)
			.y;
		setUpRows(ctx, cols, refresh);
		foreach($eles, function (ele) {
			var smallest = 0;
			var eleHeight = parseInt(ele.offsetHeight, 10);
			if (isNaN(eleHeight)) return;
			ctx.rows.forEach(function (v, k) {
				if (v < ctx.rows[smallest]) {
					smallest = k;
				}
			});
			ele.style.position = 'absolute';
			ele.style.top = ctx.rows[smallest] + 'px';
			ele.style.left = '' + ctx.cols[smallest];
			ctx.rows[smallest] += !isNaN(eleHeight) ? eleHeight + margin : 0;

			if (markasComplete) {
				ele.dataset.macyComplete = 1;
			}
		});

		if (markasComplete) {
			ctx.tmpRows = null;
		}

		setContainerHeight(ctx);
	}

	function sort(ctx, $eles) {
		var refresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		var markasComplete = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
		var cols = getCurrentColumns(ctx.options);
		var margin = getCurrentMargin(ctx.options)
			.y;
		setUpRows(ctx, cols, refresh);
		foreach($eles, function (ele) {
			if (ctx.lastcol === cols) {
				ctx.lastcol = 0;
			}

			var eleHeight = prop(ele, 'height');
			eleHeight = parseInt(ele.offsetHeight, 10);
			if (isNaN(eleHeight)) return;
			ele.style.position = 'absolute';
			ele.style.top = ctx.rows[ctx.lastcol] + 'px';
			ele.style.left = '' + ctx.cols[ctx.lastcol];
			ctx.rows[ctx.lastcol] += !isNaN(eleHeight) ? eleHeight + margin : 0;
			ctx.lastcol += 1;

			if (markasComplete) {
				ele.dataset.macyComplete = 1;
			}
		});

		if (markasComplete) {
			ctx.tmpRows = null;
		}

		setContainerHeight(ctx);
	}

	var calculate = function calculate(ctx) {
		var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var loaded = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
		var children = refresh ? ctx.container.children : $e(':scope > *:not([data-macy-complete="1"])', ctx.container);
		var eleWidth = getWidths(ctx.options);
		foreach(children, function (child) {
			if (refresh) {
				child.dataset.macyComplete = 0;
			}

			child.style.width = eleWidth;
		});

		if (ctx.options.trueOrder) {
			sort(ctx, children, refresh, loaded);
			return ctx.emit(ctx.constants.EVENT_RECALCULATED);
		}

		shuffle(ctx, children, refresh, loaded);
		return ctx.emit(ctx.constants.EVENT_RECALCULATED);
	};

	var init$1 = function init() {
		try {
			document.createElement('a')
				.querySelector(':scope *');
		} catch (error) {
			(function () {
				var scope = /:scope\b/gi;
				var querySelectorWithScope = polyfill(Element.prototype.querySelector);

				Element.prototype.querySelector = function querySelector(selectors) {
					return querySelectorWithScope.apply(this, arguments);
				};

				var querySelectorAllWithScope = polyfill(Element.prototype.querySelectorAll);

				Element.prototype.querySelectorAll = function querySelectorAll(selectors) {
					return querySelectorAllWithScope.apply(this, arguments);
				};

				function polyfill(originalQuerySelector) {
					return function (selectors) {
						var hasScope = selectors && scope.test(selectors);

						if (hasScope) {
							var id = this.getAttribute('id');

							if (!id) {
								this.id = 'q' + Math.floor(Math.random() * 9000000) + 1000000;
							}

							arguments[0] = selectors.replace(scope, '#' + this.id);
							var elementOrNodeList = originalQuerySelector.apply(this, arguments);

							if (id === null) {
								this.removeAttribute('id');
							} else if (!id) {
								this.id = id;
							}

							return elementOrNodeList;
						} else {
							return originalQuerySelector.apply(this, arguments);
						}
					};
				}
			})();
		}
	};

	var _extends = Object.assign || function (target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];

			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}

		return target;
	};

	var defaults = {
		columns: 4,
		margin: 2,
		trueOrder: false,
		waitForImages: false,
		useImageLoader: true,
		breakAt: {},
		useOwnImageLoader: false,
		onInit: false
	};
	init$1();

	var Macy = function Macy() {
		var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;

		if (!(this instanceof Macy)) {
			return new Macy(opts);
		}

		this.options = {};

		_extends(this.options, defaults, opts);

		setup(this);
	};

	Macy.init = function (options) {
		console.warn('Depreciated: Macy.init will be removed in v3.0.0 opt to use Macy directly like so Macy({ /*options here*/ }) ');
		return new Macy(options);
	};

	Macy.prototype.recalculateOnImageLoad = function () {
		var waitUntilFinish = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var imgs = $e('img', this.container);
		return imagesLoadedNew(this, imgs, !waitUntilFinish);
	};

	Macy.prototype.runOnImageLoad = function (func) {
		var everyLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var imgs = $e('img', this.container);
		this.on(this.constants.EVENT_IMAGE_COMPLETE, func);

		if (everyLoad) {
			this.on(this.constants.EVENT_IMAGE_LOAD, func);
		}

		return imagesLoadedNew(this, imgs, everyLoad);
	};

	Macy.prototype.recalculate = function () {
		var _this = this;

		var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var loaded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		if (loaded) {
			this.queue.clear();
		}

		return this.queue.add(function () {
			return calculate(_this, refresh, loaded);
		});
	};

	Macy.prototype.remove = function () {
		window.removeEventListener('resize', this.resizer);
		foreach(this.container.children, function (child) {
			child.removeAttribute('data-macy-complete');
			child.removeAttribute('style');
		});
		this.container.removeAttribute('style');
	};

	Macy.prototype.reInit = function () {
		this.recalculate(true, true);
		this.emit(this.constants.EVENT_INITIALIZED);
		window.addEventListener('resize', this.resizer);
		this.container.style.position = 'relative';
	};

	Macy.prototype.on = function (key, func) {
		this.events.on(key, func);
	};

	Macy.prototype.emit = function (key, data) {
		this.events.emit(key, data);
	};

	Macy.constants = {
		EVENT_INITIALIZED: 'macy.initialized',
		EVENT_RECALCULATED: 'macy.recalculated',
		EVENT_IMAGE_LOAD: 'macy.image.load',
		EVENT_IMAGE_ERROR: 'macy.image.error',
		EVENT_IMAGE_COMPLETE: 'macy.images.complete',
		EVENT_RESIZE: 'macy.resize'
	};
	Macy.prototype.constants = Macy.constants;
	return Macy;
});
