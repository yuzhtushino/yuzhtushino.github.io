/*jshint esnext: true */
/*jshint -W069 */
/*global define, module, Vimeo, YT, jwplayer */
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define('GLightbox', ['module'], factory);
	} else if (typeof exports !== "undefined") {
		factory(module);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod);
		global.GLightbox = mod.exports;
	}
})("undefined" !== typeof window ? window : this, function (module) {
	'use strict';
	/*jshint validthis: true */
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}
	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor)
					descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function (Constructor, protoProps, staticProps) {
			if (protoProps)
				defineProperties(Constructor.prototype, protoProps);
			if (staticProps)
				defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}
	();
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	}
	 : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};
	/**
	 * GLightbox v1.0.8
	 * Awesome pure javascript lightbox
	 * made by mcstudios.com.mx
	 */
	var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
	var isTouch = isMobile !== null || document.createTouch !== undefined || 'ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints;
	var html = document.getElementsByTagName('html')[0];
	var body = document.body;
	var transitionEnd = whichTransitionEvent();
	var animationEnd = whichAnimationEvent();
	var uid = Date.now();
	var YTTemp = [];
	var videoPlayers = {};
	// Default settings
	var defaults = {
		selector: 'glightbox',
		skin: 'clean',
		closeButton: true,
		startAt: 0,
		autoplayVideos: true,
		descPosition: 'bottom',
		width: 900,
		height: 506,
		videosWidth: 960,
		videosHeight: 540,
		beforeSlideChange: null,
		afterSlideChange: null,
		beforeSlideLoad: null,
		afterSlideLoad: null,
		onOpen: null,
		onClose: null,
		loopAtEnd: false,
		touchNavigation: true,
		keyboardNavigation: true,
		closeOnOutsideClick: true,
		jwplayer: {
			api: null,
			licenseKey: null,
			params: {
				width: '100%',
				aspectratio: '16:9',
				stretching: 'uniform'
			}
		},
		vimeo: {
			api: 'https://player.vimeo.com/api/player.js',
			params: {
				api: 1,
				title: 0,
				byline: 0,
				portrait: 0
			}
		},
		youtube: {
			api: 'https://www.youtube.com/iframe_api',
			params: {
				enablejsapi: 1,
				showinfo: 0
			}
		},
		openEffect: 'zoomIn', // fade, zoom, none
		closeEffect: 'zoomOut', // fade, zoom, none
		slideEffect: 'slide', // fade, slide, zoom, none
		moreText: 'See more',
		moreLength: 60,
		slideHtml: '',
		lightboxHtml: '',
		cssEfects: {
			fade: {
				in: 'fadeIn',
				out: 'fadeOut'
			},
			zoom: {
				in: 'zoomIn',
				out: 'zoomOut'
			},
			slide: {
				in: 'slideInRight',
				out: 'slideOutLeft'
			},
			slide_back: {
				in: 'slideInLeft',
				out: 'slideOutRight'
			}
		}
	};
	/* jshint multistr: true */
	// You can pass your own slide structure
	// just make sure that add the same classes so they are populated
	// title class = gslide-title
	// desc class = gslide-desc
	// prev arrow class = gnext
	// next arrow id = gprev
	// close id = gclose
	var lightboxSlideHtml = '<div class="gslide">\
		<div class="gslide-inner-content">\
		<div class="ginner-container">\
		<div class="gslide-media">\
		</div>\
		<div class="gslide-description">\
		<h4 class="gslide-title"></h4>\
		<div class="gslide-desc"></div>\
		</div>\
		</div>\
		</div>\
		</div>';
	defaults.slideHtml = lightboxSlideHtml;
	var lightboxHtml = '<div id="glightbox-body" class="glightbox-container">\
		<div class="gloader visible"></div>\
		<div class="goverlay"></div>\
		<div class="gcontainer">\
		<div id="glightbox-slider" class="gslider"></div>\
		<a class="gnext"></a>\
		<a class="gprev"></a>\
		<a class="gclose"></a>\
		</div>\
		</div>';
	defaults.lightboxHtml = lightboxHtml;
	/**
	 * Merge two or more objects
	 */
	function extend() {
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;
		if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
			deep = arguments[0];
			i++;
		}
		var merge = function merge(obj) {
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(true, extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};
		for (; i < length; i++) {
			var obj = arguments[i];
			merge(obj);
		}
		return extended;
	}
	var utils = {
		isFunction: function isFunction(f) {
			return typeof f === 'function';
		},
		isString: function isString(s) {
			return typeof s === 'string';
		},
		isNode: function isNode(el) {
			return !!(el && el.nodeType && el.nodeType == 1);
		},
		isArray: function isArray(ar) {
			return Array.isArray(ar);
		},
		isArrayLike: function isArrayLike(ar) {
			return ar && ar.length && isFinite(ar.length);
		},
		isObject: function isObject(o) {
			var type = typeof o === 'undefined' ? 'undefined' : _typeof(o);
			return type === 'object' && o != null && !utils.isFunction(o) && !utils.isArray(o);
		},
		isNil: function isNil(o) {
			return o == null;
		},
		has: function has(obj, key) {
			return obj !== null && hasOwnProperty.call(obj, key);
		},
		size: function size(o) {
			if (utils.isObject(o)) {
				if (o.keys) {
					return o.keys().length;
				}
				var l = 0;
				for (var k in o) {
					if (utils.has(o, k)) {
						l++;
					}
				}
				return l;
			} else {
				return o.length;
			}
		},
		isNumber: function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
	};
	/**
	 * Each
	 *
	 * @param {mixed} node lisy, array, object
	 * @param {function} callback
	 */
	function each(collection, callback) {
		if (utils.isNode(collection) || collection === window || collection === document) {
			collection = [collection];
		}
		if (!utils.isArrayLike(collection) && !utils.isObject(collection)) {
			collection = [collection];
		}
		if (utils.size(collection) == 0) {
			return;
		}
		if (utils.isArrayLike(collection) && !utils.isObject(collection)) {
			var l = collection.length,
			i = 0;
			for (; i < l; i++) {
				if (callback.call(collection[i], collection[i], i, collection) === false) {
					break;
				}
			}
		} else if (utils.isObject(collection)) {
			for (var key in collection) {
				if (utils.has(collection, key)) {
					if (callback.call(collection[key], collection[key], key, collection) === false) {
						break;
					}
				}
			}
		}
	}
	/**
	 * Get nde events
	 * return node events and optionally
	 * check if the node has already a specific event
	 * to avoid duplicated callbacks
	 *
	 * @param {node} node
	 * @param {string} name event name
	 * @param {object} fn callback
	 * @returns {object}
	 */
	function getNodeEvents(node) {
		var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		var fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
		var cache = node[uid] = node[uid] || [];
		var data = {
			all: cache,
			evt: null,
			found: null
		};
		if (name && fn && utils.size(cache) > 0) {
			each(cache, function (cl, i) {
				if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
					data.found = true;
					data.evt = i;
					return false;
				}
			});
		}
		return data;
	}
	/**
	 * Add Event
	 * Add an event listener
	 *
	 * @param {string} eventName
	 * @param {object} detials
	 */
	function addEvent(eventName) {
		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		onElement = _ref.onElement,
		withCallback = _ref.withCallback,
		_ref$avoidDuplicate = _ref.avoidDuplicate,
		avoidDuplicate = _ref$avoidDuplicate === undefined ? true : _ref$avoidDuplicate,
		_ref$once = _ref.once,
		once = _ref$once === undefined ? false : _ref$once,
		_ref$useCapture = _ref.useCapture,
		useCapture = _ref$useCapture === undefined ? false : _ref$useCapture;
		var thisArg = arguments[2];
		var element = onElement || [];
		if (utils.isString(element)) {
			element = document.querySelectorAll(element);
		}
		function handler(event) {
			if (utils.isFunction(withCallback)) {
				withCallback.call(thisArg, event, this);
			}
			if (once) {
				handler.destroy();
			}
		}
		handler.destroy = function () {
			each(element, function (el) {
				var events = getNodeEvents(el, eventName, handler);
				if (events.found) {
					events.all.splice(events.evt, 1);
				}
				if (el.removeEventListener)
					el.removeEventListener(eventName, handler, useCapture);
			});
		};
		each(element, function (el) {
			var events = getNodeEvents(el, eventName, handler);
			if (el.addEventListener && avoidDuplicate && !events.found || !avoidDuplicate) {
				el.addEventListener(eventName, handler, useCapture);
				events.all.push({
					eventName: eventName,
					fn: handler
				});
			}
		});
		return handler;
	}
	/**
	 * Add element class
	 *
	 * @param {node} element
	 * @param {string} class name
	 */
	function addClass(node, name) {
		if (hasClass(node, name)) {
			return;
		}
		if (node.classList) {
			node.classList.add(name);
		} else {
			node.className += " " + name;
		}
	}
	/**
	 * Remove element class
	 *
	 * @param {node} element
	 * @param {string} class name
	 */
	function removeClass(node, name) {
		var c = name.split(' ');
		if (c.length > 1) {
			each(c, function (cl) {
				removeClass(node, cl);
			});
			return;
		}
		if (node.classList) {
			node.classList.remove(name);
		} else {
			node.className = node.className.replace(name, "");
		}
	}
	/**
	 * Has class
	 *
	 * @param {node} element
	 * @param {string} class name
	 */
	function hasClass(node, name) {
		return node.classList ? node.classList.contains(name) : new RegExp("(^| )" + name + "( |$)", "gi").test(node.className);
	}
	/**
	 * Determine animation events
	 */
	function whichAnimationEvent() {
		var t = void 0,
		el = document.createElement("fakeelement");
		var animations = {
			animation: "animationend",
			OAnimation: "oAnimationEnd",
			MozAnimation: "animationend",
			WebkitAnimation: "webkitAnimationEnd"
		};
		for (t in animations) {
			if (el.style[t] !== undefined) {
				return animations[t];
			}
		}
	}
	/**
	 * Determine transition events
	 */
	function whichTransitionEvent() {
		var t = void 0,
		el = document.createElement("fakeelement");
		var transitions = {
			transition: "transitionend",
			OTransition: "oTransitionEnd",
			MozTransition: "transitionend",
			WebkitTransition: "webkitTransitionEnd"
		};
		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
	}
	/**
	 * CSS Animations
	 *
	 * @param {node} element
	 * @param {string} animation name
	 * @param {function} callback
	 */
	function animateElement(element) {
		var animation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
		var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		if (!element || animation === '') {
			return false;
		}
		if (animation == 'none') {
			if (utils.isFunction(callback))
				callback();
			return false;
		}
		var animationNames = animation.split(' ');
		each(animationNames, function (name) {
			addClass(element, 'g' + name);
		});
		addEvent(animationEnd, {
			onElement: element,
			avoidDuplicate: false,
			once: true,
			withCallback: function withCallback(event, target) {
				each(animationNames, function (name) {
					removeClass(target, 'g' + name);
				});
				if (utils.isFunction(callback))
					callback();
			}
		});
	}
	/**
	 * Create a document fragment
	 *
	 * @param {string} html code
	 */
	function createHTML(htmlStr) {
		var frag = document.createDocumentFragment(),
		temp = document.createElement('div');
		temp.innerHTML = htmlStr;
		while (temp.firstChild) {
			frag.appendChild(temp.firstChild);
		}
		return frag;
	}
	/**
	 * Get the closestElement
	 *
	 * @param {node} element
	 * @param {string} class name
	 */
	function getClosest(elem, selector) {
		while (elem !== document.body) {
			elem = elem.parentElement;
			var matches = typeof elem.matches == 'function' ? elem.matches(selector) : elem.msMatchesSelector(selector);
			if (matches)
				return elem;
		}
	}
	/**
	 * Show element
	 *
	 * @param {node} element
	 */
	function show(element) {
		element.style.display = 'block';
	}
	/**
	 * Hide element
	 */
	function hide(element) {
		element.style.display = 'none';
	}
	/**
	 * Get slide data
	 *
	 * @param {node} element
	 */
	var getSlideData = function getSlideData() {
		var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var settings = arguments[1];
		var data = {
			href: '',
			title: '',
			description: '',
			descPosition: 'bottom',
			effect: '',
			node: element
		};
		if (utils.isObject(element) && !utils.isNode(element)) {
			return extend(data, element);
		}
		var url = '';
		var config = element.getAttribute('data-glightbox');
		var type = element.nodeName.toLowerCase();
		if (type === 'a')
			url = element.href;
		if (type === 'img')
			url = element.src;
		data.href = url;
		each(data, function (val, key) {
			if (utils.has(settings, key)) {
				data[key] = settings[key];
			}
			var nodeData = element.dataset[key];
			if (!utils.isNil(nodeData)) {
				data[key] = nodeData;
			}
		});
		var sourceType = getSourceType(url);
		data = extend(data, sourceType);
		if (!utils.isNil(config)) {
			var cleanKeys = [];
			each(data, function (v, k) {
				cleanKeys.push(';\\s?' + k);
			});
			cleanKeys = cleanKeys.join('\\s?:|');
			if (config.trim() !== '') {
				each(data, function (val, key) {
					var str = config;
					var match = '\s?' + key + '\s?:\s?(.*?)(' + cleanKeys + '\s?:|$)';
					var regex = new RegExp(match);
					var matches = str.match(regex);
					if (matches && matches.length && matches[1]) {
						var value = matches[1].trim().replace(/;\s*$/, '');
						data[key] = value;
					}
				});
			}
		} else {
			if (type == 'a') {
				var title = element.title;
				if (!utils.isNil(title) && title !== '')
					data.title = title;
			}
			if (type == 'img') {
				var alt = element.alt;
				if (!utils.isNil(alt) && alt !== '')
					data.title = alt;
			}
			var desc = element.getAttribute('data-description');
			if (!utils.isNil(desc) && desc !== '')
				data.description = desc;
		}
		var nodeDesc = element.querySelector('.glightbox-desc');
		if (nodeDesc) {
			data.description = nodeDesc.innerHTML;
		}
		data.sourcetype = data.hasOwnProperty('type') ? data.type : data.sourcetype;
		data.type = data.sourcetype;
		var defaultWith = data.sourcetype == 'video' ? settings.videosWidth : settings.width;
		var defaultHeight = data.sourcetype == 'video' ? settings.videosHeight : settings.height;
		data.width = utils.has(data, 'width') ? data.width : defaultWith;
		data.height = utils.has(data, 'height') ? data.height : defaultHeight;
		return data;
	};
	/**
	 * Set slide content
	 *
	 * @param {node} slide
	 * @param {object} data
	 * @param {function} callback
	 */
	var setSlideContent = function setSlideContent() {
		var slide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var _this = this;
		var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		if (hasClass(slide, 'loaded')) {
			return false;
		}
		if (utils.isFunction(this.settings.beforeSlideLoad)) {
			this.settings.beforeSlideLoad(slide, data);
		}
		var type = data.type;
		var position = data.descPosition;
		var slideMedia = slide.querySelector('.gslide-media');
		var slideTitle = slide.querySelector('.gslide-title');
		var slideText = slide.querySelector('.gslide-desc');
		var slideDesc = slide.querySelector('.gslide-description');
		var finalCallback = callback;
		if (utils.isFunction(this.settings.afterSlideLoad)) {
			finalCallback = function finalCallback() {
				if (utils.isFunction(callback)) {
					callback();
				}
				_this.settings.afterSlideLoad(slide, data);
			};
		}
		if (data.title == '' && data.description == '') {
			if (slideDesc) {
				slideDesc.parentNode.removeChild(slideDesc);
			}
		} else {
			if (slideTitle && data.title !== '') {
				slideTitle.innerHTML = data.title;
			} else {
				slideTitle.parentNode.removeChild(slideTitle);
			}
			if (slideText && data.description !== '') {
				if (isMobile && this.settings.moreLength > 0) {
					data.smallDescription = slideShortDesc(data.description, this.settings.moreLength, this.settings.moreText);
					slideText.innerHTML = data.smallDescription;
					slideDescriptionEvents.apply(this, [slideText, data]);
				} else {
					slideText.innerHTML = data.description;
				}
			} else {
				slideText.parentNode.removeChild(slideText);
			}
			addClass(slideMedia.parentNode, 'desc-' + position);
			addClass(slideDesc, 'description-' + position);
		}
		addClass(slideMedia, 'gslide-' + type);
		addClass(slide, 'loaded');
		if (type === 'video') {
			setSlideVideo.apply(this, [slide, data, finalCallback]);
			return;
		}
		if (type === 'external') {
			var iframe = createIframe(data.href, data.width, data.height, finalCallback);
			slideMedia.appendChild(iframe);
			return;
		}
		if (type === 'inline') {
			setInlineContent.apply(this, [slide, data, finalCallback]);
			return;
		}
		if (type === 'image') {
			var img = new Image();
			img.addEventListener('load', function () {
				if (utils.isFunction(finalCallback)) {
					finalCallback();
				}
			}, false);
			img.src = data.href;
			slideMedia.appendChild(img);
			return;
		}
		if (utils.isFunction(finalCallback))
			finalCallback();
	};
	/**
	 * Set slide video
	 *
	 * @param {node} slide
	 * @param {object} data
	 * @param {function} callback
	 */
	function setSlideVideo(slide, data, callback) {
		var _this2 = this;
		var source = data.source;
		var video_id = 'gvideo' + data.index;
		var slideMedia = slide.querySelector('.gslide-media');
		var url = data.href;
		var protocol = location.protocol.replace(':', '');
		if (protocol == 'file') {
			protocol = 'http';
		}
		// Set vimeo videos
		if (source == 'vimeo') {
			var vimeo_id = /vimeo.*\/(\d+)/i.exec(url);
			var params = parseUrlParams(this.settings.vimeo.params);
			var video_url = protocol + '://player.vimeo.com/video/' + vimeo_id[1] + '?' + params;
			injectVideoApi(this.settings.vimeo.api);
			var finalCallback = function finalCallback() {
				waitUntil(function () {
					return typeof Vimeo !== 'undefined';
				}, function () {
					var player = new Vimeo.Player(iframe);
					videoPlayers[video_id] = player;
					if (utils.isFunction(callback)) {
						callback();
					}
				});
			};
			var iframe = createIframe(video_url, data.width, data.height, finalCallback, slideMedia);
			iframe.id = video_id;
			iframe.className = 'vimeo-video gvideo';
			if (this.settings.autoplayVideos && !isMobile) {
				iframe.className += ' wait-autoplay';
			}
		}
		// Set youtube videos
		if (source == 'youtube') {
			var youtube_params = extend(this.settings.youtube.params, {
					playerapiid: video_id
				});
			var yparams = parseUrlParams(youtube_params);
			var youtube_id = getYoutubeID(url);
			var _video_url = protocol + '://www.youtube.com/embed/' + youtube_id + '?' + yparams;
			injectVideoApi(this.settings.youtube.api);
			var _finalCallback = function _finalCallback() {
				if (!utils.isNil(YT) && YT.loaded) {
					var player = new YT.Player(_iframe);
					videoPlayers[video_id] = player;
				} else {
					YTTemp.push(_iframe);
				}
				if (utils.isFunction(callback)) {
					callback();
				}
			};
			var _iframe = createIframe(_video_url, data.width, data.height, _finalCallback, slideMedia);
			_iframe.id = video_id;
			_iframe.className = 'youtube-video gvideo';
			if (this.settings.autoplayVideos && !isMobile) {
				_iframe.className += ' wait-autoplay';
			}
		}
		if (source == 'local') {
			var _html = '<video id="' + video_id + '" ';
			_html += 'style="background:#000; width: ' + data.width + 'px; height: ' + data.height + 'px;" ';
			_html += 'preload="metadata" ';
			_html += 'x-webkit-airplay="allow" ';
			_html += 'webkit-playsinline="" ';
			_html += 'controls ';
			_html += 'class="gvideo">';
			var format = url.toLowerCase().split('.').pop();
			var sources = {
				'mp4': '',
				'ogg': '',
				'webm': ''
			};
			sources[format] = url;
			for (var key in sources) {
				if (sources.hasOwnProperty(key)) {
					var videoFile = sources[key];
					if (data.hasOwnProperty(key)) {
						videoFile = data[key];
					}
					if (videoFile !== '') {
						_html += '<source src="' + videoFile + '" type="video/' + key + '">';
					}
				}
			}
			_html += '</video>';
			var video = createHTML(_html);
			slideMedia.appendChild(video);
			var vnode = document.getElementById(video_id);
			if (this.settings.jwplayer !== null && this.settings.jwplayer.api !== null) {
				var jwplayerConfig = this.settings.jwplayer;
				var jwplayerApi = this.settings.jwplayer.api;
				if (!jwplayerApi) {
					console.warn('Missing jwplayer api file');
					if (utils.isFunction(callback))
						callback();
					return false;
				}
				injectVideoApi(jwplayerApi, function () {
					var jwconfig = extend(_this2.settings.jwplayer.params, {
							width: data.width + 'px',
							height: data.height + 'px',
							file: url
						});
					jwplayer.key = _this2.settings.jwplayer.licenseKey;
					var player = jwplayer(video_id);
					player.setup(jwconfig);
					videoPlayers[video_id] = player;
					player.on('ready', function () {
						vnode = slideMedia.querySelector('.jw-video');
						addClass(vnode, 'gvideo');
						vnode.id = video_id;
						if (utils.isFunction(callback))
							callback();
					});
				});
			} else {
				addClass(vnode, 'html5-video');
				videoPlayers[video_id] = vnode;
				if (utils.isFunction(callback))
					callback();
			}
		}
	}
	/**
	 * Create an iframe element
	 *
	 * @param {string} url
	 * @param {numeric} width
	 * @param {numeric} height
	 * @param {function} callback
	 */
	function createIframe(url, width, height, callback, appendTo) {
		var iframe = document.createElement('iframe');
		var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		iframe.className = 'vimeo-video gvideo';
		iframe.src = url;
		if (isMobile && winWidth < 767) {
			iframe.style.height = '';
		} else {
			iframe.style.height = height + 'px';
		}
		iframe.style.width = width + 'px';
		iframe.setAttribute('allowFullScreen', '');
		iframe.onload = function () {
			addClass(iframe, 'iframe-ready');
			if (utils.isFunction(callback)) {
				callback();
			}
		};
		if (appendTo) {
			appendTo.appendChild(iframe);
		}
		return iframe;
	}
	/**
	 * Get youtube ID
	 *
	 * @param {string} url
	 * @returns {string} video id
	 */
	function getYoutubeID(url) {
		var videoID = '';
		url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		if (url[2] !== undefined) {
			videoID = url[2].split(/[^0-9a-z_\-]/i);
			videoID = videoID[0];
		} else {
			videoID = url;
		}
		return videoID;
	}
	/**
	 * Inject videos api
	 * used for youtube, vimeo and jwplayer
	 *
	 * @param {string} url
	 * @param {function} callback
	 */
	function injectVideoApi(url, callback) {
		if (utils.isNil(url)) {
			console.error('Inject videos api error');
			return;
		}
		var found = document.querySelectorAll('script[src="' + url + '"]');
		if (utils.isNil(found) || found.length == 0) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			script.onload = function () {
				if (utils.isFunction(callback))
					callback();
			};
			document.body.appendChild(script);
			return false;
		}
		if (utils.isFunction(callback))
			callback();
	}
	/**
	 * Handle youtube Api
	 * This is a simple fix, when the video
	 * is ready sometimes the youtube api is still
	 * loading so we can not autoplay or pause
	 * we need to listen onYouTubeIframeAPIReady and
	 * register the videos if required
	 */
	function youtubeApiHandle() {
		for (var i = 0; i < YTTemp.length; i++) {
			var iframe = YTTemp[i];
			var player = new YT.Player(iframe);
			videoPlayers[iframe.id] = player;
		}
	}
	if (typeof window.onYouTubeIframeAPIReady !== 'undefined') {
		window.onYouTubeIframeAPIReady = function () {
			window.onYouTubeIframeAPIReady();
			youtubeApiHandle();
		};
	} else {
		window.onYouTubeIframeAPIReady = youtubeApiHandle;
	}
	/**
	 * Wait until
	 * wait until all the validations
	 * are passed
	 *
	 * @param {function} check
	 * @param {function} onComplete
	 * @param {numeric} delay
	 * @param {numeric} timeout
	 */
	function waitUntil(check, onComplete, delay, timeout) {
		if (check()) {
			onComplete();
			return;
		}
		if (!delay)
			delay = 100;
		var timeoutPointer;
		var intervalPointer = setInterval(function () {
				if (!check())
					return;
				clearInterval(intervalPointer);
				if (timeoutPointer)
					clearTimeout(timeoutPointer);
				onComplete();
			}, delay);
		if (timeout)
			timeoutPointer = setTimeout(function () {
					clearInterval(intervalPointer);
				}, timeout);
	}
	/**
	 * Parse url params
	 * convert an object in to a
	 * url query string parameters
	 *
	 * @param {object} params
	 */
	function parseUrlParams(params) {
		var qs = '';
		var i = 0;
		each(params, function (val, key) {
			if (i > 0) {
				qs += '&amp;';
			}
			qs += key + '=' + val;
			i += 1;
		});
		return qs;
	}
	/**
	 * Set slide inline content
	 * we'll extend this to make http
	 * requests using the fetch api
	 * but for now we keep it simple
	 *
	 * @param {node} slide
	 * @param {object} data
	 * @param {function} callback
	 */
	function setInlineContent(slide, data, callback) {
		var slideMedia = slide.querySelector('.gslide-media');
		var div = document.getElementById(data.inlined.replace('#', ''));
		if (div) {
			var cloned = div.cloneNode(true);
			cloned.style.height = data.height + 'px';
			cloned.style.maxWidth = data.width + 'px';
			addClass(cloned, 'ginlined-content');
			slideMedia.appendChild(cloned);
			if (utils.isFunction(callback)) {
				callback();
			}
			return;
		}
	}
	/**
	 * Get source type
	 * gte the source type of a url
	 *
	 * @param {string} url
	 */
	var getSourceType = function getSourceType(url) {
		var origin = url;
		url = url.toLowerCase();
		var data = {};
		if (url.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
			data.sourcetype = 'image';
			return data;
		}
		if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/)) {
			data.sourcetype = 'video';
			data.source = 'youtube';
			return data;
		}
		if (url.match(/vimeo\.com\/([0-9]*)/)) {
			data.sourcetype = 'video';
			data.source = 'vimeo';
			return data;
		}
		if (url.match(/\.(mp4|ogg|webm)$/) !== null) {
			data.sourcetype = 'video';
			data.source = 'local';
			return data;
		}
		// Check if inline content
		if (url.indexOf("#") > -1) {
			var hash = origin.split('#').pop();
			if (hash.trim() !== '') {
				data.sourcetype = 'inline';
				data.source = url;
				data.inlined = '#' + hash;
				return data;
			}
		}
		// Ajax
		if (url.includes("gajax=true")) {
			data.sourcetype = 'ajax';
			data.source = url;
		}
		// Any other url
		data.sourcetype = 'external';
		data.source = url;
		return data;
	};
	/**
	 * Desktop keyboard navigation
	 */
	function keyboardNavigation() {
		var _this3 = this;
		if (this.events.hasOwnProperty('keyboard')) {
			return false;
		}
		this.events['keyboard'] = addEvent('keydown', {
				onElement: window,
				withCallback: function withCallback(event, target) {
					event = event || window.event;
					var key = event.keyCode;
					if (key == 39)
						_this3.nextSlide();
					if (key == 37)
						_this3.prevSlide();
					if (key == 27)
						_this3.close();
				}
			});
	}
	/**
	 * Touch navigation
	 */
	function touchNavigation() {
		var _this4 = this;
		if (this.events.hasOwnProperty('touchStart')) {
			return false;
		}
		var index = void 0,
		hDistance = void 0,
		vDistance = void 0,
		hDistanceLast = void 0,
		vDistanceLast = void 0,
		hDistancePercent = void 0,
		vSwipe = false,
		hSwipe = false,
		hSwipMinDistance = 0,
		vSwipMinDistance = 0,
		doingPinch = false,
		pinchBigger = false,
		startCoords = {},
		endCoords = {},
		slider = this.slidesContainer,
		activeSlide = null,
		xDown = 0,
		yDown = 0,
		activeSlideImage = null,
		activeSlideMedia = null,
		activeSlideDesc = null;
		var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		this.events['doctouchmove'] = addEvent('touchmove', {
				onElement: document,
				withCallback: function withCallback(e, target) {
					if (hasClass(body, 'gdesc-open')) {
						e.preventDefault();
						return false;
					}
				}
			});
		this.events['touchStart'] = addEvent('touchstart', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					if (hasClass(body, 'gdesc-open')) {
						return;
					}
					addClass(body, 'touching');
					activeSlide = _this4.getActiveSlide();
					activeSlideImage = activeSlide.querySelector('.gslide-image');
					activeSlideMedia = activeSlide.querySelector('.gslide-media');
					activeSlideDesc = activeSlide.querySelector('.gslide-description');
					index = _this4.index;
					endCoords = e.targetTouches[0];
					startCoords.pageX = e.targetTouches[0].pageX;
					startCoords.pageY = e.targetTouches[0].pageY;
					xDown = e.targetTouches[0].clientX;
					yDown = e.targetTouches[0].clientY;
				}
			});
		this.events['gestureStart'] = addEvent('gesturestart', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					if (activeSlideImage) {
						e.preventDefault();
						doingPinch = true;
					}
				}
			});
		this.events['gestureChange'] = addEvent('gesturechange', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					e.preventDefault();
					slideCSSTransform(activeSlideImage, 'scale(' + e.scale + ')');
				}
			});
		this.events['gesturEend'] = addEvent('gestureend', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					doingPinch = false;
					if (e.scale < 1) {
						pinchBigger = false;
						slideCSSTransform(activeSlideImage, 'scale(1)');
					} else {
						pinchBigger = true;
					}
				}
			});
		this.events['touchMove'] = addEvent('touchmove', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					if (!hasClass(body, 'touching')) {
						return;
					}
					if (hasClass(body, 'gdesc-open') || doingPinch || pinchBigger) {
						return;
					}
					e.preventDefault();
					endCoords = e.targetTouches[0];
					var slideHeight = activeSlide.querySelector('.gslide-inner-content').offsetHeight;
					var slideWidth = activeSlide.querySelector('.gslide-inner-content').offsetWidth;
					var xUp = e.targetTouches[0].clientX;
					var yUp = e.targetTouches[0].clientY;
					var xDiff = xDown - xUp;
					var yDiff = yDown - yUp;
					if (Math.abs(xDiff) > Math.abs(yDiff)) {
						/*most significant*/
						vSwipe = false;
						hSwipe = true;
					} else {
						hSwipe = false;
						vSwipe = true;
					}
					if (vSwipe) {
						vDistanceLast = vDistance;
						vDistance = endCoords.pageY - startCoords.pageY;
						if (Math.abs(vDistance) >= vSwipMinDistance || vSwipe) {
							var opacity = 0.75 - Math.abs(vDistance) / slideHeight;
							activeSlideMedia.style.opacity = opacity;
							if (activeSlideDesc) {
								activeSlideDesc.style.opacity = opacity;
							}
							slideCSSTransform(activeSlideMedia, 'translate3d(0, ' + vDistance + 'px, 0)');
						}
						return;
					}
					hDistanceLast = hDistance;
					hDistance = endCoords.pageX - startCoords.pageX;
					hDistancePercent = hDistance * 100 / winWidth;
					if (hSwipe) {
						if (_this4.index + 1 == _this4.elements.length && hDistance < -60) {
							resetSlideMove(activeSlide);
							return false;
						}
						if (_this4.index - 1 < 0 && hDistance > 60) {
							resetSlideMove(activeSlide);
							return false;
						}
						var _opacity = 0.75 - Math.abs(hDistance) / slideWidth;
						activeSlideMedia.style.opacity = _opacity;
						if (activeSlideDesc) {
							activeSlideDesc.style.opacity = _opacity;
						}
						slideCSSTransform(activeSlideMedia, 'translate3d(' + hDistancePercent + '%, 0, 0)');
					}
				}
			});
		this.events['touchEnd'] = addEvent('touchend', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					vDistance = endCoords.pageY - startCoords.pageY;
					hDistance = endCoords.pageX - startCoords.pageX;
					hDistancePercent = hDistance * 100 / winWidth;
					removeClass(body, 'touching');
					var slideHeight = activeSlide.querySelector('.gslide-inner-content').offsetHeight;
					var slideWidth = activeSlide.querySelector('.gslide-inner-content').offsetWidth;
					// Swipe to top/bottom to close
					if (vSwipe) {
						var onEnd = slideHeight / 2;
						vSwipe = false;
						if (Math.abs(vDistance) >= onEnd) {
							_this4.close();
							return;
						}
						resetSlideMove(activeSlide);
						return;
					}
					if (hSwipe) {
						hSwipe = false;
						var where = 'prev';
						var asideExist = true;
						if (hDistance < 0) {
							where = 'next';
							hDistance = Math.abs(hDistance);
						}
						if (where == 'prev' && _this4.index - 1 < 0) {
							asideExist = false;
						}
						if (where == 'next' && _this4.index + 1 >= _this4.elements.length) {
							asideExist = false;
						}
						if (asideExist && hDistance >= slideWidth / 2 - 90) {
							if (where == 'next') {
								_this4.nextSlide();
							} else {
								_this4.prevSlide();
							}
							return;
						}
						resetSlideMove(activeSlide);
					}
				}
			});
	}
	function slideCSSTransform(slide) {
		var translate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
		if (translate == '') {
			slide.style.webkitTransform = '';
			slide.style.MozTransform = '';
			slide.style.msTransform = '';
			slide.style.OTransform = '';
			slide.style.transform = '';
			return false;
		}
		slide.style.webkitTransform = translate;
		slide.style.MozTransform = translate;
		slide.style.msTransform = translate;
		slide.style.OTransform = translate;
		slide.style.transform = translate;
	}
	function resetSlideMove(slide) {
		var media = slide.querySelector('.gslide-media');
		var desc = slide.querySelector('.gslide-description');
		addClass(media, 'greset');
		slideCSSTransform(media, 'translate3d(0, 0, 0)');
		var animation = addEvent(transitionEnd, {
				onElement: media,
				once: true,
				withCallback: function withCallback(event, target) {
					removeClass(media, 'greset');
				}
			});
		media.style.opacity = '';
		if (desc) {
			desc.style.opacity = '';
		}
	}
	function slideShortDesc(string) {
		var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
		var wordBoundary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		var useWordBoundary = wordBoundary;
		string = string.trim();
		if (string.length <= n) {
			return string;
		}
		var subString = string.substr(0, n - 1);
		if (!useWordBoundary) {
			return subString;
		}
		return subString + '... <a href="#" class="desc-more">' + wordBoundary + '</a>';
	}
	function slideDescriptionEvents(desc, data) {
		var moreLink = desc.querySelector('.desc-more');
		if (!moreLink) {
			return false;
		}
		addEvent('click', {
			onElement: moreLink,
			withCallback: function withCallback(event, target) {
				event.preventDefault();
				var desc = getClosest(target, '.gslide-desc');
				if (!desc) {
					return false;
				}
				desc.innerHTML = data.description;
				addClass(body, 'gdesc-open');
				var shortEvent = addEvent('click', {
						onElement: [body, getClosest(desc, '.gslide-description')],
						withCallback: function withCallback(event, target) {
							if (event.target.nodeName.toLowerCase() !== 'a') {
								removeClass(body, 'gdesc-open');
								addClass(body, 'gdesc-closed');
								desc.innerHTML = data.smallDescription;
								slideDescriptionEvents(desc, data);
								setTimeout(function () {
									removeClass(body, 'gdesc-closed');
								}, 400);
								shortEvent.destroy();
							}
						}
					});
			}
		});
	}
	/**
	 * GLightbox Class
	 * Class and public methods
	 */
	var GlightboxInit = function () {
		function GlightboxInit(options) {
			_classCallCheck(this, GlightboxInit);
			this.settings = extend(defaults, options || {});
			this.effectsClasses = this.getAnimationClasses();
		}
		_createClass(GlightboxInit, [{
					key: 'init',
					value: function init() {
						var _this5 = this;
						this.baseEvents = addEvent('click', {
								onElement: '.' + this.settings.selector,
								withCallback: function withCallback(e, target) {
									e.preventDefault();
									_this5.open(target);
								}
							});
					}
				}, {
					key: 'open',
					value: function open() {
						var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
						this.elements = this.getElements(element);
						if (this.elements.length == 0)
							return false;
						this.activeSlide = null;
						this.prevActiveSlideIndex = null;
						this.prevActiveSlide = null;
						var index = this.settings.startAt;
						if (element) {
							// if element passed, get the index
							index = this.elements.indexOf(element);
							if (index < 0) {
								index = 0;
							}
						}
						this.build();
						animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.in);
						var bodyWidth = body.offsetWidth;
						body.style.width = bodyWidth + 'px';
						addClass(body, 'glightbox-open');
						addClass(html, 'glightbox-open');
						if (isMobile) {
							addClass(html, 'glightbox-mobile');
							this.settings.slideEffect = 'slide';
						}
						this.showSlide(index, true);
						if (this.elements.length == 1) {
							hide(this.prevButton);
							hide(this.nextButton);
						} else {
							show(this.prevButton);
							show(this.nextButton);
						}
						this.lightboxOpen = true;
						if (utils.isFunction(this.settings.onOpen)) {
							this.settings.onOpen();
						}
						if (isMobile && isTouch && this.settings.touchNavigation) {
							touchNavigation.apply(this);
							return false;
						}
						if (this.settings.keyboardNavigation) {
							keyboardNavigation.apply(this);
						}
					}
				}, {
					key: 'showSlide',
					value: function showSlide() {
						var _this6 = this;
						var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
						var first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
						show(this.loader);
						this.index = index;
						var current = this.slidesContainer.querySelector('.current');
						if (current) {
							removeClass(current, 'current');
						}
						// hide prev slide
						this.slideAnimateOut();
						var slide = this.slidesContainer.querySelectorAll('.gslide')[index];
						show(this.slidesContainer);
						// Check if slide's content is alreay loaded
						if (hasClass(slide, 'loaded')) {
							this.slideAnimateIn(slide, first);
							hide(this.loader);
						} else {
							// If not loaded add the slide content
							show(this.loader);
							// console.log("a", this.settings);
							var slide_data = getSlideData(this.elements[index], this.settings);
							// console.log(slide_data);
							slide_data.index = index;
							setSlideContent.apply(this, [slide, slide_data, function () {
										hide(_this6.loader);
										_this6.slideAnimateIn(slide, first);
									}
								]);
						}
						// Preload subsequent slides
						this.preloadSlide(index + 1);
						this.preloadSlide(index - 1);
						// Handle navigation arrows
						removeClass(this.nextButton, 'disabled');
						removeClass(this.prevButton, 'disabled');
						if (index === 0) {
							addClass(this.prevButton, 'disabled');
						} else if (index === this.elements.length - 1 && this.settings.loopAtEnd !== true) {
							addClass(this.nextButton, 'disabled');
						}
						this.activeSlide = slide;
					}
				}, {
					key: 'preloadSlide',
					value: function preloadSlide(index) {
						var _this7 = this;
						// Verify slide index, it can not be lower than 0
						// and it can not be greater than the total elements
						if (index < 0 || index > this.elements.length)
							return false;
						if (utils.isNil(this.elements[index]))
							return false;
						var slide = this.slidesContainer.querySelectorAll('.gslide')[index];
						if (hasClass(slide, 'loaded')) {
							return false;
						}
						var slide_data = getSlideData(this.elements[index], this.settings);
						slide_data.index = index;
						var type = slide_data.sourcetype;
						if (type == 'video' || type == 'external') {
							setTimeout(function () {
								setSlideContent.apply(_this7, [slide, slide_data]);
							}, 200);
						} else {
							setSlideContent.apply(this, [slide, slide_data]);
						}
					}
				}, {
					key: 'prevSlide',
					value: function prevSlide() {
						var prev = this.index - 1;
						if (prev < 0) {
							return false;
						}
						this.goToSlide(prev);
					}
				}, {
					key: 'nextSlide',
					value: function nextSlide() {
						var next = this.index + 1;
						if (next > this.elements.length)
							return false;
						this.goToSlide(next);
					}
				}, {
					key: 'goToSlide',
					value: function goToSlide() {
						var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
						if (index > -1) {
							this.prevActiveSlide = this.activeSlide;
							this.prevActiveSlideIndex = this.index;
							if (index < this.elements.length) {
								this.showSlide(index);
							} else {
								if (this.settings.loopAtEnd === true) {
									index = 0;
									this.showSlide(index);
								}
							}
						}
					}
				}, {
					key: 'slideAnimateIn',
					value: function slideAnimateIn(slide, first) {
						var _this8 = this;
						var slideMedia = slide.querySelector('.gslide-media');
						var slideDesc = slide.querySelector('.gslide-description');
						var prevData = {
							index: this.prevActiveSlideIndex,
							slide: this.prevActiveSlide
						};
						var nextData = {
							index: this.index,
							slide: this.activeSlide
						};
						if (slideMedia.offsetWidth > 0 && slideDesc) {
							hide(slideDesc);
							slide.querySelector('.ginner-container').style.maxWidth = slideMedia.offsetWidth + 'px';
							slideDesc.style.display = '';
						}
						removeClass(slide, this.effectsClasses);
						if (first) {
							animateElement(slide, this.settings.openEffect, function () {
								if (!isMobile && _this8.settings.autoplayVideos) {
									_this8.playSlideVideo(slide);
								}
								if (utils.isFunction(_this8.settings.afterSlideChange)) {
									_this8.settings.afterSlideChange.apply(_this8, [prevData, nextData]);
								}
							});
						} else {
							var effect_name = this.settings.slideEffect;
							var animIn = effect_name !== 'none' ? this.settings.cssEfects[effect_name].in : effect_name;
							if (this.prevActiveSlideIndex > this.index) {
								if (this.settings.slideEffect == 'slide') {
									animIn = this.settings.cssEfects.slide_back.in;
								}
							}
							animateElement(slide, animIn, function () {
								if (!isMobile && _this8.settings.autoplayVideos) {
									_this8.playSlideVideo(slide);
								}
								if (utils.isFunction(_this8.settings.afterSlideChange)) {
									_this8.settings.afterSlideChange.apply(_this8, [prevData, nextData]);
								}
							});
						}
						addClass(slide, 'current');
					}
				}, {
					key: 'slideAnimateOut',
					value: function slideAnimateOut() {
						if (!this.prevActiveSlide) {
							return false;
						}
						var prevSlide = this.prevActiveSlide;
						removeClass(prevSlide, this.effectsClasses);
						addClass(prevSlide, 'prev');
						var animation = this.settings.slideEffect;
						var animOut = animation !== 'none' ? this.settings.cssEfects[animation].out : animation;
						this.stopSlideVideo(prevSlide);
						if (utils.isFunction(this.settings.beforeSlideChange)) {
							this.settings.beforeSlideChange.apply(this, [{
										index: this.prevActiveSlideIndex,
										slide: this.prevActiveSlide
									}, {
										index: this.index,
										slide: this.activeSlide
									}
								]);
						}
						if (this.prevActiveSlideIndex > this.index && this.settings.slideEffect == 'slide') {
							// going back
							animOut = this.settings.cssEfects.slide_back.out;
						}
						animateElement(prevSlide, animOut, function () {
							var media = prevSlide.querySelector('.gslide-media');
							var desc = prevSlide.querySelector('.gslide-description');
							media.style.transform = '';
							removeClass(media, 'greset');
							media.style.opacity = '';
							if (desc) {
								desc.style.opacity = '';
							}
							removeClass(prevSlide, 'prev');
						});
					}
				}, {
					key: 'stopSlideVideo',
					value: function stopSlideVideo(slide) {
						if (utils.isNumber(slide)) {
							slide = this.slidesContainer.querySelectorAll('.gslide')[slide];
						}
						var slideVideo = slide ? slide.querySelector('.gvideo') : null;
						if (!slideVideo) {
							return false;
						}
						var videoID = slideVideo.id;
						if (videoPlayers && videoPlayers.hasOwnProperty(videoID)) {
							var player = videoPlayers[videoID];
							if (hasClass(slideVideo, 'vimeo-video')) {
								player.pause();
							}
							if (hasClass(slideVideo, 'youtube-video')) {
								player.pauseVideo();
							}
							if (hasClass(slideVideo, 'jw-video')) {
								player.pause(true);
							}
							if (hasClass(slideVideo, 'html5-video')) {
								player.pause();
							}
						}
					}
				}, {
					key: 'playSlideVideo',
					value: function playSlideVideo(slide) {
						if (utils.isNumber(slide)) {
							slide = this.slidesContainer.querySelectorAll('.gslide')[slide];
						}
						var slideVideo = slide.querySelector('.gvideo');
						if (!slideVideo) {
							return false;
						}
						var videoID = slideVideo.id;
						if (videoPlayers && videoPlayers.hasOwnProperty(videoID)) {
							var player = videoPlayers[videoID];
							if (hasClass(slideVideo, 'vimeo-video')) {
								player.play();
							}
							if (hasClass(slideVideo, 'youtube-video')) {
								player.playVideo();
							}
							if (hasClass(slideVideo, 'jw-video')) {
								player.play();
							}
							if (hasClass(slideVideo, 'html5-video')) {
								player.play();
							}
							setTimeout(function () {
								removeClass(slideVideo, 'wait-autoplay');
							}, 300);
							return false;
						}
					}
				}, {
					key: 'setElements',
					value: function setElements(elements) {
						this.settings.elements = elements;
					}
				}, {
					key: 'getElements',
					value: function getElements() {
						var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
						this.elements = [];
						if (!utils.isNil(this.settings.elements) && utils.isArray(this.settings.elements)) {
							return this.settings.elements;
						}
						var nodes = false;
						if (element !== null) {
							var gallery = element.getAttribute('data-gallery');
							if (gallery && gallery !== '') {
								nodes = document.querySelectorAll('[data-gallery="' + gallery + '"]');
							}
						}
						if (nodes == false) {
							nodes = document.querySelectorAll('.' + this.settings.selector);
						}
						nodes = Array.prototype.slice.call(nodes);
						return nodes;
					}
				}, {
					key: 'getActiveSlide',
					value: function getActiveSlide() {
						return this.slidesContainer.querySelectorAll('.gslide')[this.index];
					}
				}, {
					key: 'getActiveSlideIndex',
					value: function getActiveSlideIndex() {
						return this.index;
					}
				}, {
					key: 'getAnimationClasses',
					value: function getAnimationClasses() {
						var effects = [];
						for (var key in this.settings.cssEfects) {
							if (this.settings.cssEfects.hasOwnProperty(key)) {
								var effect = this.settings.cssEfects[key];
								effects.push('g' + effect.in);
								effects.push('g' + effect.out);
							}
						}
						return effects.join(' ');
					}
				}, {
					key: 'build',
					value: function build() {
						var _this9 = this;
						if (this.built) {
							return false;
						}
						var lightbox_html = createHTML(this.settings.lightboxHtml);
						document.body.appendChild(lightbox_html);
						var modal = document.getElementById('glightbox-body');
						this.modal = modal;
						var closeButton = modal.querySelector('.gclose');
						this.prevButton = modal.querySelector('.gprev');
						this.nextButton = modal.querySelector('.gnext');
						this.overlay = modal.querySelector('.goverlay');
						this.loader = modal.querySelector('.gloader');
						this.slidesContainer = document.getElementById('glightbox-slider');
						this.events = {};
						addClass(this.modal, 'glightbox-' + this.settings.skin);
						if (this.settings.closeButton && closeButton) {
							this.events['close'] = addEvent('click', {
									onElement: closeButton,
									withCallback: function withCallback(e, target) {
										e.preventDefault();
										_this9.close();
									}
								});
						}
						if (closeButton && !this.settings.closeButton) {
							closeButton.parentNode.removeChild(closeButton);
						}
						if (this.nextButton) {
							this.events['next'] = addEvent('click', {
									onElement: this.nextButton,
									withCallback: function withCallback(e, target) {
										e.preventDefault();
										_this9.nextSlide();
									}
								});
						}
						if (this.prevButton) {
							this.events['prev'] = addEvent('click', {
									onElement: this.prevButton,
									withCallback: function withCallback(e, target) {
										e.preventDefault();
										_this9.prevSlide();
									}
								});
						}
						if (this.settings.closeOnOutsideClick) {
							this.events['outClose'] = addEvent('click', {
									onElement: modal,
									withCallback: function withCallback(e, target) {
										if (!getClosest(e.target, '.ginner-container')) {
											if (!hasClass(e.target, 'gnext') && !hasClass(e.target, 'gprev')) {
												_this9.close();
											}
										}
									}
								});
						}
						each(this.elements, function () {
							var slide = createHTML(_this9.settings.slideHtml);
							_this9.slidesContainer.appendChild(slide);
						});
						if (isTouch) {
							addClass(html, 'glightbox-touch');
						}
						this.built = true;
					}
				}, {
					key: 'reload',
					value: function reload() {
						this.init();
					}
				}, {
					key: 'close',
					value: function close() {
						var _this10 = this;
						if (this.closing) {
							return false;
						}
						this.closing = true;
						this.stopSlideVideo(this.activeSlide);
						addClass(this.modal, 'glightbox-closing');
						animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.out);
						animateElement(this.activeSlide, this.settings.closeEffect, function () {
							_this10.activeSlide = null;
							_this10.prevActiveSlideIndex = null;
							_this10.prevActiveSlide = null;
							_this10.built = false;
							if (_this10.events) {
								for (var key in _this10.events) {
									if (_this10.events.hasOwnProperty(key)) {
										_this10.events[key].destroy();
									}
								}
							}
							removeClass(body, 'glightbox-open');
							removeClass(html, 'glightbox-open');
							removeClass(body, 'touching');
							removeClass(body, 'gdesc-open');
							body.style.width = '';
							_this10.modal.parentNode.removeChild(_this10.modal);
							if (utils.isFunction(_this10.settings.onClose)) {
								_this10.settings.onClose();
							}
							_this10.closing = null;
						});
					}
				}, {
					key: 'destroy',
					value: function destroy() {
						this.close();
						this.baseEvents.destroy();
					}
				}
			]);
		return GlightboxInit;
	}
	();
	module.exports = function () {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var instance = new GlightboxInit(options);
		instance.init();
		return instance;
	};
	/*jshint validthis: false */
});
/*jshint +W069 */
/*jshint esnext: false */

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

