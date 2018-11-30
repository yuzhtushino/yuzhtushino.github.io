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

/* jshint unused: true, undef: true, strict: true */

(function (global, factory) {
	// universal module definition
	/* jshint strict: false */
	/* globals define, module, window */
	if (typeof define == 'function' && define.amd) {
		// AMD - RequireJS
		define('ev-emitter/ev-emitter', factory);
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS - Browserify, Webpack
		module.exports = factory();
	} else {
		// Browser globals
		global.EvEmitter = factory();
	}

}
	(typeof window != 'undefined' ? window : this, function () {

		"use strict";

		function EvEmitter() {}

		var proto = EvEmitter.prototype;

		proto.on = function (eventName, listener) {
			if (!eventName || !listener) {
				return;
			}
			// set events hash
			var events = this._events = this._events || {};
			// set listeners array
			var listeners = events[eventName] = events[eventName] || [];
			// only add once
			if (listeners.indexOf(listener) == -1) {
				listeners.push(listener);
			}

			return this;
		};

		proto.once = function (eventName, listener) {
			if (!eventName || !listener) {
				return;
			}
			// add event
			this.on(eventName, listener);
			// set once flag
			// set onceEvents hash
			var onceEvents = this._onceEvents = this._onceEvents || {};
			// set onceListeners object
			var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
			// set flag
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
			}
			// copy over to avoid interference if .off() in listener
			listeners = listeners.slice(0);
			args = args || [];
			// once stuff
			var onceListeners = this._onceEvents && this._onceEvents[eventName];

			for (var i = 0; i < listeners.length; i++) {
				var listener = listeners[i];
				var isOnce = onceListeners && onceListeners[listener];
				if (isOnce) {
					// remove listener
					// remove before trigger to prevent recursion
					this.off(eventName, listener);
					// unset once flag
					delete onceListeners[listener];
				}
				// trigger listener
				listener.apply(this, args);
			}

			return this;
		};

		proto.allOff = function () {
			delete this._events;
			delete this._onceEvents;
		};

		return EvEmitter;

	}));