/*global define, global, module, require, self, picturefill */
/**!
 * lightgallery.js | 1.0.3 | August 8th 2018
 * http://sachinchoolur.github.io/lightgallery.js/
 * Copyright (c) 2016 Sachin N;
 * @license GPLv3
 */
(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}
		g.Lightgallery = f();
	}
})(function () {
	var define,
	module,
	exports;
	return (function () {
		function r(e, n, t) {
			function o(i, f) {
				if (!n[i]) {
					if (!e[i]) {
						var c = "function" == typeof require && require;
						if (!f && c)
							return c(i, !0);
						if (u)
							return u(i, !0);
						var a = new Error("Cannot find module '" + i + "'");
						throw (a.code = "MODULE_NOT_FOUND", a);
					}
					var p = n[i] = {
						exports: {}
					};
					e[i][0].call(p.exports, function (r) {
						var n = e[i][1][r];
						return o(n || r);
					}, p, p.exports, r, e, n, t);
				}
				return n[i].exports;
			}
			for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)
				o(t[i]);
			return o;
		}
		return r;
	})()({
		1: [function (require, module, exports) {
				(function (global, factory) {
					if (typeof define === "function" && define.amd) {
						define(['exports'], factory);
					} else if (typeof exports !== "undefined") {
						factory(exports);
					} else {
						var mod = {
							exports: {}
						};
						factory(mod.exports);
						global.lgUtils = mod.exports;
					}
				})(this, function (exports) {
					'use strict';
					Object.defineProperty(exports, "__esModule", {
						value: true
					});
					/*
					 *@todo remove function from window and document. Update on and off functions
					 */
					window.getAttribute = function (label) {
						return window[label];
					};
					window.setAttribute = function (label, value) {
						window[label] = value;
					};
					document.getAttribute = function (label) {
						return document[label];
					};
					document.setAttribute = function (label, value) {
						document[label] = value;
					};
					var utils = {
						wrap: function wrap(el, className) {
							if (!el) {
								return;
							}
							var wrapper = document.createElement('div');
							wrapper.className = className;
							el.parentNode.insertBefore(wrapper, el);
							el.parentNode.removeChild(el);
							wrapper.appendChild(el);
						},
						addClass: function addClass(el, className) {
							if (!el) {
								return;
							}
							if (el.classList) {
								el.classList.add(className);
							} else {
								el.className += ' ' + className;
							}
						},
						removeClass: function removeClass(el, className) {
							if (!el) {
								return;
							}
							if (el.classList) {
								el.classList.remove(className);
							} else {
								el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
							}
						},
						hasClass: function hasClass(el, className) {
							if (el.classList) {
								return el.classList.contains(className);
							} else {
								return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
							}
							return false;
						},
						// ex Transform
						// ex TransitionTimingFunction
						setVendor: function setVendor(el, property, value) {
							if (!el) {
								return;
							}
							el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
							el.style['webkit' + property] = value;
							el.style['moz' + property] = value;
							el.style['ms' + property] = value;
							el.style['o' + property] = value;
						},
						trigger: function trigger(el, event) {
							var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
							if (!el) {
								return;
							}
							var customEvent = new CustomEvent(event, {
									detail: detail
								});
							el.dispatchEvent(customEvent);
						},
						Listener: {
							uid: 0
						},
						on: function on(el, events, fn) {
							if (!el) {
								return;
							}
							events.split(' ').forEach(function (event) {
								var _id = el.getAttribute('lg-event-uid') || '';
								utils.Listener.uid++;
								_id += '&' + utils.Listener.uid;
								el.setAttribute('lg-event-uid', _id);
								utils.Listener[event + utils.Listener.uid] = fn;
								el.addEventListener(event.split('.')[0], fn, false);
							});
						},
						off: function off(el, event) {
							if (!el) {
								return;
							}
							var _id = el.getAttribute('lg-event-uid');
							if (_id) {
								_id = _id.split('&');
								for (var i = 0; i < _id.length; i++) {
									if (_id[i]) {
										var _event = event + _id[i];
										if (_event.substring(0, 1) === '.') {
											for (var key in utils.Listener) {
												if (utils.Listener.hasOwnProperty(key)) {
													if (key.split('.').indexOf(_event.split('.')[1]) > -1) {
														el.removeEventListener(key.split('.')[0], utils.Listener[key]);
														el.setAttribute('lg-event-uid', el.getAttribute('lg-event-uid').replace('&' + _id[i], ''));
														delete utils.Listener[key];
													}
												}
											}
										} else {
											el.removeEventListener(_event.split('.')[0], utils.Listener[_event]);
											el.setAttribute('lg-event-uid', el.getAttribute('lg-event-uid').replace('&' + _id[i], ''));
											delete utils.Listener[_event];
										}
									}
								}
							}
						},
						param: function param(obj) {
							return Object.keys(obj).map(function (k) {
								return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
							}).join('&');
						}
					};
					exports.
				default = utils;
				});
			}, {}
		],
		2: [function (require, module, exports) {
				(function (global, factory) {
					if (typeof define === "function" && define.amd) {
						define(['./lg-utils'], factory);
					} else if (typeof exports !== "undefined") {
						factory(require('./lg-utils'));
					} else {
						var mod = {
							exports: {}
						};
						factory(global.lgUtils);
						global.lightgallery = mod.exports;
					}
				})(this, function (_lgUtils) {
					'use strict';
					var _lgUtils2 = _interopRequireDefault(_lgUtils);
					function _interopRequireDefault(obj) {
						return obj && obj.__esModule ? obj : {
						default:
							obj
						};
					}
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
					/** Polyfill the CustomEvent() constructor functionality in Internet Explorer 9 and higher */
					(function () {
						if (typeof window.CustomEvent === 'function') {
							return false;
						}
						function CustomEvent(event, params) {
							params = params || {
								bubbles: false,
								cancelable: false,
								detail: undefined
							};
							var evt = document.createEvent('CustomEvent');
							evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
							return evt;
						}
						CustomEvent.prototype = window.Event.prototype;
						window.CustomEvent = CustomEvent;
					})();
					window.utils = _lgUtils2.
					default;
						window.lgData = {
							uid: 0
						};
						window.lgModules = {};
						var defaults = {
							mode: 'lg-slide',
							// Ex : 'ease'
							cssEasing: 'ease',
							//'for jquery animation'
							easing: 'linear',
							speed: 600,
							height: '100%',
							width: '100%',
							addClass: '',
							startClass: 'lg-start-zoom',
							backdropDuration: 150,
							hideBarsDelay: 6000,
							useLeft: false,
							closable: true,
							loop: true,
							escKey: true,
							keyPress: true,
							controls: true,
							slideEndAnimatoin: true,
							hideControlOnEnd: false,
							mousewheel: false,
							getCaptionFromTitleOrAlt: true,
							// .lg-item || '.lg-sub-html'
							appendSubHtmlTo: '.lg-sub-html',
							subHtmlSelectorRelative: false,
							/**
							 * @desc number of preload slides
							 * will exicute only after the current slide is fully loaded.
							 *
							 * @ex you clicked on 4th image and if preload = 1 then 3rd slide and 5th
							 * slide will be loaded in the background after the 4th slide is fully loaded..
							 * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
							 *
							 */
							preload: 1,
							showAfterLoad: true,
							selector: '',
							selectWithin: '',
							nextHtml: '',
							prevHtml: '',
							// 0, 1
							index: false,
							iframeMaxWidth: '100%',
							download: true,
							counter: true,
							appendCounterTo: '.lg-toolbar',
							swipeThreshold: 50,
							enableSwipe: true,
							enableDrag: true,
							dynamic: false,
							dynamicEl: [],
							galleryId: 1
						};
						function Plugin(element, options) {
							// Current lightGallery element
							this.el = element;
							// lightGallery settings
							this.s = _extends({}, defaults, options);
							// When using dynamic mode, ensure dynamicEl is an array
							if (this.s.dynamic && this.s.dynamicEl !== 'undefined' && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) {
								throw 'When using dynamic mode, you must also define dynamicEl as an Array.';
							}
							// lightGallery modules
							this.modules = {};
							// false when lightgallery complete first slide;
							this.lGalleryOn = false;
							this.lgBusy = false;
							// Timeout function for hiding controls;
							this.hideBartimeout = false;
							// To determine browser supports for touch events;
							this.isTouch = 'ontouchstart' in document.documentElement;
							// Disable hideControlOnEnd if sildeEndAnimation is true
							if (this.s.slideEndAnimatoin) {
								this.s.hideControlOnEnd = false;
							}
							this.items = [];
							// Gallery items
							if (this.s.dynamic) {
								this.items = this.s.dynamicEl;
							} else {
								if (this.s.selector === 'this') {
									this.items.push(this.el);
								} else if (this.s.selector !== '') {
									if (this.s.selectWithin) {
										this.items = document.querySelector(this.s.selectWithin).querySelectorAll(this.s.selector);
									} else {
										this.items = this.el.querySelectorAll(this.s.selector);
									}
								} else {
									this.items = this.el.children;
								}
							}
							// .lg-item
							this.___slide = '';
							// .lg-outer
							this.outer = '';
							this.init();
							return this;
						}
						Plugin.prototype.init = function () {
							var _this = this;
							// s.preload should not be more than $item.length
							if (_this.s.preload > _this.items.length) {
								_this.s.preload = _this.items.length;
							}
							// if dynamic option is enabled execute immediately
							var _hash = window.location.hash;
							if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {
								_this.index = parseInt(_hash.split('&slide=')[1], 10);
								_lgUtils2.
							default.addClass(document.body, 'lg-from-hash');
								if (!_lgUtils2.
								default.hasClass(document.body, 'lg-on')) {
										_lgUtils2.
									default.addClass(document.body, 'lg-on');
										setTimeout(function () {
											_this.build(_this.index);
										});
									}
							}
							if (_this.s.dynamic) {
								_lgUtils2.
							default.trigger(this.el, 'onBeforeOpen');
								_this.index = _this.s.index || 0;
								// prevent accidental double execution
								if (!_lgUtils2.
								default.hasClass(document.body, 'lg-on')) {
										_lgUtils2.
									default.addClass(document.body, 'lg-on');
										setTimeout(function () {
											_this.build(_this.index);
										});
									}
							} else {
								for (var i = 0; i < _this.items.length; i++) {
									/*jshint loopfunc: true */
									(function (index) {
										// Using different namespace for click because click event should not unbind if selector is same object('this')
										_lgUtils2.
									default.on(_this.items[index], 'click.lgcustom', function (e) {
											e.preventDefault();
											_lgUtils2.
										default.trigger(_this.el, 'onBeforeOpen');
											_this.index = _this.s.index || index;
											if (!_lgUtils2.
											default.hasClass(document.body, 'lg-on')) {
													_this.build(_this.index);
													_lgUtils2.
												default.addClass(document.body, 'lg-on');
												}
										});
									})(i);
								}
							}
						};
						Plugin.prototype.build = function (index) {
							var _this = this;
							_this.structure();
							for (var key in window.lgModules) {
								if (window.lgModules.hasOwnProperty(key)) {
									_this.modules[key] = new window.lgModules[key](_this.el);
								}
							}
							// initiate slide function
							_this.slide(index, false, false);
							if (_this.s.keyPress) {
								_this.keyPress();
							}
							if (_this.items.length > 1) {
								_this.arrow();
								setTimeout(function () {
									_this.enableDrag();
									_this.enableSwipe();
								}, 50);
								if (_this.s.mousewheel) {
									_this.mousewheel();
								}
							}
							_this.counter();
							_this.closeGallery();
							_lgUtils2.
						default.trigger(_this.el, 'onAfterOpen');
							// Hide controllers if mouse doesn't move for some period
							_lgUtils2.
						default.on(_this.outer, 'mousemove.lg click.lg touchstart.lg', function () {
								_lgUtils2.
							default.removeClass(_this.outer, 'lg-hide-items');
								clearTimeout(_this.hideBartimeout);
								// Timeout will be cleared on each slide movement also
								_this.hideBartimeout = setTimeout(function () {
										_lgUtils2.
									default.addClass(_this.outer, 'lg-hide-items');
									}, _this.s.hideBarsDelay);
							});
						};
						Plugin.prototype.structure = function () {
							var list = '';
							var controls = '';
							var i = 0;
							var subHtmlCont = '';
							var template;
							var _this = this;
							document.body.insertAdjacentHTML('beforeend', '<div class="lg-backdrop"></div>');
							_lgUtils2.
						default.setVendor(document.querySelector('.lg-backdrop'), 'TransitionDuration', this.s.backdropDuration + 'ms');
							// Create gallery items
							for (i = 0; i < this.items.length; i++) {
								list += '<div class="lg-item"></div>';
							}
							// Create controlls
							if (this.s.controls && this.items.length > 1) {
								controls = '<div class="lg-actions">' + '<div class="lg-prev lg-icon">' + this.s.prevHtml + '</div>' + '<div class="lg-next lg-icon">' + this.s.nextHtml + '</div>' + '</div>';
							}
							if (this.s.appendSubHtmlTo === '.lg-sub-html') {
								subHtmlCont = '<div class="lg-sub-html"></div>';
							}
							template = '<div class="lg-outer ' + this.s.addClass + ' ' + this.s.startClass + '">' + '<div class="lg" style="width:' + this.s.width + '; height:' + this.s.height + '">' + '<div class="lg-inner">' + list + '</div>' + '<div class="lg-toolbar group">' + '<span class="lg-close lg-icon"></span>' + '</div>' + controls + subHtmlCont + '</div>' + '</div>';
							document.body.insertAdjacentHTML('beforeend', template);
							this.outer = document.querySelector('.lg-outer');
							this.___slide = this.outer.querySelectorAll('.lg-item');
							if (this.s.useLeft) {
								_lgUtils2.
							default.addClass(this.outer, 'lg-use-left');
								// Set mode lg-slide if use left is true;
								this.s.mode = 'lg-slide';
							} else {
								_lgUtils2.
							default.addClass(this.outer, 'lg-use-css3');
							}
							// For fixed height gallery
							_this.setTop();
							_lgUtils2.
						default.on(window, 'resize.lg orientationchange.lg', function () {
								setTimeout(function () {
									_this.setTop();
								}, 100);
							});
							// add class lg-current to remove initial transition
							_lgUtils2.
						default.addClass(this.___slide[this.index], 'lg-current');
							// add Class for css support and transition mode
							if (this.doCss()) {
								_lgUtils2.
							default.addClass(this.outer, 'lg-css3');
							} else {
								_lgUtils2.
							default.addClass(this.outer, 'lg-css');
								// Set speed 0 because no animation will happen if browser doesn't support css3
								this.s.speed = 0;
							}
							_lgUtils2.
						default.addClass(this.outer, this.s.mode);
							if (this.s.enableDrag && this.items.length > 1) {
								_lgUtils2.
							default.addClass(this.outer, 'lg-grab');
							}
							if (this.s.showAfterLoad) {
								_lgUtils2.
							default.addClass(this.outer, 'lg-show-after-load');
							}
							if (this.doCss()) {
								var inner = this.outer.querySelector('.lg-inner');
								_lgUtils2.
							default.setVendor(inner, 'TransitionTimingFunction', this.s.cssEasing);
								_lgUtils2.
							default.setVendor(inner, 'TransitionDuration', this.s.speed + 'ms');
							}
							setTimeout(function () {
								_lgUtils2.
							default.addClass(document.querySelector('.lg-backdrop'), 'in');
							});
							setTimeout(function () {
								_lgUtils2.
							default.addClass(_this.outer, 'lg-visible');
							}, this.s.backdropDuration);
							if (this.s.download) {
								this.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', '<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>');
							}
							// Store the current scroll top value to scroll back after closing the gallery..
							this.prevScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
						};
						// For fixed height gallery
						Plugin.prototype.setTop = function () {
							if (this.s.height !== '100%') {
								var wH = window.innerHeight;
								var top = (wH - parseInt(this.s.height, 10)) / 2;
								var lGallery = this.outer.querySelector('.lg');
								if (wH >= parseInt(this.s.height, 10)) {
									lGallery.style.top = top + 'px';
								} else {
									lGallery.style.top = '0px';
								}
							}
						};
						// Find css3 support
						Plugin.prototype.doCss = function () {
							// check for css animation support
							var support = function support() {
								var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
								var root = document.documentElement;
								var i = 0;
								for (i = 0; i < transition.length; i++) {
									if (transition[i]in root.style) {
										return true;
									}
								}
							};
							if (support()) {
								return true;
							}
							return false;
						};
						/**
						 *  @desc Check the given src is video
						 *  @param {String} src
						 *  @return {Object} video type
						 *  Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
						 */
						Plugin.prototype.isVideo = function (src, index) {
							var html;
							if (this.s.dynamic) {
								html = this.s.dynamicEl[index].html;
							} else {
								html = this.items[index].getAttribute('data-html');
							}
							if (!src && html) {
								return {
									html5: true
								};
							}
							var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
							var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
							var dailymotion = src.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i);
							var vk = src.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);
							if (youtube) {
								return {
									youtube: youtube
								};
							} else if (vimeo) {
								return {
									vimeo: vimeo
								};
							} else if (dailymotion) {
								return {
									dailymotion: dailymotion
								};
							} else if (vk) {
								return {
									vk: vk
								};
							}
						};
						/**
						 *  @desc Create image counter
						 *  Ex: 1/10
						 */
						Plugin.prototype.counter = function () {
							if (this.s.counter) {
								this.outer.querySelector(this.s.appendCounterTo).insertAdjacentHTML('beforeend', '<div id="lg-counter"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span> / <span id="lg-counter-all">' + this.items.length + '</span></div>');
							}
						};
						/**
						 *  @desc add sub-html into the slide
						 *  @param {Number} index - index of the slide
						 */
						Plugin.prototype.addHtml = function (index) {
							var subHtml = null;
							var currentEle;
							if (this.s.dynamic) {
								subHtml = this.s.dynamicEl[index].subHtml;
							} else {
								currentEle = this.items[index];
								subHtml = currentEle.getAttribute('data-sub-html');
								if (this.s.getCaptionFromTitleOrAlt && !subHtml) {
									subHtml = currentEle.getAttribute('title');
									if (subHtml && currentEle.querySelector('img')) {
										subHtml = currentEle.querySelector('img').getAttribute('alt');
									}
								}
							}
							if (typeof subHtml !== 'undefined' && subHtml !== null) {
								// get first letter of subhtml
								// if first letter starts with . or # get the html form the jQuery object
								var fL = subHtml.substring(0, 1);
								if (fL === '.' || fL === '#') {
									if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
										subHtml = currentEle.querySelector(subHtml).innerHTML;
									} else {
										subHtml = document.querySelector(subHtml).innerHTML;
									}
								}
							} else {
								subHtml = '';
							}
							if (this.s.appendSubHtmlTo === '.lg-sub-html') {
								this.outer.querySelector(this.s.appendSubHtmlTo).innerHTML = subHtml;
							} else {
								this.___slide[index].insertAdjacentHTML('beforeend', subHtml);
							}
							// Add lg-empty-html class if title doesn't exist
							if (typeof subHtml !== 'undefined' && subHtml !== null) {
								if (subHtml === '') {
									_lgUtils2.
								default.addClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
								} else {
									_lgUtils2.
								default.removeClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
								}
							}
							_lgUtils2.
						default.trigger(this.el, 'onAfterAppendSubHtml', {
								index: index
							});
						};
						/**
						 *  @desc Preload slides
						 *  @param {Number} index - index of the slide
						 */
						Plugin.prototype.preload = function (index) {
							var i = 1;
							var j = 1;
							for (i = 1; i <= this.s.preload; i++) {
								if (i >= this.items.length - index) {
									break;
								}
								this.loadContent(index + i, false, 0);
							}
							for (j = 1; j <= this.s.preload; j++) {
								if (index - j < 0) {
									break;
								}
								this.loadContent(index - j, false, 0);
							}
						};
						/**
						 *  @desc Load slide content into slide.
						 *  @param {Number} index - index of the slide.
						 *  @param {Boolean} rec - if true call loadcontent() function again.
						 *  @param {Boolean} delay - delay for adding complete class. it is 0 except first time.
						 */
						Plugin.prototype.loadContent = function (index, rec, delay) {
							var _this = this;
							var _hasPoster = false;
							var _img;
							var _src;
							var _poster;
							var _srcset;
							var _sizes;
							var _html;
							var getResponsiveSrc = function getResponsiveSrc(srcItms) {
								var rsWidth = [];
								var rsSrc = [];
								for (var i = 0; i < srcItms.length; i++) {
									var __src = srcItms[i].split(' ');
									// Manage empty space
									if (__src[0] === '') {
										__src.splice(0, 1);
									}
									rsSrc.push(__src[0]);
									rsWidth.push(__src[1]);
								}
								var wWidth = window.innerWidth;
								for (var j = 0; j < rsWidth.length; j++) {
									if (parseInt(rsWidth[j], 10) > wWidth) {
										_src = rsSrc[j];
										break;
									}
								}
							};
							if (_this.s.dynamic) {
								if (_this.s.dynamicEl[index].poster) {
									_hasPoster = true;
									_poster = _this.s.dynamicEl[index].poster;
								}
								_html = _this.s.dynamicEl[index].html;
								_src = _this.s.dynamicEl[index].src;
								if (_this.s.dynamicEl[index].responsive) {
									var srcDyItms = _this.s.dynamicEl[index].responsive.split(',');
									getResponsiveSrc(srcDyItms);
								}
								_srcset = _this.s.dynamicEl[index].srcset;
								_sizes = _this.s.dynamicEl[index].sizes;
							} else {
								if (_this.items[index].getAttribute('data-poster')) {
									_hasPoster = true;
									_poster = _this.items[index].getAttribute('data-poster');
								}
								_html = _this.items[index].getAttribute('data-html');
								_src = _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src');
								if (_this.items[index].getAttribute('data-responsive')) {
									var srcItms = _this.items[index].getAttribute('data-responsive').split(',');
									getResponsiveSrc(srcItms);
								}
								_srcset = _this.items[index].getAttribute('data-srcset');
								_sizes = _this.items[index].getAttribute('data-sizes');
							}
							//if (_src || _srcset || _sizes || _poster) {
							var iframe = false;
							if (_this.s.dynamic) {
								if (_this.s.dynamicEl[index].iframe) {
									iframe = true;
								}
							} else {
								if (_this.items[index].getAttribute('data-iframe') === 'true') {
									iframe = true;
								}
							}
							var _isVideo = _this.isVideo(_src, index);
							if (!_lgUtils2.
							default.hasClass(_this.___slide[index], 'lg-loaded')) {
									if (iframe) {
										_this.___slide[index].insertAdjacentHTML('afterbegin', '<div class="lg-video-cont" style="max-width:' + _this.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + _src + '"  allowfullscreen="true"></iframe></div></div>');
									} else if (_hasPoster) {
										var videoClass = '';
										if (_isVideo && _isVideo.youtube) {
											videoClass = 'lg-has-youtube';
										} else if (_isVideo && _isVideo.vimeo) {
											videoClass = 'lg-has-vimeo';
										} else {
											videoClass = 'lg-has-html5';
										}
										_this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont ' + videoClass + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + _poster + '" /></div></div>');
									} else if (_isVideo) {
										_this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont "><div class="lg-video"></div></div>');
										_lgUtils2.
									default.trigger(_this.el, 'hasVideo', {
											index: index,
											src: _src,
											html: _html
										});
									} else {
										_this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-img-wrap"><img class="lg-object lg-image" src="' + _src + '" /></div>');
									}
									_lgUtils2.
								default.trigger(_this.el, 'onAferAppendSlide', {
										index: index
									});
									_img = _this.___slide[index].querySelector('.lg-object');
									if (_sizes) {
										_img.setAttribute('sizes', _sizes);
									}
									if (_srcset) {
										_img.setAttribute('srcset', _srcset);
										try {
											picturefill({
												elements: [_img[0]]
											});
										} catch (e) {
											console.error('Make sure you have included Picturefill version 2');
										}
									}
									if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
										_this.addHtml(index);
									}
									_lgUtils2.
								default.addClass(_this.___slide[index], 'lg-loaded');
								}
								_lgUtils2.
							default.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function () {
									// For first time add some delay for displaying the start animation.
									var _speed = 0;
									// Do not change the delay value because it is required for zoom plugin.
									// If gallery opened from direct url (hash) speed value should be 0
									if (delay && !_lgUtils2.
									default.hasClass(document.body, 'lg-from-hash')) {
											_speed = delay;
										}
										setTimeout(function () {
											_lgUtils2.
										default.addClass(_this.___slide[index], 'lg-complete');
											_lgUtils2.
										default.trigger(_this.el, 'onSlideItemLoad', {
												index: index,
												delay: delay || 0
											});
										}, _speed);
								});
								// @todo check load state for html5 videos
								if (_isVideo && _isVideo.html5 && !_hasPoster) {
									_lgUtils2.
								default.addClass(_this.___slide[index], 'lg-complete');
								}
								if (rec === true) {
									if (!_lgUtils2.
									default.hasClass(_this.___slide[index], 'lg-complete')) {
											_lgUtils2.
										default.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function () {
												_this.preload(index);
											});
										}
										else {
											_this.preload(index);
										}
								}
								//}
						};
						/**
						 *   @desc slide function for lightgallery
						 ** Slide() gets call on start
						 ** ** Set lg.on true once slide() function gets called.
						 ** Call loadContent() on slide() function inside setTimeout
						 ** ** On first slide we do not want any animation like slide of fade
						 ** ** So on first slide( if lg.on if false that is first slide) loadContent() should start loading immediately
						 ** ** Else loadContent() should wait for the transition to complete.
						 ** ** So set timeout s.speed + 50
						<=> ** loadContent() will load slide content in to the particular slide
						 ** ** It has recursion (rec) parameter. if rec === true loadContent() will call preload() function.
						 ** ** preload will execute only when the previous slide is fully loaded (images iframe)
						 ** ** avoid simultaneous image load
						<=> ** Preload() will check for s.preload value and call loadContent() again accoring to preload value
						 ** loadContent()  <====> Preload();
						 *   @param {Number} index - index of the slide
						 *   @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
						 *   @param {Boolean} fromThumb - true if slide function called via thumbnail click
						 */
						Plugin.prototype.slide = function (index, fromTouch, fromThumb) {
							var _prevIndex = 0;
							for (var i = 0; i < this.___slide.length; i++) {
								if (_lgUtils2.
								default.hasClass(this.___slide[i], 'lg-current')) {
										_prevIndex = i;
										break;
									}
							}
							var _this = this;
							// Prevent if multiple call
							// Required for hsh plugin
							if (_this.lGalleryOn && _prevIndex === index) {
								return;
							}
							var _length = this.___slide.length;
							var _time = _this.lGalleryOn ? this.s.speed : 0;
							var _next = false;
							var _prev = false;
							if (!_this.lgBusy) {
								if (this.s.download) {
									var _src;
									if (_this.s.dynamic) {
										_src = _this.s.dynamicEl[index].downloadUrl !== false && (_this.s.dynamicEl[index].downloadUrl || _this.s.dynamicEl[index].src);
									} else {
										_src = _this.items[index].getAttribute('data-download-url') !== 'false' && (_this.items[index].getAttribute('data-download-url') || _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src'));
									}
									if (_src) {
										document.getElementById('lg-download').setAttribute('href', _src);
										_lgUtils2.
									default.removeClass(_this.outer, 'lg-hide-download');
									} else {
										_lgUtils2.
									default.addClass(_this.outer, 'lg-hide-download');
									}
								}
								_lgUtils2.
							default.trigger(_this.el, 'onBeforeSlide', {
									prevIndex: _prevIndex,
									index: index,
									fromTouch: fromTouch,
									fromThumb: fromThumb
								});
								_this.lgBusy = true;
								clearTimeout(_this.hideBartimeout);
								// Add title if this.s.appendSubHtmlTo === lg-sub-html
								if (this.s.appendSubHtmlTo === '.lg-sub-html') {
									// wait for slide animation to complete
									setTimeout(function () {
										_this.addHtml(index);
									}, _time);
								}
								this.arrowDisable(index);
								if (!fromTouch) {
									// remove all transitions
									_lgUtils2.
								default.addClass(_this.outer, 'lg-no-trans');
									for (var j = 0; j < this.___slide.length; j++) {
										_lgUtils2.
									default.removeClass(this.___slide[j], 'lg-prev-slide');
										_lgUtils2.
									default.removeClass(this.___slide[j], 'lg-next-slide');
									}
									if (index < _prevIndex) {
										_prev = true;
										if (index === 0 && _prevIndex === _length - 1 && !fromThumb) {
											_prev = false;
											_next = true;
										}
									} else if (index > _prevIndex) {
										_next = true;
										if (index === _length - 1 && _prevIndex === 0 && !fromThumb) {
											_prev = true;
											_next = false;
										}
									}
									if (_prev) {
										//prevslide
										_lgUtils2.
									default.addClass(this.___slide[index], 'lg-prev-slide');
										_lgUtils2.
									default.addClass(this.___slide[_prevIndex], 'lg-next-slide');
									} else if (_next) {
										// next slide
										_lgUtils2.
									default.addClass(this.___slide[index], 'lg-next-slide');
										_lgUtils2.
									default.addClass(this.___slide[_prevIndex], 'lg-prev-slide');
									}
									// give 50 ms for browser to add/remove class
									setTimeout(function () {
										_lgUtils2.
									default.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');
										//_this.$slide.eq(_prevIndex).removeClass('lg-current');
										_lgUtils2.
									default.addClass(_this.___slide[index], 'lg-current');
										// reset all transitions
										_lgUtils2.
									default.removeClass(_this.outer, 'lg-no-trans');
									}, 50);
								} else {
									var touchPrev = index - 1;
									var touchNext = index + 1;
									if (index === 0 && _prevIndex === _length - 1) {
										// next slide
										touchNext = 0;
										touchPrev = _length - 1;
									} else if (index === _length - 1 && _prevIndex === 0) {
										// prev slide
										touchNext = 0;
										touchPrev = _length - 1;
									}
									_lgUtils2.
								default.removeClass(_this.outer.querySelector('.lg-prev-slide'), 'lg-prev-slide');
									_lgUtils2.
								default.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');
									_lgUtils2.
								default.removeClass(_this.outer.querySelector('.lg-next-slide'), 'lg-next-slide');
									_lgUtils2.
								default.addClass(_this.___slide[touchPrev], 'lg-prev-slide');
									_lgUtils2.
								default.addClass(_this.___slide[touchNext], 'lg-next-slide');
									_lgUtils2.
								default.addClass(_this.___slide[index], 'lg-current');
								}
								if (_this.lGalleryOn) {
									setTimeout(function () {
										_this.loadContent(index, true, 0);
									}, this.s.speed + 50);
									setTimeout(function () {
										_this.lgBusy = false;
										_lgUtils2.
									default.trigger(_this.el, 'onAfterSlide', {
											prevIndex: _prevIndex,
											index: index,
											fromTouch: fromTouch,
											fromThumb: fromThumb
										});
									}, this.s.speed);
								} else {
									_this.loadContent(index, true, _this.s.backdropDuration);
									_this.lgBusy = false;
									_lgUtils2.
								default.trigger(_this.el, 'onAfterSlide', {
										prevIndex: _prevIndex,
										index: index,
										fromTouch: fromTouch,
										fromThumb: fromThumb
									});
								}
								_this.lGalleryOn = true;
								if (this.s.counter) {
									if (document.getElementById('lg-counter-current')) {
										document.getElementById('lg-counter-current').innerHTML = index + 1;
									}
								}
							}
						};
						/**
						 *  @desc Go to next slide
						 *  @param {Boolean} fromTouch - true if slide function called via touch event
						 */
						Plugin.prototype.goToNextSlide = function (fromTouch) {
							var _this = this;
							if (!_this.lgBusy) {
								if (_this.index + 1 < _this.___slide.length) {
									_this.index++;
									_lgUtils2.
								default.trigger(_this.el, 'onBeforeNextSlide', {
										index: _this.index
									});
									_this.slide(_this.index, fromTouch, false);
								} else {
									if (_this.s.loop) {
										_this.index = 0;
										_lgUtils2.
									default.trigger(_this.el, 'onBeforeNextSlide', {
											index: _this.index
										});
										_this.slide(_this.index, fromTouch, false);
									} else if (_this.s.slideEndAnimatoin) {
										_lgUtils2.
									default.addClass(_this.outer, 'lg-right-end');
										setTimeout(function () {
											_lgUtils2.
										default.removeClass(_this.outer, 'lg-right-end');
										}, 400);
									}
								}
							}
						};
						/**
						 *  @desc Go to previous slide
						 *  @param {Boolean} fromTouch - true if slide function called via touch event
						 */
						Plugin.prototype.goToPrevSlide = function (fromTouch) {
							var _this = this;
							if (!_this.lgBusy) {
								if (_this.index > 0) {
									_this.index--;
									_lgUtils2.
								default.trigger(_this.el, 'onBeforePrevSlide', {
										index: _this.index,
										fromTouch: fromTouch
									});
									_this.slide(_this.index, fromTouch, false);
								} else {
									if (_this.s.loop) {
										_this.index = _this.items.length - 1;
										_lgUtils2.
									default.trigger(_this.el, 'onBeforePrevSlide', {
											index: _this.index,
											fromTouch: fromTouch
										});
										_this.slide(_this.index, fromTouch, false);
									} else if (_this.s.slideEndAnimatoin) {
										_lgUtils2.
									default.addClass(_this.outer, 'lg-left-end');
										setTimeout(function () {
											_lgUtils2.
										default.removeClass(_this.outer, 'lg-left-end');
										}, 400);
									}
								}
							}
						};
						Plugin.prototype.keyPress = function () {
							var _this = this;
							if (this.items.length > 1) {
								_lgUtils2.
							default.on(window, 'keyup.lg', function (e) {
									if (_this.items.length > 1) {
										if (e.keyCode === 37) {
											e.preventDefault();
											_this.goToPrevSlide();
										}
										if (e.keyCode === 39) {
											e.preventDefault();
											_this.goToNextSlide();
										}
									}
								});
							}
							_lgUtils2.
						default.on(window, 'keydown.lg', function (e) {
								if (_this.s.escKey === true && e.keyCode === 27) {
									e.preventDefault();
									if (!_lgUtils2.
									default.hasClass(_this.outer, 'lg-thumb-open')) {
											_this.destroy();
										}
										else {
											_lgUtils2.
										default.removeClass(_this.outer, 'lg-thumb-open');
										}
								}
							});
						};
						Plugin.prototype.arrow = function () {
							var _this = this;
							_lgUtils2.
						default.on(this.outer.querySelector('.lg-prev'), 'click.lg', function () {
								_this.goToPrevSlide();
							});
							_lgUtils2.
						default.on(this.outer.querySelector('.lg-next'), 'click.lg', function () {
								_this.goToNextSlide();
							});
						};
						Plugin.prototype.arrowDisable = function (index) {
							// Disable arrows if s.hideControlOnEnd is true
							if (!this.s.loop && this.s.hideControlOnEnd) {
								var next = this.outer.querySelector('.lg-next');
								var prev = this.outer.querySelector('.lg-prev');
								if (index + 1 < this.___slide.length) {
									next.removeAttribute('disabled');
									_lgUtils2.
								default.removeClass(next, 'disabled');
								} else {
									next.setAttribute('disabled', 'disabled');
									_lgUtils2.
								default.addClass(next, 'disabled');
								}
								if (index > 0) {
									prev.removeAttribute('disabled');
									_lgUtils2.
								default.removeClass(prev, 'disabled');
								} else {
									next.setAttribute('disabled', 'disabled');
									_lgUtils2.
								default.addClass(next, 'disabled');
								}
							}
						};
						Plugin.prototype.setTranslate = function (el, xValue, yValue) {
							// jQuery supports Automatic CSS prefixing since jQuery 1.8.0
							if (this.s.useLeft) {
								el.style.left = xValue;
							} else {
								_lgUtils2.
							default.setVendor(el, 'Transform', 'translate3d(' + xValue + 'px, ' + yValue + 'px, 0px)');
							}
						};
						Plugin.prototype.touchMove = function (startCoords, endCoords) {
							var distance = endCoords - startCoords;
							if (Math.abs(distance) > 15) {
								// reset opacity and transition duration
								_lgUtils2.
							default.addClass(this.outer, 'lg-dragging');
								// move current slide
								this.setTranslate(this.___slide[this.index], distance, 0);
								// move next and prev slide with current slide
								this.setTranslate(document.querySelector('.lg-prev-slide'), -this.___slide[this.index].clientWidth + distance, 0);
								this.setTranslate(document.querySelector('.lg-next-slide'), this.___slide[this.index].clientWidth + distance, 0);
							}
						};
						Plugin.prototype.touchEnd = function (distance) {
							var _this = this;
							// keep slide animation for any mode while dragg/swipe
							if (_this.s.mode !== 'lg-slide') {
								_lgUtils2.
							default.addClass(_this.outer, 'lg-slide');
							}
							for (var i = 0; i < this.___slide.length; i++) {
								if (!_lgUtils2.
								default.hasClass(this.___slide[i], 'lg-current') && !_lgUtils2.
								default.hasClass(this.___slide[i], 'lg-prev-slide') && !_lgUtils2.
								default.hasClass(this.___slide[i], 'lg-next-slide')) {
										this.___slide[i].style.opacity = '0';
									}
							}
							// set transition duration
							setTimeout(function () {
								_lgUtils2.
							default.removeClass(_this.outer, 'lg-dragging');
								if (distance < 0 && Math.abs(distance) > _this.s.swipeThreshold) {
									_this.goToNextSlide(true);
								} else if (distance > 0 && Math.abs(distance) > _this.s.swipeThreshold) {
									_this.goToPrevSlide(true);
								} else if (Math.abs(distance) < 5) {
									// Trigger click if distance is less than 5 pix
									_lgUtils2.
								default.trigger(_this.el, 'onSlideClick');
								}
								for (var i = 0; i < _this.___slide.length; i++) {
									_this.___slide[i].removeAttribute('style');
								}
							});
							// remove slide class once drag/swipe is completed if mode is not slide
							setTimeout(function () {
								if (!_lgUtils2.
								default.hasClass(_this.outer, 'lg-dragging') && _this.s.mode !== 'lg-slide') {
										_lgUtils2.
									default.removeClass(_this.outer, 'lg-slide');
									}
							}, _this.s.speed + 100);
						};
						Plugin.prototype.enableSwipe = function () {
							var _this = this;
							var startCoords = 0;
							var endCoords = 0;
							var isMoved = false;
							if (_this.s.enableSwipe && _this.isTouch && _this.doCss()) {
								for (var i = 0; i < _this.___slide.length; i++) {
									/*jshint loopfunc: true */
									_lgUtils2.
								default.on(_this.___slide[i], 'touchstart.lg', function (e) {
										if (!_lgUtils2.
										default.hasClass(_this.outer, 'lg-zoomed') && !_this.lgBusy) {
												e.preventDefault();
												_this.manageSwipeClass();
												startCoords = e.targetTouches[0].pageX;
											}
									});
								}
								for (var j = 0; j < _this.___slide.length; j++) {
									/*jshint loopfunc: true */
									_lgUtils2.
								default.on(_this.___slide[j], 'touchmove.lg', function (e) {
										if (!_lgUtils2.
										default.hasClass(_this.outer, 'lg-zoomed')) {
												e.preventDefault();
												endCoords = e.targetTouches[0].pageX;
												_this.touchMove(startCoords, endCoords);
												isMoved = true;
											}
									});
								}
								for (var k = 0; k < _this.___slide.length; k++) {
									/*jshint loopfunc: true */
									_lgUtils2.
								default.on(_this.___slide[k], 'touchend.lg', function () {
										if (!_lgUtils2.
										default.hasClass(_this.outer, 'lg-zoomed')) {
												if (isMoved) {
													isMoved = false;
													_this.touchEnd(endCoords - startCoords);
												} else {
													_lgUtils2.
												default.trigger(_this.el, 'onSlideClick');
												}
											}
									});
								}
							}
						};
						Plugin.prototype.enableDrag = function () {
							var _this = this;
							var startCoords = 0;
							var endCoords = 0;
							var isDraging = false;
							var isMoved = false;
							if (_this.s.enableDrag && !_this.isTouch && _this.doCss()) {
								for (var i = 0; i < _this.___slide.length; i++) {
									/*jshint loopfunc: true */
									_lgUtils2.
								default.on(_this.___slide[i], 'mousedown.lg', function (e) {
										// execute only on .lg-object
										if (!_lgUtils2.
										default.hasClass(_this.outer, 'lg-zoomed')) {
												if (_lgUtils2.
												default.hasClass(e.target, 'lg-object') || _lgUtils2.
												default.hasClass(e.target, 'lg-video-play')) {
														e.preventDefault();
														if (!_this.lgBusy) {
															_this.manageSwipeClass();
															startCoords = e.pageX;
															isDraging = true;
															// ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
															_this.outer.scrollLeft += 1;
															_this.outer.scrollLeft -= 1;
															// *
															_lgUtils2.
														default.removeClass(_this.outer, 'lg-grab');
															_lgUtils2.
														default.addClass(_this.outer, 'lg-grabbing');
															_lgUtils2.
														default.trigger(_this.el, 'onDragstart');
														}
													}
											}
									});
								}
								_lgUtils2.
							default.on(window, 'mousemove.lg', function (e) {
									if (isDraging) {
										isMoved = true;
										endCoords = e.pageX;
										_this.touchMove(startCoords, endCoords);
										_lgUtils2.
									default.trigger(_this.el, 'onDragmove');
									}
								});
								_lgUtils2.
							default.on(window, 'mouseup.lg', function (e) {
									if (isMoved) {
										isMoved = false;
										_this.touchEnd(endCoords - startCoords);
										_lgUtils2.
									default.trigger(_this.el, 'onDragend');
									} else if (_lgUtils2.
									default.hasClass(e.target, 'lg-object') || _lgUtils2.
									default.hasClass(e.target, 'lg-video-play')) {
											_lgUtils2.
										default.trigger(_this.el, 'onSlideClick');
										}
										// Prevent execution on click
										if (isDraging) {
											isDraging = false;
											_lgUtils2.
										default.removeClass(_this.outer, 'lg-grabbing');
											_lgUtils2.
										default.addClass(_this.outer, 'lg-grab');
										}
								});
							}
						};
						Plugin.prototype.manageSwipeClass = function () {
							var touchNext = this.index + 1;
							var touchPrev = this.index - 1;
							var length = this.___slide.length;
							if (this.s.loop) {
								if (this.index === 0) {
									touchPrev = length - 1;
								} else if (this.index === length - 1) {
									touchNext = 0;
								}
							}
							for (var i = 0; i < this.___slide.length; i++) {
								_lgUtils2.
							default.removeClass(this.___slide[i], 'lg-next-slide');
								_lgUtils2.
							default.removeClass(this.___slide[i], 'lg-prev-slide');
							}
							if (touchPrev > -1) {
								_lgUtils2.
							default.addClass(this.___slide[touchPrev], 'lg-prev-slide');
							}
							_lgUtils2.
						default.addClass(this.___slide[touchNext], 'lg-next-slide');
						};
						Plugin.prototype.mousewheel = function () {
							var _this = this;
							_lgUtils2.
						default.on(_this.outer, 'mousewheel.lg', function (e) {
								if (!e.deltaY) {
									return;
								}
								if (e.deltaY > 0) {
									_this.goToPrevSlide();
								} else {
									_this.goToNextSlide();
								}
								e.preventDefault();
							});
						};
						Plugin.prototype.closeGallery = function () {
							var _this = this;
							var mousedown = false;
							_lgUtils2.
						default.on(this.outer.querySelector('.lg-close'), 'click.lg', function () {
								_this.destroy();
							});
							if (_this.s.closable) {
								// If you drag the slide and release outside gallery gets close on chrome
								// for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
								_lgUtils2.
							default.on(_this.outer, 'mousedown.lg', function (e) {
									if (_lgUtils2.
									default.hasClass(e.target, 'lg-outer') || _lgUtils2.
									default.hasClass(e.target, 'lg-item') || _lgUtils2.
									default.hasClass(e.target, 'lg-img-wrap')) {
											mousedown = true;
										}
										else {
											mousedown = false;
										}
								});
								_lgUtils2.
							default.on(_this.outer, 'mouseup.lg', function (e) {
									if (_lgUtils2.
									default.hasClass(e.target, 'lg-outer') || _lgUtils2.
									default.hasClass(e.target, 'lg-item') || _lgUtils2.
									default.hasClass(e.target, 'lg-img-wrap') && mousedown) {
											if (!_lgUtils2.
											default.hasClass(_this.outer, 'lg-dragging')) {
													_this.destroy();
												}
										}
								});
							}
						};
						Plugin.prototype.destroy = function (d) {
							var _this = this;
							if (!d) {
								_lgUtils2.
							default.trigger(_this.el, 'onBeforeClose');
							}
							document.body.scrollTop = _this.prevScrollTop;
							document.documentElement.scrollTop = _this.prevScrollTop;
							/**
							 * if d is false or undefined destroy will only close the gallery
							 * plugins instance remains with the element
							 *
							 * if d is true destroy will completely remove the plugin
							 */
							if (d) {
								if (!_this.s.dynamic) {
									// only when not using dynamic mode is $items a jquery collection
									for (var i = 0; i < this.items.length; i++) {
										_lgUtils2.
									default.off(this.items[i], '.lg');
										_lgUtils2.
									default.off(this.items[i], '.lgcustom');
									}
								}
								var lguid = _this.el.getAttribute('lg-uid');
								delete window.lgData[lguid];
								_this.el.removeAttribute('lg-uid');
							}
							// Unbind all events added by lightGallery
							_lgUtils2.
						default.off(this.el, '.lgtm');
							// Distroy all lightGallery modules
							for (var key in window.lgModules) {
								if (_this.modules[key]) {
									_this.modules[key].destroy(d);
								}
							}
							this.lGalleryOn = false;
							clearTimeout(_this.hideBartimeout);
							this.hideBartimeout = false;
							_lgUtils2.
						default.off(window, '.lg');
							_lgUtils2.
						default.removeClass(document.body, 'lg-on');
							_lgUtils2.
						default.removeClass(document.body, 'lg-from-hash');
							if (_this.outer) {
								_lgUtils2.
							default.removeClass(_this.outer, 'lg-visible');
							}
							_lgUtils2.
						default.removeClass(document.querySelector('.lg-backdrop'), 'in');
							setTimeout(function () {
								try {
									if (_this.outer) {
										_this.outer.parentNode.removeChild(_this.outer);
									}
									if (document.querySelector('.lg-backdrop')) {
										document.querySelector('.lg-backdrop').parentNode.removeChild(document.querySelector('.lg-backdrop'));
									}
									if (!d) {
										_lgUtils2.
									default.trigger(_this.el, 'onCloseAfter');
									}
								} catch (err) {}
							}, _this.s.backdropDuration + 50);
						};
						window.lightGallery = function (el, options) {
							if (!el) {
								return;
							}
							try {
								if (!el.getAttribute('lg-uid')) {
									var uid = 'lg' + window.lgData.uid++;
									window.lgData[uid] = new Plugin(el, options);
									el.setAttribute('lg-uid', uid);
								} else {
									try {
										window.lgData[el.getAttribute('lg-uid')].init();
									} catch (err) {
										console.error('lightGallery has not initiated properly');
									}
								}
							} catch (err) {
								console.error('lightGallery has not initiated properly');
							}
						};
				});
			}, {
				"./lg-utils": 1
			}
		]
	}, {}, [2])(2);
});

/*global define, global, module, require, self, utils */
/**!
 * lg-fullscreen.js | 0.0.1 | July 25th 2016
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2016 Sachin N;
 * @license Apache 2.0
 */
(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}
		g.LgFullsceen = f();
	}
})(function () {
	var define,
	module,
	exports;
	return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;
					if (!u && a)
						return a(o, !0);
					if (i)
						return i(o, !0);
					var f = new Error("Cannot find module '" + o + "'");
					throw (f.code = "MODULE_NOT_FOUND",
					f);
				}
				var l = n[o] = {
					exports: {}
				};
				t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];
					return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}
			return n[o].exports;
		}
		var i = typeof require == "function" && require;
		for (var o = 0; o < r.length; o++)
			s(r[o]);
		return s;
	})({
		1: [function (require, module, exports) {
				(function (global, factory) {
					if (typeof define === "function" && define.amd) {
						define([], factory);
					} else if (typeof exports !== "undefined") {
						factory();
					} else {
						var mod = {
							exports: {}
						};
						factory();
						global.lgFullscreen = mod.exports;
					}
				})(this, function () {
					'use strict';
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
					var fullscreenDefaults = {
						fullScreen: true
					};
					var Fullscreen = function Fullscreen(element) {
						this.el = element;
						this.core = window.lgData[this.el.getAttribute('lg-uid')];
						this.core.s = _extends({}, fullscreenDefaults, this.core.s);
						this.init();
						return this;
					};
					Fullscreen.prototype.init = function () {
						var fullScreen = '';
						if (this.core.s.fullScreen) {
							// check for fullscreen browser support
							if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled && !document.mozFullScreenEnabled && !document.msFullscreenEnabled) {
								return;
							} else {
								fullScreen = '<span class="lg-fullscreen lg-icon"></span>';
								this.core.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', fullScreen);
								this.fullScreen();
							}
						}
					};
					Fullscreen.prototype.requestFullscreen = function () {
						var el = document.documentElement;
						if (el.requestFullscreen) {
							el.requestFullscreen();
						} else if (el.msRequestFullscreen) {
							el.msRequestFullscreen();
						} else if (el.mozRequestFullScreen) {
							el.mozRequestFullScreen();
						} else if (el.webkitRequestFullscreen) {
							el.webkitRequestFullscreen();
						}
					};
					Fullscreen.prototype.exitFullscreen = function () {
						if (document.exitFullscreen) {
							document.exitFullscreen();
						} else if (document.msExitFullscreen) {
							document.msExitFullscreen();
						} else if (document.mozCancelFullScreen) {
							document.mozCancelFullScreen();
						} else if (document.webkitExitFullscreen) {
							document.webkitExitFullscreen();
						}
					};
					// https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
					Fullscreen.prototype.fullScreen = function () {
						var _this = this;
						utils.on(document, 'fullscreenchange.lgfullscreen webkitfullscreenchange.lgfullscreen mozfullscreenchange.lgfullscreen MSFullscreenChange.lgfullscreen', function () {
							if (utils.hasClass(_this.core.outer, 'lg-fullscreen-on')) {
								utils.removeClass(_this.core.outer, 'lg-fullscreen-on');
							} else {
								utils.addClass(_this.core.outer, 'lg-fullscreen-on');
							}
						});
						utils.on(this.core.outer.querySelector('.lg-fullscreen'), 'click.lg', function () {
							if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
								_this.requestFullscreen();
							} else {
								_this.exitFullscreen();
							}
						});
					};
					Fullscreen.prototype.destroy = function () {
						// exit from fullscreen if activated
						this.exitFullscreen();
						utils.off(document, '.lgfullscreen');
					};
					window.lgModules.fullscreen = Fullscreen;
				});
			}, {}
		]
	}, {}, [1])(1);
});