/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function (window, factory) {
	'use strict';
	// universal module definition

	/*global define: false, module: false, require: false */

	if (typeof define == 'function' && define.amd) {
		// AMD
		define([
				'ev-emitter/ev-emitter'
			], function (EvEmitter) {
			return factory(window, EvEmitter);
		});
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS
		module.exports = factory(
				window,
				require('ev-emitter'));
	} else {
		// browser global
		window.imagesLoaded = factory(
				window,
				window.EvEmitter);
	}

})(typeof window !== 'undefined' ? window : this,

	// --------------------------  factory -------------------------- //

	function factory(window, EvEmitter) {

	"use strict";

	var $ = window.jQuery;
	var console = window.console;

	// -------------------------- helpers -------------------------- //

	// extend objects
	function extend(a, b) {
		for (var prop in b) {
			if (b.hasOwnProperty(prop)) {
				a[prop] = b[prop];
			}
		}
		return a;
	}

	var arraySlice = Array.prototype.slice;

	// turn element or nodeList into an array
	function makeArray(obj) {
		if (Array.isArray(obj)) {
			// use object if already an array
			return obj;
		}

		var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
		if (isArrayLike) {
			// convert nodeList to array
			return arraySlice.call(obj);
		}

		// array of single index
		return [obj];
	}

	// -------------------------- imagesLoaded -------------------------- //

	/**
	 * @param {Array, Element, NodeList, String} elem
	 * @param {Object or Function} options - if function, use as callback
	 * @param {Function} onAlways - callback function
	 */
	function ImagesLoaded(elem, options, onAlways) {
		// coerce ImagesLoaded() without new, to be new ImagesLoaded()
		if (!(this instanceof ImagesLoaded)) {
			return new ImagesLoaded(elem, options, onAlways);
		}
		// use elem as selector string
		var queryElem = elem;
		if (typeof elem == 'string') {
			queryElem = document.querySelectorAll(elem);
		}
		// bail if bad element
		if (!queryElem) {
			console.error('Bad element for imagesLoaded ' + (queryElem || elem));
			return;
		}

		this.elements = makeArray(queryElem);
		this.options = extend({}, this.options);
		// shift arguments if no options set
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
		}

		// HACK check async to allow time to bind listeners
		setTimeout(this.check.bind(this));
	}

	ImagesLoaded.prototype = Object.create(EvEmitter.prototype);

	ImagesLoaded.prototype.options = {};

	ImagesLoaded.prototype.getImages = function () {
		this.images = [];

		// filter & find items if we have an item selector
		this.elements.forEach(this.addElementImages, this);
	};

	/**
	 * @param {Node} element
	 */
	ImagesLoaded.prototype.addElementImages = function (elem) {
		// filter siblings
		if (elem.nodeName == 'IMG') {
			this.addImage(elem);
		}
		// get background image on element
		if (this.options.background === true) {
			this.addElementBackgroundImages(elem);
		}

		// find children
		// no non-element nodes, #143
		var nodeType = elem.nodeType;
		if (!nodeType || !elementNodeTypes[nodeType]) {
			return;
		}
		var childImgs = elem.querySelectorAll('img');
		// concat childElems to filterFound array
		for (var i = 0; i < childImgs.length; i++) {
			var img = childImgs[i];
			this.addImage(img);
		}

		// get child background images
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
		}
		// get url inside url("...")
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
		this.hasAnyBroken = false;
		// complete if no images
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
		this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
		// progress event
		this.emitEvent('progress', [this, image, elem]);
		if (this.jqDeferred && this.jqDeferred.notify) {
			this.jqDeferred.notify(this, image);
		}
		// check if completed
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
	};

	// --------------------------  -------------------------- //

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
		}

		// If none of the checks above matched, simulate loading on detached element.
		this.proxyImage = new Image();
		this.proxyImage.addEventListener('load', this);
		this.proxyImage.addEventListener('error', this);
		// bind to image as well for Firefox. #191
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
	};

	// ----- events ----- //

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
	};

	// -------------------------- Background -------------------------- //

	function Background(url, element) {
		this.url = url;
		this.element = element;
		this.img = new Image();
	}

	// inherit LoadingImage prototype
	Background.prototype = Object.create(LoadingImage.prototype);

	Background.prototype.check = function () {
		this.img.addEventListener('load', this);
		this.img.addEventListener('error', this);
		this.img.src = this.url;
		// check if image is already complete
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
	};

	// -------------------------- jQuery -------------------------- //

	ImagesLoaded.makeJQueryPlugin = function (jQuery) {
		jQuery = jQuery || window.jQuery;
		if (!jQuery) {
			return;
		}
		// set local variable
		$ = jQuery;
		// $().imagesLoaded()
		$.fn.imagesLoaded = function (options, callback) {
			var instance = new ImagesLoaded(this, options, callback);
			return instance.jqDeferred.promise($(this));
		};
	};
	// try making plugin
	ImagesLoaded.makeJQueryPlugin();

	// --------------------------  -------------------------- //

	return ImagesLoaded;

});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
			event = new CustomEvent(eventString, { detail: { instance: instance } });
		} catch (err) {
			// Works in Internet Explorer (all versions)
			event = document.createEvent("CustomEvent");
			event.initCustomEvent(eventString, false, false, { instance: instance });
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
			for (var i = 0, optionsItem; (optionsItem = options[i]); i += 1) {
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
			return canvas.toDataURL(webpString).indexOf("data:" + webpString) === 0;
		}

		return false;
	};

	var runningOnBrowser = typeof window !== "undefined";

	var isBot = runningOnBrowser && !("onscroll" in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);

	var supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;

	var supportsClassList = runningOnBrowser && "classList" in document.createElement("p");

	var supportsWebp = runningOnBrowser && detectWebp();

	var setSourcesInChildren = function setSourcesInChildren(parentTag, attrName, dataAttrName, toWebpFlag) {
		for (var i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
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
		element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
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
			var element = entry.target;

			// WITHOUT LOAD DELAY
			if (!loadDelay) {
				if (isIntersecting(entry)) {
					loadAndUnobserve(element, observer, this);
				}
				return;
			}

			// WITH LOAD DELAY
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
		extendObj: function () {
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
		return str.split(/\s+/).length;
	};
	RM.generateTrimmed = function (str, wordsNum) {
		return str.split(/\s+/).slice(0, wordsNum).join(' ') + '...';
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
		elementsSelector = function (selector, context, undefined) {
			var matches = {
				"#": "getElementById",
				".": "getElementsByClassName",
				"@": "getElementsByName",
				"=": "getElementsByTagName",
				"*": "querySelectorAll"
			}
			[selector[0]];
			var el = (((context === undefined) ? document : context)[matches](selector.slice(1)));
			return ((el.length < 2) ? el[0] : el);
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
				moreContainer.innerHTML = '<a href="javascript:void(0);" id="rm-more_' +
					i +
					'" class="rm-link" style="cursor:pointer;">' +
					options.moreLink +
					'</a>';
				if (options.inline) {
					target[i].appendChild(moreContainer);
				} else {
					target[i].parentNode.insertBefore(moreContainer, target[i].nextSibling);
				}
			}
		}
		rmLink = doc.getElementsByClassName('rm-link') || "";
		var func = function () {
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

"use strict";

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
      return _color.match(RGB_match).slice(1);
    } else if (hex_match.test(_color)) {
      return _color.match(hex_match).slice(2).map(function (piece) {
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
      if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
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
      var header = document.createElement("div");
      header.setAttribute("class", "uwp-header");
      /* UWP.header = document.getElementsByClassName("uwp-header")[0] || ""; */

      UWP.header = header;
      document.body.appendChild(UWP.header);
      var main = document.createElement("div");
      main.setAttribute("class", "uwp-main");
      main.setAttribute("role", "main");
      /* UWP.main = document.getElementsByClassName("uwp-main")[0] || ""; */

      UWP.main = main;
      document.body.appendChild(UWP.main);
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
          toArray(elList).forEach(function (navSource) {
            var navMain = document.createElement("ul");
            UWP.nav.appendChild(navMain);
            var elEl = navsSource ? navSource.getElementsByTagName("nav-item") || "" : "";
            toArray(elEl).forEach(function (el) {
              navMain.appendChild(parseNavElement(el));
            });
          });
          /* If navigation was constructed, adds it to the DOM tree and displays menu button */

          if (toArray(elList).length) {
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
      toArray(navA).forEach(function (link) {
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
            UWP.body.classList.add("theme-light");
          } else {
            UWP.body.classList.add("theme-dark");
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


        UWP.customStyle.innerHTML += "\n\t\t\t\t[data-layout-type=\"tabs\"] .uwp-header {\n\t\t\t\t\tbackground: ".concat(UWP.config.mainColor, ";\n\t\t\t\t}\n\n\t\t\t\t[data-layout-type=\"overlay\"] .uwp-header {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"overlay\"] .uwp-header .uwp-nav:nth-of-type(1) {\n\t\t\t\t\tbackground-color: ").concat(UWP.config.mainColorDarkened, ";\n\t\t\t\t}\n\n\t\t\t\t[data-layout-type=\"docked-minimized\"] .uwp-header {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"docked-minimized\"] .uwp-header .uwp-nav:nth-of-type(1) {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColorDarkened, ";\n\t\t\t\t}\n\n\t\t\t\t[data-layout-type=\"docked\"] .uwp-header {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"docked\"] .uwp-header .uwp-nav:nth-of-type(1) {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColorDarkened, ";\n\t\t\t\t}\n\t\t\t");
      }

      if (UWP.config.activeColor) {
        var activeColor_RGB = parseColor(UWP.config.activeColor);

        if (activeColor_RGB) {
          var activeColor_brightness = calculateBrightness(activeColor_RGB);

          if (activeColor_brightness >= 128) {
            UWP.body.classList.add("active-light");
          } else {
            UWP.body.classList.add("active-dark");
          }
        }

        UWP.customStyle.innerHTML += "\n\t\t\t\t[data-layout-type=\"tabs\"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\t\t\t\t\tcolor: ".concat(UWP.config.activeColor, ";\n\t\t\t\t\tborder-bottom-color: ").concat(UWP.config.activeColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"overlay\"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\t\t\t\t\tbackground-color: ").concat(UWP.config.activeColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"docked-minimized\"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\t\t\t\t\tbackground-color: ").concat(UWP.config.activeColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"docked\"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\t\t\t\t\tbackground-color: ").concat(UWP.config.activeColor, ";\n\t\t\t\t}\n\t\t\t");
      }

      if (UWP.customStyle.innerHTML.length) {
        UWP.body.appendChild(UWP.customStyle);
        /* UWP.body.insertBefore(UWP.customStyle, UWP.body.firstChild); */
      }
    },

    /* Puts a menu button in title bar */
    addMenuButton: function addMenuButton() {
      console.log("UWP.addMenuButton()");
      /* UWP.menuButton = document.createElement("button"); */

      var menuButton = document.createElement("button");
      menuButton.setAttribute("class", "uwp-menu-button");
      UWP.menuButton = menuButton;
      /* UWP.menuButton.innerHTML = "&#xE700;"; */

      /* var GlobalNavButton = document.createElement("img");
      GlobalNavButton.src = "./static/img/svg/GlobalNavButton.svg";
      UWP.menuButton.appendChild(GlobalNavButton); */

      UWP.menuButton.innerHTML = '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" transform="scale(1.75 1.75) translate(0 0)" d="M1024 320h-1024v-64h1024v64zm0 512h-1024v-64h1024v64zm0-256.5h-1024v-63.5h1024v63.5z"/></svg>';
      UWP.menuButton.setAttribute("aria-label", "Menu");
      /* var headerNav = UWP.header.getElementsByTagName("nav")[0] || ""; */

      var headerNav = UWP.header.getElementsByClassName("uwp-nav")[0] || "";
      UWP.menuList = headerNav || "";
      UWP.menuButton.addEventListener("click", function () {
        UWP.menuList.classList.toggle("active");
      });
      UWP.main.addEventListener("click", function () {
        UWP.menuList.classList.remove("active");
      });
      UWP.header.prependChild(UWP.menuButton);
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


      UWP.main.classList.remove("error");
      UWP.main.innerHTML = "";
      /* Displays error message */

      function displayError(title) {
        UWP.main.classList.add("error");
        UWP.main.innerHTML = "\n\t\t\t\t<div class=\"error-container\">\n\t\t\t\t\t<p>".concat(title, "</p>\n\t\t\t\t\t<p><a href=\"javascript:void(0);\">Go Home</a></p>\n\t\t\t\t</div>\n\t\t\t");
        var mainA = UWP.main.getElementsByTagName("a")[0] || "";
        mainA.addEventListener("click", function (event) {
          event.stopPropagation();
          event.preventDefault();
          UWP.navigate(UWP.config.home);
        });
        UWP.updateNavigation();
      }

      var URL = "".concat(UWP.config.includes, "/").concat(target, ".html");
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

          var elTitle = page ? page.getElementsByTagName("page-title")[0] || "" : "";
          var pageTitle = elTitle.textContent || "";
          var elBody = page ? page.getElementsByTagName("page-content")[0] || "" : "";
          var pageBody = elBody.innerHTML || "";
          var pageIncludeScript = page ? page.getElementsByTagName("include-script")[0] || "" : "";
          var pageIncludeStyle = page ? page.getElementsByTagName("include-style")[0] || "" : "";
          /* Puts the new content in place */

          UWP.main.innerHTML = "";
          UWP.main.innerHTML = pageBody;
          UWP.main.classList.remove("start-animation");
          /*!
           * @see {@link https://stackoverflow.com/questions/30453078/uncaught-typeerror-cannot-set-property-offsetwidth-of-htmlelement-which-has/53089566#53089566}
           */

          (function () {
            return UWP.main.offsetWidth;
          })();

          UWP.main.classList.add("start-animation");
          /* Puts the new page title in place */

          UWP.pageTitle.innerHTML = pageTitle;
          document.title = "".concat(pageTitle, " - ").concat(UWP.config.pageTitle);
          /* Runs defined script */

          if (pageIncludeScript) {
            var scriptName = pageIncludeScript.textContent;

            var _src = "".concat(UWP.config.includeScript, "/").concat(scriptName);

            removeJsCssFile(_src, "js");
            var script = document.createElement("script");
            script.setAttribute("src", _src);
            script.async = true;
            UWP.body.appendChild(script);
          }
          /* Loads defined style */


          if (pageIncludeStyle) {
            var styleName = pageIncludeStyle.textContent;

            var _href = "".concat(UWP.config.includeStyle, "/").concat(styleName);

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
        }
      };

      UWP_navigate_request.send(null);
    }
  };
  root.UWP = UWP;
})("undefined" !== typeof window ? window : void 0, document);
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
	Main = (function () {
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
			return (this.timerElements = {
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
				});
		};
		Main.prototype.redefineProto = function () {
			var i,
			it,
			proto,
			t;
			it = this;
			return (t = (function () {
					var _i,
					_len,
					_ref,
					_results;
					_ref = this.allowedProtos;
					_results = [];
					var fn = function (proto) {
						var listener,
						remover;
						listener = proto.prototype.addEventListener || proto.prototype.attachEvent;

						var wrappedListener;

						(function (listener) {
							wrappedListener = function () {
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
								return (proto.prototype.addEventListener = wrappedListener);
							} else if (proto.prototype.attachEvent) {
								return (proto.prototype.attachEvent = wrappedListener);
							}
						})(listener);
						remover = proto.prototype.removeEventListener || proto.prototype.detachEvent;
						return (function (remover) {
							var wrappedRemover;
							wrappedRemover = function () {
								this.isAnyResizeEventInited = false;
								if (this.iframe) {
									this.removeChild(this.iframe);
								}
								return remover.apply(this, arguments);
							};
							if (proto.prototype.removeEventListener) {
								return (proto.prototype.removeEventListener = wrappedRemover);
							} else if (proto.prototype.detachEvent) {
								return (proto.prototype.detachEvent = wrappedListener);
							}
						})(remover);
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
				}).call(this));
		};
		Main.prototype.handleResize = function (args) {
			var computedStyle,
			el,
			iframe,
			isEmpty,
			isStatic,
			_ref;
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
					_ref.onresize = (function (_this) {
						return function (e) {
							return _this.dispatchEvent(el);
						};
					})(this);
				}
				el.iframe = iframe;
			} else {
				this.initTimer(el);
			}
			return (el.isAnyResizeEventInited = true);
		};
		Main.prototype.initTimer = function (el) {
			var height,
			width;
			width = 0;
			height = 0;
			return (this.interval = setInterval((function (_this) {
							return function () {
								var newHeight,
								newWidth;
								newWidth = el.offsetWidth;
								newHeight = el.offsetHeight;
								if (newWidth !== width || newHeight !== height) {
									_this.dispatchEvent(el);
									width = newWidth;
									return (height = newHeight);
								}
							};
						})(this), this.o.interval || 62.5));
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
			var i,
			it,
			proto,
			_i,
			_len,
			_ref,
			_results;
			clearInterval(this.interval);
			this.interval = null;
			window.isAnyResizeEventInited = false;
			it = this;
			_ref = this.allowedProtos;
			_results = [];
			var fn = function (proto) {
				var listener;
				listener = proto.prototype.addEventListener || proto.prototype.attachEvent;
				if (proto.prototype.addEventListener) {
					proto.prototype.addEventListener = Element.prototype.addEventListener;
				} else if (proto.prototype.attachEvent) {
					proto.prototype.attachEvent = Element.prototype.attachEvent;
				}
				if (proto.prototype.removeEventListener) {
					return (proto.prototype.removeEventListener = Element.prototype.removeEventListener);
				} else if (proto.prototype.detachEvent) {
					return (proto.prototype.detachEvent = Element.prototype.detachEvent);
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
	})();
	if ((typeof define === "function") && define.amd) {
		define("any-resize-event", [], function () {
			return new Main();
		});
	} else if ((typeof module === "object") && (typeof module.exports === "object")) {
		module.exports = new Main();
	} else {
		if (typeof window !== "undefined" && window !== null) {
			window.AnyResizeEvent = Main;
		}
		if (typeof window !== "undefined" && window !== null) {
			window.anyResizeEvent = new Main();
		}
	}
}).call(this);

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):t.Macy=n()}(this,function(){"use strict";function t(t,n){var e=void 0;return function(){e&&clearTimeout(e),e=setTimeout(t,n)}}function n(t,n){for(var e=t.length,o=e,r=[];e--;)r.push(n(t[o-e-1]));return r}function e(t,n){A(t,n,arguments.length>2&&void 0!==arguments[2]&&arguments[2])}function o(t){for(var n=t.options,e=t.responsiveOptions,o=t.keys,r=t.docWidth,i=void 0,s=0;s<o.length;s++){var a=parseInt(o[s],10);r>=a&&(i=n.breakAt[a],O(i,e))}return e}function r(t){for(var n=t.options,e=t.responsiveOptions,o=t.keys,r=t.docWidth,i=void 0,s=o.length-1;s>=0;s--){var a=parseInt(o[s],10);r<=a&&(i=n.breakAt[a],O(i,e))}return e}function i(t){var n=document.body.clientWidth,e={columns:t.columns};L(t.margin)?e.margin={x:t.margin.x,y:t.margin.y}:e.margin={x:t.margin,y:t.margin};var i=Object.keys(t.breakAt);return t.mobileFirst?o({options:t,responsiveOptions:e,keys:i,docWidth:n}):r({options:t,responsiveOptions:e,keys:i,docWidth:n})}function s(t){return i(t).columns}function a(t){return i(t).margin}function c(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],e=s(t),o=a(t).x,r=100/e;return n?1===e?"100%":(o=(e-1)*o/e,"calc("+r+"% - "+o+"px)"):r}function u(t,n){var e=s(t.options),o=0,r=void 0,i=void 0;return 1===++n?0:(i=a(t.options).x,r=(i-(e-1)*i/e)*(n-1),o+=c(t.options,!1)*(n-1),"calc("+o+"% + "+r+"px)")}function l(t){var n=0,e=t.container;m(t.rows,function(t){n=t>n?t:n}),e.style.height=n+"px"}function p(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r=s(t.options),i=a(t.options).y;C(t,r,e),m(n,function(n){var e=0,r=parseInt(n.offsetHeight,10);isNaN(r)||(t.rows.forEach(function(n,o){n<t.rows[e]&&(e=o)}),n.style.position="absolute",n.style.top=t.rows[e]+"px",n.style.left=""+t.cols[e],t.rows[e]+=isNaN(r)?0:r+i,o&&(n.dataset.macyComplete=1))}),o&&(t.tmpRows=null),l(t)}function h(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r=s(t.options),i=a(t.options).y;C(t,r,e),m(n,function(n){t.lastcol===r&&(t.lastcol=0);var e=M(n,"height");e=parseInt(n.offsetHeight,10),isNaN(e)||(n.style.position="absolute",n.style.top=t.rows[t.lastcol]+"px",n.style.left=""+t.cols[t.lastcol],t.rows[t.lastcol]+=isNaN(e)?0:e+i,t.lastcol+=1,o&&(n.dataset.macyComplete=1))}),o&&(t.tmpRows=null),l(t)}var f=function t(n,e){if(!(this instanceof t))return new t(n,e);if(n=n.replace(/^\s*/,"").replace(/\s*$/,""),e)return this.byCss(n,e);for(var o in this.selectors)if(e=o.split("/"),new RegExp(e[1],e[2]).test(n))return this.selectors[o](n);return this.byCss(n)};f.prototype.byCss=function(t,n){return(n||document).querySelectorAll(t)},f.prototype.selectors={},f.prototype.selectors[/^\.[\w\-]+$/]=function(t){return document.getElementsByClassName(t.substring(1))},f.prototype.selectors[/^\w+$/]=function(t){return document.getElementsByTagName(t)},f.prototype.selectors[/^\#[\w\-]+$/]=function(t){return document.getElementById(t.substring(1))};var m=function(t,n){for(var e=t.length,o=e;e--;)n(t[o-e-1])},v=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.running=!1,this.events=[],this.add(t)};v.prototype.run=function(){if(!this.running&&this.events.length>0){var t=this.events.shift();this.running=!0,t(),this.running=!1,this.run()}},v.prototype.add=function(){var t=this,n=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return!!n&&(Array.isArray(n)?m(n,function(n){return t.add(n)}):(this.events.push(n),void this.run()))},v.prototype.clear=function(){this.events=[]};var d=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.instance=t,this.data=n,this},g=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.events={},this.instance=t};g.prototype.on=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return!(!t||!n)&&(Array.isArray(this.events[t])||(this.events[t]=[]),this.events[t].push(n))},g.prototype.emit=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!t||!Array.isArray(this.events[t]))return!1;var e=new d(this.instance,n);m(this.events[t],function(t){return t(e)})};var y=function(t){return!("naturalHeight"in t&&t.naturalHeight+t.naturalWidth===0)||t.width+t.height!==0},E=function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return new Promise(function(t,e){if(n.complete)return y(n)?t(n):e(n);n.addEventListener("load",function(){return y(n)?t(n):e(n)}),n.addEventListener("error",function(){return e(n)})}).then(function(n){e&&t.emit(t.constants.EVENT_IMAGE_LOAD,{img:n})}).catch(function(n){return t.emit(t.constants.EVENT_IMAGE_ERROR,{img:n})})},w=function(t,e){var o=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return n(e,function(n){return E(t,n,o)})},A=function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return Promise.all(w(t,n,e)).then(function(){t.emit(t.constants.EVENT_IMAGE_COMPLETE)})},I=function(n){return t(function(){n.emit(n.constants.EVENT_RESIZE),n.queue.add(function(){return n.recalculate(!0,!0)})},100)},N=function(t){if(t.container=f(t.options.container),t.container instanceof f||!t.container)return!!t.options.debug&&console.error("Error: Container not found");delete t.options.container,t.container.length&&(t.container=t.container[0]),t.container.style.position="relative"},T=function(t){t.queue=new v,t.events=new g(t),t.rows=[],t.resizer=I(t)},b=function(t){var n=f("img",t.container);window.addEventListener("resize",t.resizer),t.on(t.constants.EVENT_IMAGE_LOAD,function(){return t.recalculate(!1,!1)}),t.on(t.constants.EVENT_IMAGE_COMPLETE,function(){return t.recalculate(!0,!0)}),t.options.useOwnImageLoader||e(t,n,!t.options.waitForImages),t.emit(t.constants.EVENT_INITIALIZED)},_=function(t){N(t),T(t),b(t)},L=function(t){return t===Object(t)&&"[object Array]"!==Object.prototype.toString.call(t)},O=function(t,n){L(t)||(n.columns=t),L(t)&&t.columns&&(n.columns=t.columns),L(t)&&t.margin&&!L(t.margin)&&(n.margin={x:t.margin,y:t.margin}),L(t)&&t.margin&&L(t.margin)&&t.margin.x&&(n.margin.x=t.margin.x),L(t)&&t.margin&&L(t.margin)&&t.margin.y&&(n.margin.y=t.margin.y)},M=function(t,n){return window.getComputedStyle(t,null).getPropertyValue(n)},C=function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(t.lastcol||(t.lastcol=0),t.rows.length<1&&(e=!0),e){t.rows=[],t.cols=[],t.lastcol=0;for(var o=n-1;o>=0;o--)t.rows[o]=0,t.cols[o]=u(t,o)}else if(t.tmpRows){t.rows=[];for(var o=n-1;o>=0;o--)t.rows[o]=t.tmpRows[o]}else{t.tmpRows=[];for(var o=n-1;o>=0;o--)t.tmpRows[o]=t.rows[o]}},V=function(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],e=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],o=n?t.container.children:f(':scope > *:not([data-macy-complete="1"])',t.container),r=c(t.options);return m(o,function(t){n&&(t.dataset.macyComplete=0),t.style.width=r}),t.options.trueOrder?(h(t,o,n,e),t.emit(t.constants.EVENT_RECALCULATED)):(p(t,o,n,e),t.emit(t.constants.EVENT_RECALCULATED))},R=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}return t},x={columns:4,margin:2,trueOrder:!1,waitForImages:!1,useImageLoader:!0,breakAt:{},useOwnImageLoader:!1,onInit:!1};!function(){try{document.createElement("a").querySelector(":scope *")}catch(t){!function(){function t(t){return function(e){if(e&&n.test(e)){var o=this.getAttribute("id");o||(this.id="q"+Math.floor(9e6*Math.random())+1e6),arguments[0]=e.replace(n,"#"+this.id);var r=t.apply(this,arguments);return null===o?this.removeAttribute("id"):o||(this.id=o),r}return t.apply(this,arguments)}}var n=/:scope\b/gi,e=t(Element.prototype.querySelector);Element.prototype.querySelector=function(t){return e.apply(this,arguments)};var o=t(Element.prototype.querySelectorAll);Element.prototype.querySelectorAll=function(t){return o.apply(this,arguments)}}()}}();var q=function t(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:x;if(!(this instanceof t))return new t(n);this.options={},R(this.options,x,n),_(this)};return q.init=function(t){return console.warn("Depreciated: Macy.init will be removed in v3.0.0 opt to use Macy directly like so Macy({ /*options here*/ }) "),new q(t)},q.prototype.recalculateOnImageLoad=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return e(this,f("img",this.container),!t)},q.prototype.runOnImageLoad=function(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=f("img",this.container);return this.on(this.constants.EVENT_IMAGE_COMPLETE,t),n&&this.on(this.constants.EVENT_IMAGE_LOAD,t),e(this,o,n)},q.prototype.recalculate=function(){var t=this,n=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return e&&this.queue.clear(),this.queue.add(function(){return V(t,n,e)})},q.prototype.remove=function(){window.removeEventListener("resize",this.resizer),m(this.container.children,function(t){t.removeAttribute("data-macy-complete"),t.removeAttribute("style")}),this.container.removeAttribute("style")},q.prototype.reInit=function(){this.recalculate(!0,!0),this.emit(this.constants.EVENT_INITIALIZED),window.addEventListener("resize",this.resizer),this.container.style.position="relative"},q.prototype.on=function(t,n){this.events.on(t,n)},q.prototype.emit=function(t,n){this.events.emit(t,n)},q.constants={EVENT_INITIALIZED:"macy.initialized",EVENT_RECALCULATED:"macy.recalculated",EVENT_IMAGE_LOAD:"macy.image.load",EVENT_IMAGE_ERROR:"macy.image.error",EVENT_IMAGE_COMPLETE:"macy.images.complete",EVENT_RESIZE:"macy.resize"},q.prototype.constants=q.constants,q});