/*global define, global, module, require, self, utils */
/**!
 * lg-thumbnail.js | 0.0.4 | August 9th 2016
 * http://sachinchoolur.github.io/lg-thumbnail.js
 * Copyright (c) 2016 Sachin N;
 * @license Apache 2.0
 */
(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}
		g.LgThumbnail = f();
	}
})(function () {
	var define,
	module,
	exports;
	return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;
					if (!u && a)
						return a(o, !0);
					if (i)
						return i(o, !0);
					var f = new Error("Cannot find module '" + o + "'");
					throw (f.code = "MODULE_NOT_FOUND",
					f);
				}
				var l = n[o] = {
					exports: {}
				};
				t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];
					return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}
			return n[o].exports;
		}
		var i = typeof require == "function" && require;
		for (var o = 0; o < r.length; o++)
			s(r[o]);
		return s;
	})({
		1: [function (require, module, exports) {
				(function (global, factory) {
					if (typeof define === "function" && define.amd) {
						define([], factory);
					} else if (typeof exports !== "undefined") {
						factory();
					} else {
						var mod = {
							exports: {}
						};
						factory();
						global.lgThumbnail = mod.exports;
					}
				})(this, function () {
					'use strict';
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
					var thumbnailDefaults = {
						thumbnail: true,
						animateThumb: true,
						currentPagerPosition: 'middle',
						thumbWidth: 100,
						thumbContHeight: 100,
						thumbMargin: 5,
						exThumbImage: false,
						showThumbByDefault: true,
						toggleThumb: true,
						pullCaptionUp: true,
						enableThumbDrag: true,
						enableThumbSwipe: true,
						swipeThreshold: 50,
						loadYoutubeThumbnail: true,
						youtubeThumbSize: 1,
						loadVimeoThumbnail: true,
						vimeoThumbSize: 'thumbnail_small',
						loadDailymotionThumbnail: true
					};
					var Thumbnail = function Thumbnail(element) {
						this.el = element;
						this.core = window.lgData[this.el.getAttribute('lg-uid')];
						this.core.s = _extends({}, thumbnailDefaults, this.core.s);
						this.thumbOuter = null;
						this.thumbOuterWidth = 0;
						this.thumbTotalWidth = this.core.items.length * (this.core.s.thumbWidth + this.core.s.thumbMargin);
						this.thumbIndex = this.core.index;
						// Thumbnail animation value
						this.left = 0;
						this.init();
						return this;
					};
					Thumbnail.prototype.init = function () {
						var _this = this;
						if (this.core.s.thumbnail && this.core.items.length > 1) {
							if (this.core.s.showThumbByDefault) {
								setTimeout(function () {
									utils.addClass(_this.core.outer, 'lg-thumb-open');
								}, 700);
							}
							if (this.core.s.pullCaptionUp) {
								utils.addClass(this.core.outer, 'lg-pull-caption-up');
							}
							this.build();
							if (this.core.s.animateThumb) {
								if (this.core.s.enableThumbDrag && !this.core.isTouch && this.core.doCss()) {
									this.enableThumbDrag();
								}
								if (this.core.s.enableThumbSwipe && this.core.isTouch && this.core.doCss()) {
									this.enableThumbSwipe();
								}
								this.thumbClickable = false;
							} else {
								this.thumbClickable = true;
							}
							this.toggle();
							this.thumbkeyPress();
						}
					};
					Thumbnail.prototype.build = function () {
						var _this = this;
						var thumbList = '';
						var vimeoErrorThumbSize = '';
						var $thumb;
						var html = '<div class="lg-thumb-outer">' + '<div class="lg-thumb group">' + '</div>' + '</div>';
						switch (this.core.s.vimeoThumbSize) {
						case 'thumbnail_large':
							vimeoErrorThumbSize = '640';
							break;
						case 'thumbnail_medium':
							vimeoErrorThumbSize = '200x150';
							break;
						case 'thumbnail_small':
							vimeoErrorThumbSize = '100x75';
						}
						utils.addClass(_this.core.outer, 'lg-has-thumb');
						_this.core.outer.querySelector('.lg').insertAdjacentHTML('beforeend', html);
						_this.thumbOuter = _this.core.outer.querySelector('.lg-thumb-outer');
						_this.thumbOuterWidth = _this.thumbOuter.offsetWidth;
						if (_this.core.s.animateThumb) {
							_this.core.outer.querySelector('.lg-thumb').style.width = _this.thumbTotalWidth + 'px';
							_this.core.outer.querySelector('.lg-thumb').style.position = 'relative';
						}
						if (this.core.s.animateThumb) {
							_this.thumbOuter.style.height = _this.core.s.thumbContHeight + 'px';
						}
						function getThumb(src, thumb, index) {
							var isVideo = _this.core.isVideo(src, index) || {};
							var thumbImg;
							var vimeoId = '';
							if (isVideo.youtube || isVideo.vimeo || isVideo.dailymotion) {
								if (isVideo.youtube) {
									if (_this.core.s.loadYoutubeThumbnail) {
										thumbImg = '//img.youtube.com/vi/' + isVideo.youtube[1] + '/' + _this.core.s.youtubeThumbSize + '.jpg';
									} else {
										thumbImg = thumb;
									}
								} else if (isVideo.vimeo) {
									if (_this.core.s.loadVimeoThumbnail) {
										thumbImg = '//i.vimeocdn.com/video/error_' + vimeoErrorThumbSize + '.jpg';
										vimeoId = isVideo.vimeo[1];
									} else {
										thumbImg = thumb;
									}
								} else if (isVideo.dailymotion) {
									if (_this.core.s.loadDailymotionThumbnail) {
										thumbImg = '//www.dailymotion.com/thumbnail/video/' + isVideo.dailymotion[1];
									} else {
										thumbImg = thumb;
									}
								}
							} else {
								thumbImg = thumb;
							}
							thumbList += '<div data-vimeo-id="' + vimeoId + '" class="lg-thumb-item" style="width:' + _this.core.s.thumbWidth + 'px; margin-right: ' + _this.core.s.thumbMargin + 'px"><img src="' + thumbImg + '" /></div>';
							vimeoId = '';
						}
						if (_this.core.s.dynamic) {
							for (var j = 0; j < _this.core.s.dynamicEl.length; j++) {
								getThumb(_this.core.s.dynamicEl[j].src, _this.core.s.dynamicEl[j].thumb, j);
							}
						} else {
							for (var i = 0; i < _this.core.items.length; i++) {
								if (!_this.core.s.exThumbImage) {
									getThumb(_this.core.items[i].getAttribute('href') || _this.core.items[i].getAttribute('data-src'), _this.core.items[i].querySelector('img').getAttribute('src'), i);
								} else {
									getThumb(_this.core.items[i].getAttribute('href') || _this.core.items[i].getAttribute('data-src'), _this.core.items[i].getAttribute(_this.core.s.exThumbImage), i);
								}
							}
						}
						_this.core.outer.querySelector('.lg-thumb').innerHTML = thumbList;
						$thumb = _this.core.outer.querySelectorAll('.lg-thumb-item');
						for (var n = 0; n < $thumb.length; n++) {
							/*jshint loopfunc: true */
							(function (index) {
								var $this = $thumb[index];
								var vimeoVideoId = $this.getAttribute('data-vimeo-id');
								if (vimeoVideoId) {
									window['lgJsonP' + _this.el.getAttribute('lg-uid') + '' + n] = function (content) {
										$this.querySelector('img').setAttribute('src', content[0][_this.core.s.vimeoThumbSize]);
									};
									var script = document.createElement('script');
									script.className = 'lg-script';
									script.src = '//www.vimeo.com/api/v2/video/' + vimeoVideoId + '.json?callback=lgJsonP' + _this.el.getAttribute('lg-uid') + '' + n;
									document.body.appendChild(script);
								}
							})(n);
						}
						// manage active class for thumbnail
						utils.addClass($thumb[_this.core.index], 'active');
						utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
							for (var j = 0; j < $thumb.length; j++) {
								utils.removeClass($thumb[j], 'active');
							}
							utils.addClass($thumb[_this.core.index], 'active');
						});
						for (var k = 0; k < $thumb.length; k++) {
							/*jshint loopfunc: true */
							(function (index) {
								utils.on($thumb[index], 'click.lg touchend.lg', function () {
									setTimeout(function () {
										// In IE9 and bellow touch does not support
										// Go to slide if browser does not support css transitions
										if (_this.thumbClickable && !_this.core.lgBusy || !_this.core.doCss()) {
											_this.core.index = index;
											_this.core.slide(_this.core.index, false, true);
										}
									}, 50);
								});
							})(k);
						}
						utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
							_this.animateThumb(_this.core.index);
						});
						utils.on(window, 'resize.lgthumb orientationchange.lgthumb', function () {
							setTimeout(function () {
								_this.animateThumb(_this.core.index);
								_this.thumbOuterWidth = _this.thumbOuter.offsetWidth;
							}, 200);
						});
					};
					Thumbnail.prototype.setTranslate = function (value) {
						utils.setVendor(this.core.outer.querySelector('.lg-thumb'), 'Transform', 'translate3d(-' + value + 'px, 0px, 0px)');
					};
					Thumbnail.prototype.animateThumb = function (index) {
						var $thumb = this.core.outer.querySelector('.lg-thumb');
						if (this.core.s.animateThumb) {
							var position;
							switch (this.core.s.currentPagerPosition) {
							case 'left':
								position = 0;
								break;
							case 'middle':
								position = this.thumbOuterWidth / 2 - this.core.s.thumbWidth / 2;
								break;
							case 'right':
								position = this.thumbOuterWidth - this.core.s.thumbWidth;
							}
							this.left = (this.core.s.thumbWidth + this.core.s.thumbMargin) * index - 1 - position;
							if (this.left > this.thumbTotalWidth - this.thumbOuterWidth) {
								this.left = this.thumbTotalWidth - this.thumbOuterWidth;
							}
							if (this.left < 0) {
								this.left = 0;
							}
							if (this.core.lGalleryOn) {
								if (!utils.hasClass($thumb, 'on')) {
									utils.setVendor(this.core.outer.querySelector('.lg-thumb'), 'TransitionDuration', this.core.s.speed + 'ms');
								}
								if (!this.core.doCss()) {
									$thumb.style.left = -this.left + 'px';
								}
							} else {
								if (!this.core.doCss()) {
									$thumb.style.left = -this.left + 'px';
								}
							}
							this.setTranslate(this.left);
						}
					};
					// Enable thumbnail dragging and swiping
					Thumbnail.prototype.enableThumbDrag = function () {
						var _this = this;
						var startCoords = 0;
						var endCoords = 0;
						var isDraging = false;
						var isMoved = false;
						var tempLeft = 0;
						utils.addClass(_this.thumbOuter, 'lg-grab');
						utils.on(_this.core.outer.querySelector('.lg-thumb'), 'mousedown.lgthumb', function (e) {
							if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
								// execute only on .lg-object
								e.preventDefault();
								startCoords = e.pageX;
								isDraging = true;
								// ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
								_this.core.outer.scrollLeft += 1;
								_this.core.outer.scrollLeft -= 1;
								// *
								_this.thumbClickable = false;
								utils.removeClass(_this.thumbOuter, 'lg-grab');
								utils.addClass(_this.thumbOuter, 'lg-grabbing');
							}
						});
						utils.on(window, 'mousemove.lgthumb', function (e) {
							if (isDraging) {
								tempLeft = _this.left;
								isMoved = true;
								endCoords = e.pageX;
								utils.addClass(_this.thumbOuter, 'lg-dragging');
								tempLeft = tempLeft - (endCoords - startCoords);
								if (tempLeft > _this.thumbTotalWidth - _this.thumbOuterWidth) {
									tempLeft = _this.thumbTotalWidth - _this.thumbOuterWidth;
								}
								if (tempLeft < 0) {
									tempLeft = 0;
								}
								// move current slide
								_this.setTranslate(tempLeft);
							}
						});
						utils.on(window, 'mouseup.lgthumb', function () {
							if (isMoved) {
								isMoved = false;
								utils.removeClass(_this.thumbOuter, 'lg-dragging');
								_this.left = tempLeft;
								if (Math.abs(endCoords - startCoords) < _this.core.s.swipeThreshold) {
									_this.thumbClickable = true;
								}
							} else {
								_this.thumbClickable = true;
							}
							if (isDraging) {
								isDraging = false;
								utils.removeClass(_this.thumbOuter, 'lg-grabbing');
								utils.addClass(_this.thumbOuter, 'lg-grab');
							}
						});
					};
					Thumbnail.prototype.enableThumbSwipe = function () {
						var _this = this;
						var startCoords = 0;
						var endCoords = 0;
						var isMoved = false;
						var tempLeft = 0;
						utils.on(_this.core.outer.querySelector('.lg-thumb'), 'touchstart.lg', function (e) {
							if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
								e.preventDefault();
								startCoords = e.targetTouches[0].pageX;
								_this.thumbClickable = false;
							}
						});
						utils.on(_this.core.outer.querySelector('.lg-thumb'), 'touchmove.lg', function (e) {
							if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
								e.preventDefault();
								endCoords = e.targetTouches[0].pageX;
								isMoved = true;
								utils.addClass(_this.thumbOuter, 'lg-dragging');
								tempLeft = _this.left;
								tempLeft = tempLeft - (endCoords - startCoords);
								if (tempLeft > _this.thumbTotalWidth - _this.thumbOuterWidth) {
									tempLeft = _this.thumbTotalWidth - _this.thumbOuterWidth;
								}
								if (tempLeft < 0) {
									tempLeft = 0;
								}
								// move current slide
								_this.setTranslate(tempLeft);
							}
						});
						utils.on(_this.core.outer.querySelector('.lg-thumb'), 'touchend.lg', function () {
							if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
								if (isMoved) {
									isMoved = false;
									utils.removeClass(_this.thumbOuter, 'lg-dragging');
									if (Math.abs(endCoords - startCoords) < _this.core.s.swipeThreshold) {
										_this.thumbClickable = true;
									}
									_this.left = tempLeft;
								} else {
									_this.thumbClickable = true;
								}
							} else {
								_this.thumbClickable = true;
							}
						});
					};
					Thumbnail.prototype.toggle = function () {
						var _this = this;
						if (_this.core.s.toggleThumb) {
							utils.addClass(_this.core.outer, 'lg-can-toggle');
							_this.thumbOuter.insertAdjacentHTML('beforeend', '<span class="lg-toggle-thumb lg-icon"></span>');
							utils.on(_this.core.outer.querySelector('.lg-toggle-thumb'), 'click.lg', function () {
								if (utils.hasClass(_this.core.outer, 'lg-thumb-open')) {
									utils.removeClass(_this.core.outer, 'lg-thumb-open');
								} else {
									utils.addClass(_this.core.outer, 'lg-thumb-open');
								}
							});
						}
					};
					Thumbnail.prototype.thumbkeyPress = function () {
						var _this = this;
						utils.on(window, 'keydown.lgthumb', function (e) {
							if (e.keyCode === 38) {
								e.preventDefault();
								utils.addClass(_this.core.outer, 'lg-thumb-open');
							} else if (e.keyCode === 40) {
								e.preventDefault();
								utils.removeClass(_this.core.outer, 'lg-thumb-open');
							}
						});
					};
					Thumbnail.prototype.destroy = function () {
						if (this.core.s.thumbnail && this.core.items.length > 1) {
							utils.off(window, '.lgthumb');
							//https://github.com/sachinchoolur/lightgallery.js/issues/43#issuecomment-441119589
							if (this.thumbOuter.parentNode) {
								this.thumbOuter.parentNode.removeChild(this.thumbOuter);
							}
							//this.thumbOuter.parentNode.removeChild(this.thumbOuter);
							utils.removeClass(this.core.outer, 'lg-has-thumb');
							var lgScript = document.getElementsByClassName('lg-script');
							while (lgScript[0]) {
								lgScript[0].parentNode.removeChild(lgScript[0]);
							}
						}
					};
					window.lgModules.thumbnail = Thumbnail;
				});
			}, {}
		]
	}, {}, [1])(1);
});

/*global define, global, module, require, self, utils */
/**!
 * lg-zoom.js | 1.0.1 | December 22nd 2016
 * http://sachinchoolur.github.io/lg-zoom.js
 * Copyright (c) 2016 Sachin N;
 * @license GPLv3
 */
(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}
		g.LgZoom = f();
	}
})(function () {
	var define,
	module,
	exports;
	return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;
					if (!u && a)
						return a(o, !0);
					if (i)
						return i(o, !0);
					var f = new Error("Cannot find module '" + o + "'");
					throw (f.code = "MODULE_NOT_FOUND",
					f);
				}
				var l = n[o] = {
					exports: {}
				};
				t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];
					return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}
			return n[o].exports;
		}
		var i = typeof require == "function" && require;
		for (var o = 0; o < r.length; o++)
			s(r[o]);
		return s;
	})({
		1: [function (require, module, exports) {
				(function (global, factory) {
					if (typeof define === "function" && define.amd) {
						define([], factory);
					} else if (typeof exports !== "undefined") {
						factory();
					} else {
						var mod = {
							exports: {}
						};
						factory();
						global.lgZoom = mod.exports;
					}
				})(this, function () {
					'use strict';
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
					var getUseLeft = function getUseLeft() {
						var useLeft = false;
						var isChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
						if (isChrome && parseInt(isChrome[2], 10) < 54) {
							useLeft = true;
						}
						return useLeft;
					};
					var zoomDefaults = {
						scale: 1,
						zoom: true,
						actualSize: true,
						enableZoomAfter: 300,
						useLeftForZoom: getUseLeft()
					};
					var Zoom = function Zoom(element) {
						this.el = element;
						this.core = window.lgData[this.el.getAttribute('lg-uid')];
						this.core.s = _extends({}, zoomDefaults, this.core.s);
						if (this.core.s.zoom && this.core.doCss()) {
							this.init();
							// Store the zoomable timeout value just to clear it while closing
							this.zoomabletimeout = false;
							// Set the initial value center
							this.pageX = window.innerWidth / 2;
							this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
						}
						return this;
					};
					Zoom.prototype.init = function () {
						var _this = this;
						var zoomIcons = '<span id="lg-zoom-in" class="lg-icon"></span><span id="lg-zoom-out" class="lg-icon"></span>';
						if (_this.core.s.actualSize) {
							zoomIcons += '<span id="lg-actual-size" class="lg-icon"></span>';
						}
						if (_this.core.s.useLeftForZoom) {
							utils.addClass(_this.core.outer, 'lg-use-left-for-zoom');
						} else {
							utils.addClass(_this.core.outer, 'lg-use-transition-for-zoom');
						}
						this.core.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', zoomIcons);
						// Add zoomable class
						utils.on(_this.core.el, 'onSlideItemLoad.lgtmzoom', function (event) {
							// delay will be 0 except first time
							var _speed = _this.core.s.enableZoomAfter + event.detail.delay;
							// set _speed value 0 if gallery opened from direct url and if it is first slide
							if (utils.hasClass(document.body, 'lg-from-hash') && event.detail.delay) {
								// will execute only once
								_speed = 0;
							} else {
								// Remove lg-from-hash to enable starting animation.
								utils.removeClass(document.body, 'lg-from-hash');
							}
							_this.zoomabletimeout = setTimeout(function () {
									utils.addClass(_this.core.___slide[event.detail.index], 'lg-zoomable');
								}, _speed + 30);
						});
						var scale = 1;
						/**
						 * @desc Image zoom
						 * Translate the wrap and scale the image to get better user experience
						 *
						 * @param {String} scaleVal - Zoom decrement/increment value
						 */
						var zoom = function zoom(scaleVal) {
							var image = _this.core.outer.querySelector('.lg-current .lg-image');
							var _x;
							var _y;
							// Find offset manually to avoid issue after zoom
							var offsetX = (window.innerWidth - image.clientWidth) / 2;
							var offsetY = (window.innerHeight - image.clientHeight) / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
							_x = _this.pageX - offsetX;
							_y = _this.pageY - offsetY;
							var x = (scaleVal - 1) * _x;
							var y = (scaleVal - 1) * _y;
							utils.setVendor(image, 'Transform', 'scale3d(' + scaleVal + ', ' + scaleVal + ', 1)');
							image.setAttribute('data-scale', scaleVal);
							if (_this.core.s.useLeftForZoom) {
								image.parentElement.style.left = -x + 'px';
								image.parentElement.style.top = -y + 'px';
							} else {
								utils.setVendor(image.parentElement, 'Transform', 'translate3d(-' + x + 'px, -' + y + 'px, 0)');
							}
							image.parentElement.setAttribute('data-x', x);
							image.parentElement.setAttribute('data-y', y);
						};
						var callScale = function callScale() {
							if (scale > 1) {
								utils.addClass(_this.core.outer, 'lg-zoomed');
							} else {
								_this.resetZoom();
							}
							if (scale < 1) {
								scale = 1;
							}
							zoom(scale);
						};
						var actualSize = function actualSize(event, image, index, fromIcon) {
							var w = image.clientWidth;
							var nw;
							if (_this.core.s.dynamic) {
								nw = _this.core.s.dynamicEl[index].width || image.naturalWidth || w;
							} else {
								nw = _this.core.items[index].getAttribute('data-width') || image.naturalWidth || w;
							}
							var _scale;
							if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
								scale = 1;
							} else {
								if (nw > w) {
									_scale = nw / w;
									scale = _scale || 2;
								}
							}
							if (fromIcon) {
								_this.pageX = window.innerWidth / 2;
								_this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
							} else {
								_this.pageX = event.pageX || event.targetTouches[0].pageX;
								_this.pageY = event.pageY || event.targetTouches[0].pageY;
							}
							callScale();
							setTimeout(function () {
								utils.removeClass(_this.core.outer, 'lg-grabbing');
								utils.addClass(_this.core.outer, 'lg-grab');
							}, 10);
						};
						var tapped = false;
						// event triggered after appending slide content
						utils.on(_this.core.el, 'onAferAppendSlide.lgtmzoom', function (event) {
							var index = event.detail.index;
							// Get the current element
							var image = _this.core.___slide[index].querySelector('.lg-image');
							if (!_this.core.isTouch) {
								utils.on(image, 'dblclick', function (event) {
									actualSize(event, image, index);
								});
							}
							if (_this.core.isTouch) {
								utils.on(image, 'touchstart', function (event) {
									if (!tapped) {
										tapped = setTimeout(function () {
												tapped = null;
											}, 300);
									} else {
										clearTimeout(tapped);
										tapped = null;
										actualSize(event, image, index);
									}
									event.preventDefault();
								});
							}
						});
						// Update zoom on resize and orientationchange
						utils.on(window, 'resize.lgzoom scroll.lgzoom orientationchange.lgzoom', function () {
							_this.pageX = window.innerWidth / 2;
							_this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
							zoom(scale);
						});
						utils.on(document.getElementById('lg-zoom-out'), 'click.lg', function () {
							if (_this.core.outer.querySelector('.lg-current .lg-image')) {
								scale -= _this.core.s.scale;
								callScale();
							}
						});
						utils.on(document.getElementById('lg-zoom-in'), 'click.lg', function () {
							if (_this.core.outer.querySelector('.lg-current .lg-image')) {
								scale += _this.core.s.scale;
								callScale();
							}
						});
						utils.on(document.getElementById('lg-actual-size'), 'click.lg', function (event) {
							actualSize(event, _this.core.___slide[_this.core.index].querySelector('.lg-image'), _this.core.index, true);
						});
						// Reset zoom on slide change
						utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
							scale = 1;
							_this.resetZoom();
						});
						// Drag option after zoom
						if (!_this.core.isTouch) {
							_this.zoomDrag();
						}
						if (_this.core.isTouch) {
							_this.zoomSwipe();
						}
					};
					// Reset zoom effect
					Zoom.prototype.resetZoom = function () {
						utils.removeClass(this.core.outer, 'lg-zoomed');
						for (var i = 0; i < this.core.___slide.length; i++) {
							if (this.core.___slide[i].querySelector('.lg-img-wrap')) {
								this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('style');
								this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('data-x');
								this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('data-y');
							}
						}
						for (var j = 0; j < this.core.___slide.length; j++) {
							if (this.core.___slide[j].querySelector('.lg-image')) {
								this.core.___slide[j].querySelector('.lg-image').removeAttribute('style');
								this.core.___slide[j].querySelector('.lg-image').removeAttribute('data-scale');
							}
						}
						// Reset pagx pagy values to center
						this.pageX = window.innerWidth / 2;
						this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
					};
					Zoom.prototype.zoomSwipe = function () {
						var _this = this;
						var startCoords = {};
						var endCoords = {};
						var isMoved = false;
						// Allow x direction drag
						var allowX = false;
						// Allow Y direction drag
						var allowY = false;
						for (var i = 0; i < _this.core.___slide.length; i++) {
							/*jshint loopfunc: true */
							utils.on(_this.core.___slide[i], 'touchstart.lg', function (e) {
								if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
									var image = _this.core.___slide[_this.core.index].querySelector('.lg-object');
									allowY = image.offsetHeight * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientHeight;
									allowX = image.offsetWidth * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientWidth;
									if (allowX || allowY) {
										e.preventDefault();
										startCoords = {
											x: e.targetTouches[0].pageX,
											y: e.targetTouches[0].pageY
										};
									}
								}
							});
						}
						for (var j = 0; j < _this.core.___slide.length; j++) {
							/*jshint loopfunc: true */
							utils.on(_this.core.___slide[j], 'touchmove.lg', function (e) {
								if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
									var _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
									var distanceX;
									var distanceY;
									e.preventDefault();
									isMoved = true;
									endCoords = {
										x: e.targetTouches[0].pageX,
										y: e.targetTouches[0].pageY
									};
									// reset opacity and transition duration
									utils.addClass(_this.core.outer, 'lg-zoom-dragging');
									if (allowY) {
										distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y);
									} else {
										distanceY = -Math.abs(_el.getAttribute('data-y'));
									}
									if (allowX) {
										distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x);
									} else {
										distanceX = -Math.abs(_el.getAttribute('data-x'));
									}
									if (Math.abs(endCoords.x - startCoords.x) > 15 || Math.abs(endCoords.y - startCoords.y) > 15) {
										if (_this.core.s.useLeftForZoom) {
											_el.style.left = distanceX + 'px';
											_el.style.top = distanceY + 'px';
										} else {
											utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
										}
									}
								}
							});
						}
						for (var k = 0; k < _this.core.___slide.length; k++) {
							/*jshint loopfunc: true */
							utils.on(_this.core.___slide[k], 'touchend.lg', function () {
								if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
									if (isMoved) {
										isMoved = false;
										utils.removeClass(_this.core.outer, 'lg-zoom-dragging');
										_this.touchendZoom(startCoords, endCoords, allowX, allowY);
									}
								}
							});
						}
					};
					Zoom.prototype.zoomDrag = function () {
						var _this = this;
						var startCoords = {};
						var endCoords = {};
						var isDraging = false;
						var isMoved = false;
						// Allow x direction drag
						var allowX = false;
						// Allow Y direction drag
						var allowY = false;
						for (var i = 0; i < _this.core.___slide.length; i++) {
							/*jshint loopfunc: true */
							utils.on(_this.core.___slide[i], 'mousedown.lgzoom', function (e) {
								// execute only on .lg-object
								var image = _this.core.___slide[_this.core.index].querySelector('.lg-object');
								allowY = image.offsetHeight * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientHeight;
								allowX = image.offsetWidth * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientWidth;
								if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
									if (utils.hasClass(e.target, 'lg-object') && (allowX || allowY)) {
										e.preventDefault();
										startCoords = {
											x: e.pageX,
											y: e.pageY
										};
										isDraging = true;
										// ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
										_this.core.outer.scrollLeft += 1;
										_this.core.outer.scrollLeft -= 1;
										utils.removeClass(_this.core.outer, 'lg-grab');
										utils.addClass(_this.core.outer, 'lg-grabbing');
									}
								}
							});
						}
						utils.on(window, 'mousemove.lgzoom', function (e) {
							if (isDraging) {
								var _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
								var distanceX;
								var distanceY;
								isMoved = true;
								endCoords = {
									x: e.pageX,
									y: e.pageY
								};
								// reset opacity and transition duration
								utils.addClass(_this.core.outer, 'lg-zoom-dragging');
								if (allowY) {
									distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y);
								} else {
									distanceY = -Math.abs(_el.getAttribute('data-y'));
								}
								if (allowX) {
									distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x);
								} else {
									distanceX = -Math.abs(_el.getAttribute('data-x'));
								}
								if (_this.core.s.useLeftForZoom) {
									_el.style.left = distanceX + 'px';
									_el.style.top = distanceY + 'px';
								} else {
									utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
								}
							}
						});
						utils.on(window, 'mouseup.lgzoom', function (e) {
							if (isDraging) {
								isDraging = false;
								utils.removeClass(_this.core.outer, 'lg-zoom-dragging');
								// Fix for chrome mouse move on click
								if (isMoved && (startCoords.x !== endCoords.x || startCoords.y !== endCoords.y)) {
									endCoords = {
										x: e.pageX,
										y: e.pageY
									};
									_this.touchendZoom(startCoords, endCoords, allowX, allowY);
								}
								isMoved = false;
							}
							utils.removeClass(_this.core.outer, 'lg-grabbing');
							utils.addClass(_this.core.outer, 'lg-grab');
						});
					};
					Zoom.prototype.touchendZoom = function (startCoords, endCoords, allowX, allowY) {
						var _this = this;
						var _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
						var image = _this.core.___slide[_this.core.index].querySelector('.lg-object');
						var distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x);
						var distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y);
						var minY = (_this.core.outer.querySelector('.lg').clientHeight - image.offsetHeight) / 2;
						var maxY = Math.abs(image.offsetHeight * Math.abs(image.getAttribute('data-scale')) - _this.core.outer.querySelector('.lg').clientHeight + minY);
						var minX = (_this.core.outer.querySelector('.lg').clientWidth - image.offsetWidth) / 2;
						var maxX = Math.abs(image.offsetWidth * Math.abs(image.getAttribute('data-scale')) - _this.core.outer.querySelector('.lg').clientWidth + minX);
						if (Math.abs(endCoords.x - startCoords.x) > 15 || Math.abs(endCoords.y - startCoords.y) > 15) {
							if (allowY) {
								if (distanceY <= -maxY) {
									distanceY = -maxY;
								} else if (distanceY >= -minY) {
									distanceY = -minY;
								}
							}
							if (allowX) {
								if (distanceX <= -maxX) {
									distanceX = -maxX;
								} else if (distanceX >= -minX) {
									distanceX = -minX;
								}
							}
							if (allowY) {
								_el.setAttribute('data-y', Math.abs(distanceY));
							} else {
								distanceY = -Math.abs(_el.getAttribute('data-y'));
							}
							if (allowX) {
								_el.setAttribute('data-x', Math.abs(distanceX));
							} else {
								distanceX = -Math.abs(_el.getAttribute('data-x'));
							}
							if (_this.core.s.useLeftForZoom) {
								_el.style.left = distanceX + 'px';
								_el.style.top = distanceY + 'px';
							} else {
								utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
							}
						}
					};
					Zoom.prototype.destroy = function () {
						var _this = this;
						// Unbind all events added by lightGallery zoom plugin
						utils.off(_this.core.el, '.lgzoom');
						utils.off(window, '.lgzoom');
						for (var i = 0; i < _this.core.___slide.length; i++) {
							utils.off(_this.core.___slide[i], '.lgzoom');
						}
						utils.off(_this.core.el, '.lgtmzoom');
						_this.resetZoom();
						clearTimeout(_this.zoomabletimeout);
						_this.zoomabletimeout = false;
					};
					window.lgModules.zoom = Zoom;
				});
			}, {}
		]
	}, {}, [1])(1);
});

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
      /* UWP.main = document.getElementsByClassName("uwp-header")[0] || ""; */

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
(function(){var e;e=function(){function e(e){this.o=null!=e?e:{},window.isAnyResizeEventInited||(this.vars(),this.redefineProto())}return e.prototype.vars=function(){return window.isAnyResizeEventInited=!0,this.allowedProtos=[HTMLDivElement,HTMLFormElement,HTMLLinkElement,HTMLBodyElement,HTMLParagraphElement,HTMLFieldSetElement,HTMLLegendElement,HTMLLabelElement,HTMLButtonElement,HTMLUListElement,HTMLOListElement,HTMLLIElement,HTMLHeadingElement,HTMLQuoteElement,HTMLPreElement,HTMLBRElement,HTMLFontElement,HTMLHRElement,HTMLModElement,HTMLParamElement,HTMLMapElement,HTMLTableElement,HTMLTableCaptionElement,HTMLImageElement,HTMLTableCellElement,HTMLSelectElement,HTMLInputElement,HTMLTextAreaElement,HTMLAnchorElement,HTMLObjectElement,HTMLTableColElement,HTMLTableSectionElement,HTMLTableRowElement],this.timerElements={img:1,textarea:1,input:1,embed:1,object:1,svg:1,canvas:1,tr:1,tbody:1,thead:1,tfoot:1,a:1,select:1,option:1,optgroup:1,dl:1,dt:1,br:1,basefont:1,font:1,col:1,iframe:1}},e.prototype.redefineProto=function(){var e,t,n,o;return t=this,o=function(){var o,i,r,a;for(r=this.allowedProtos,a=[],e=o=0,i=r.length;i>o;e=++o)n=r[e],null!=n.prototype&&a.push(function(e){var n,o;return n=e.prototype.addEventListener||e.prototype.attachEvent,function(n){var o;return o=function(){var e;return(this!==window||this!==document)&&(e="onresize"===arguments[0]&&!this.isAnyResizeEventInited,e&&t.handleResize({args:arguments,that:this})),n.apply(this,arguments)},e.prototype.addEventListener?e.prototype.addEventListener=o:e.prototype.attachEvent?e.prototype.attachEvent=o:void 0}(n),o=e.prototype.removeEventListener||e.prototype.detachEvent,function(t){var n;return n=function(){return this.isAnyResizeEventInited=!1,this.iframe&&this.removeChild(this.iframe),t.apply(this,arguments)},e.prototype.removeEventListener?e.prototype.removeEventListener=n:e.prototype.detachEvent?e.prototype.detachEvent=wrappedListener:void 0}(o)}(n));return a}.call(this)},e.prototype.handleResize=function(e){var t,n,o,i,r,a;return n=e.that,this.timerElements[n.tagName.toLowerCase()]?this.initTimer(n):(o=document.createElement("iframe"),n.appendChild(o),o.style.width="100%",o.style.height="100%",o.style.position="absolute",o.style.zIndex=-999,o.style.opacity=0,o.style.top=0,o.style.left=0,t=window.getComputedStyle?getComputedStyle(n):n.currentStyle,r="static"===t.position&&""===n.style.position,i=""===t.position&&""===n.style.position,(r||i)&&(n.style.position="relative"),null!=(a=o.contentWindow)&&(a.onresize=function(e){return function(){return e.dispatchEvent(n)}}(this)),n.iframe=o),n.isAnyResizeEventInited=!0},e.prototype.initTimer=function(e){var t,n;return n=0,t=0,this.interval=setInterval(function(o){return function(){var i,r;return r=e.offsetWidth,i=e.offsetHeight,r!==n||i!==t?(o.dispatchEvent(e),n=r,t=i):void 0}}(this),this.o.interval||200)},e.prototype.dispatchEvent=function(e){var t;return document.createEvent?(t=document.createEvent("HTMLEvents"),t.initEvent("onresize",!1,!1),e.dispatchEvent(t)):document.createEventObject?(t=document.createEventObject(),e.fireEvent("onresize",t)):!1},e.prototype.destroy=function(){var e,t,n,o,i,r,a;for(clearInterval(this.interval),this.interval=null,window.isAnyResizeEventInited=!1,t=this,r=this.allowedProtos,a=[],e=o=0,i=r.length;i>o;e=++o)n=r[e],null!=n.prototype&&a.push(function(e){var t;return t=e.prototype.addEventListener||e.prototype.attachEvent,e.prototype.addEventListener?e.prototype.addEventListener=Element.prototype.addEventListener:e.prototype.attachEvent&&(e.prototype.attachEvent=Element.prototype.attachEvent),e.prototype.removeEventListener?e.prototype.removeEventListener=Element.prototype.removeEventListener:e.prototype.detachEvent?e.prototype.detachEvent=Element.prototype.detachEvent:void 0}(n));return a},e}(),"function"==typeof define&&define.amd?define("any-resize-event",[],function(){return new e}):"object"==typeof module&&"object"==typeof module.exports?module.exports=new e:("undefined"!=typeof window&&null!==window&&(window.AnyResizeEvent=e),"undefined"!=typeof window&&null!==window&&(window.anyResizeEvent=new e))}).call(this);
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):t.Macy=n()}(this,function(){"use strict";function t(t,n){var e=void 0;return function(){e&&clearTimeout(e),e=setTimeout(t,n)}}function n(t,n){for(var e=t.length,o=e,r=[];e--;)r.push(n(t[o-e-1]));return r}function e(t,n){A(t,n,arguments.length>2&&void 0!==arguments[2]&&arguments[2])}function o(t){for(var n=t.options,e=t.responsiveOptions,o=t.keys,r=t.docWidth,i=void 0,s=0;s<o.length;s++){var a=parseInt(o[s],10);r>=a&&(i=n.breakAt[a],O(i,e))}return e}function r(t){for(var n=t.options,e=t.responsiveOptions,o=t.keys,r=t.docWidth,i=void 0,s=o.length-1;s>=0;s--){var a=parseInt(o[s],10);r<=a&&(i=n.breakAt[a],O(i,e))}return e}function i(t){var n=document.body.clientWidth,e={columns:t.columns};L(t.margin)?e.margin={x:t.margin.x,y:t.margin.y}:e.margin={x:t.margin,y:t.margin};var i=Object.keys(t.breakAt);return t.mobileFirst?o({options:t,responsiveOptions:e,keys:i,docWidth:n}):r({options:t,responsiveOptions:e,keys:i,docWidth:n})}function s(t){return i(t).columns}function a(t){return i(t).margin}function c(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],e=s(t),o=a(t).x,r=100/e;return n?1===e?"100%":(o=(e-1)*o/e,"calc("+r+"% - "+o+"px)"):r}function u(t,n){var e=s(t.options),o=0,r=void 0,i=void 0;return 1===++n?0:(i=a(t.options).x,r=(i-(e-1)*i/e)*(n-1),o+=c(t.options,!1)*(n-1),"calc("+o+"% + "+r+"px)")}function l(t){var n=0,e=t.container;m(t.rows,function(t){n=t>n?t:n}),e.style.height=n+"px"}function p(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r=s(t.options),i=a(t.options).y;C(t,r,e),m(n,function(n){var e=0,r=parseInt(n.offsetHeight,10);isNaN(r)||(t.rows.forEach(function(n,o){n<t.rows[e]&&(e=o)}),n.style.position="absolute",n.style.top=t.rows[e]+"px",n.style.left=""+t.cols[e],t.rows[e]+=isNaN(r)?0:r+i,o&&(n.dataset.macyComplete=1))}),o&&(t.tmpRows=null),l(t)}function h(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r=s(t.options),i=a(t.options).y;C(t,r,e),m(n,function(n){t.lastcol===r&&(t.lastcol=0);var e=M(n,"height");e=parseInt(n.offsetHeight,10),isNaN(e)||(n.style.position="absolute",n.style.top=t.rows[t.lastcol]+"px",n.style.left=""+t.cols[t.lastcol],t.rows[t.lastcol]+=isNaN(e)?0:e+i,t.lastcol+=1,o&&(n.dataset.macyComplete=1))}),o&&(t.tmpRows=null),l(t)}var f=function t(n,e){if(!(this instanceof t))return new t(n,e);if(n=n.replace(/^\s*/,"").replace(/\s*$/,""),e)return this.byCss(n,e);for(var o in this.selectors)if(e=o.split("/"),new RegExp(e[1],e[2]).test(n))return this.selectors[o](n);return this.byCss(n)};f.prototype.byCss=function(t,n){return(n||document).querySelectorAll(t)},f.prototype.selectors={},f.prototype.selectors[/^\.[\w\-]+$/]=function(t){return document.getElementsByClassName(t.substring(1))},f.prototype.selectors[/^\w+$/]=function(t){return document.getElementsByTagName(t)},f.prototype.selectors[/^\#[\w\-]+$/]=function(t){return document.getElementById(t.substring(1))};var m=function(t,n){for(var e=t.length,o=e;e--;)n(t[o-e-1])},v=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.running=!1,this.events=[],this.add(t)};v.prototype.run=function(){if(!this.running&&this.events.length>0){var t=this.events.shift();this.running=!0,t(),this.running=!1,this.run()}},v.prototype.add=function(){var t=this,n=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return!!n&&(Array.isArray(n)?m(n,function(n){return t.add(n)}):(this.events.push(n),void this.run()))},v.prototype.clear=function(){this.events=[]};var d=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.instance=t,this.data=n,this},g=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.events={},this.instance=t};g.prototype.on=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return!(!t||!n)&&(Array.isArray(this.events[t])||(this.events[t]=[]),this.events[t].push(n))},g.prototype.emit=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!t||!Array.isArray(this.events[t]))return!1;var e=new d(this.instance,n);m(this.events[t],function(t){return t(e)})};var y=function(t){return!("naturalHeight"in t&&t.naturalHeight+t.naturalWidth===0)||t.width+t.height!==0},E=function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return new Promise(function(t,e){if(n.complete)return y(n)?t(n):e(n);n.addEventListener("load",function(){return y(n)?t(n):e(n)}),n.addEventListener("error",function(){return e(n)})}).then(function(n){e&&t.emit(t.constants.EVENT_IMAGE_LOAD,{img:n})}).catch(function(n){return t.emit(t.constants.EVENT_IMAGE_ERROR,{img:n})})},w=function(t,e){var o=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return n(e,function(n){return E(t,n,o)})},A=function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return Promise.all(w(t,n,e)).then(function(){t.emit(t.constants.EVENT_IMAGE_COMPLETE)})},I=function(n){return t(function(){n.emit(n.constants.EVENT_RESIZE),n.queue.add(function(){return n.recalculate(!0,!0)})},100)},N=function(t){if(t.container=f(t.options.container),t.container instanceof f||!t.container)return!!t.options.debug&&console.error("Error: Container not found");delete t.options.container,t.container.length&&(t.container=t.container[0]),t.container.style.position="relative"},T=function(t){t.queue=new v,t.events=new g(t),t.rows=[],t.resizer=I(t)},b=function(t){var n=f("img",t.container);window.addEventListener("resize",t.resizer),t.on(t.constants.EVENT_IMAGE_LOAD,function(){return t.recalculate(!1,!1)}),t.on(t.constants.EVENT_IMAGE_COMPLETE,function(){return t.recalculate(!0,!0)}),t.options.useOwnImageLoader||e(t,n,!t.options.waitForImages),t.emit(t.constants.EVENT_INITIALIZED)},_=function(t){N(t),T(t),b(t)},L=function(t){return t===Object(t)&&"[object Array]"!==Object.prototype.toString.call(t)},O=function(t,n){L(t)||(n.columns=t),L(t)&&t.columns&&(n.columns=t.columns),L(t)&&t.margin&&!L(t.margin)&&(n.margin={x:t.margin,y:t.margin}),L(t)&&t.margin&&L(t.margin)&&t.margin.x&&(n.margin.x=t.margin.x),L(t)&&t.margin&&L(t.margin)&&t.margin.y&&(n.margin.y=t.margin.y)},M=function(t,n){return window.getComputedStyle(t,null).getPropertyValue(n)},C=function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(t.lastcol||(t.lastcol=0),t.rows.length<1&&(e=!0),e){t.rows=[],t.cols=[],t.lastcol=0;for(var o=n-1;o>=0;o--)t.rows[o]=0,t.cols[o]=u(t,o)}else if(t.tmpRows){t.rows=[];for(var o=n-1;o>=0;o--)t.rows[o]=t.tmpRows[o]}else{t.tmpRows=[];for(var o=n-1;o>=0;o--)t.tmpRows[o]=t.rows[o]}},V=function(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],e=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],o=n?t.container.children:f(':scope > *:not([data-macy-complete="1"])',t.container),r=c(t.options);return m(o,function(t){n&&(t.dataset.macyComplete=0),t.style.width=r}),t.options.trueOrder?(h(t,o,n,e),t.emit(t.constants.EVENT_RECALCULATED)):(p(t,o,n,e),t.emit(t.constants.EVENT_RECALCULATED))},R=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}return t},x={columns:4,margin:2,trueOrder:!1,waitForImages:!1,useImageLoader:!0,breakAt:{},useOwnImageLoader:!1,onInit:!1};!function(){try{document.createElement("a").querySelector(":scope *")}catch(t){!function(){function t(t){return function(e){if(e&&n.test(e)){var o=this.getAttribute("id");o||(this.id="q"+Math.floor(9e6*Math.random())+1e6),arguments[0]=e.replace(n,"#"+this.id);var r=t.apply(this,arguments);return null===o?this.removeAttribute("id"):o||(this.id=o),r}return t.apply(this,arguments)}}var n=/:scope\b/gi,e=t(Element.prototype.querySelector);Element.prototype.querySelector=function(t){return e.apply(this,arguments)};var o=t(Element.prototype.querySelectorAll);Element.prototype.querySelectorAll=function(t){return o.apply(this,arguments)}}()}}();var q=function t(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:x;if(!(this instanceof t))return new t(n);this.options={},R(this.options,x,n),_(this)};return q.init=function(t){return console.warn("Depreciated: Macy.init will be removed in v3.0.0 opt to use Macy directly like so Macy({ /*options here*/ }) "),new q(t)},q.prototype.recalculateOnImageLoad=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return e(this,f("img",this.container),!t)},q.prototype.runOnImageLoad=function(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=f("img",this.container);return this.on(this.constants.EVENT_IMAGE_COMPLETE,t),n&&this.on(this.constants.EVENT_IMAGE_LOAD,t),e(this,o,n)},q.prototype.recalculate=function(){var t=this,n=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return e&&this.queue.clear(),this.queue.add(function(){return V(t,n,e)})},q.prototype.remove=function(){window.removeEventListener("resize",this.resizer),m(this.container.children,function(t){t.removeAttribute("data-macy-complete"),t.removeAttribute("style")}),this.container.removeAttribute("style")},q.prototype.reInit=function(){this.recalculate(!0,!0),this.emit(this.constants.EVENT_INITIALIZED),window.addEventListener("resize",this.resizer),this.container.style.position="relative"},q.prototype.on=function(t,n){this.events.on(t,n)},q.prototype.emit=function(t,n){this.events.emit(t,n)},q.constants={EVENT_INITIALIZED:"macy.initialized",EVENT_RECALCULATED:"macy.recalculated",EVENT_IMAGE_LOAD:"macy.image.load",EVENT_IMAGE_ERROR:"macy.image.error",EVENT_IMAGE_COMPLETE:"macy.images.complete",EVENT_RESIZE:"macy.resize"},q.prototype.constants=q.constants,q});
