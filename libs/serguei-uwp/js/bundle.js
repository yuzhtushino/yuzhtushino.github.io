function _typeof(obj) {
	if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
		_typeof = function _typeof(obj) {
			return typeof obj;
		};
	} else {
		_typeof = function _typeof(obj) {
			return obj &&
				typeof Symbol === "function" &&
				obj.constructor === Symbol &&
				obj !== Symbol.prototype
				? "symbol"
				: typeof obj;
		};
	}
	return _typeof(obj);
}

/*jslint browser: true */

/*jslint node: true */

/*global AdaptiveCards, console, debounce, doesFontExist, getHTTP, isElectron,
isNwjs, loadJsCss, addClass, hasClass, removeClass, Macy, openDeviceBrowser,
parseLink, progressBar, require, runHome, runWorks, runPictures, runGallery,
runAbout, throttle, $readMoreJS*/

/*property console, join, split */

/*!
 * safe way to handle console.log
 * @see {@link https://github.com/paulmillr/console-polyfill}
 */
(function(root) {
	"use strict";

	if (!root.console) {
		root.console = {};
	}

	var con = root.console;
	var prop;
	var method;

	var dummy = function dummy() {};

	var properties = ["memory"];
	var methods = [
		"assert,clear,count,debug,dir,dirxml,error,exception,group,",
		"groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,",
		"show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn"
	];
	methods.join("").split(",");

	for (; (prop = properties.pop()); ) {
		if (!con[prop]) {
			con[prop] = {};
		}
	}

	for (; (method = methods.pop()); ) {
		if (!con[method]) {
			con[method] = dummy;
		}
	}

	prop = method = dummy = properties = methods = null;
})("undefined" !== typeof window ? window : this);
/*!
 * class list wrapper
 */

(function(root, document) {
	"use strict";

	var classList = "classList";
	var hasClass;
	var addClass;
	var removeClass;

	if ("classList" in document.documentElement) {
		hasClass = function hasClass(el, className) {
			return el[classList].contains(className);
		};

		addClass = function addClass(el, className) {
			el[classList].add(className);
		};

		removeClass = function removeClass(el, className) {
			el[classList].remove(className);
		};
	} else {
		hasClass = function hasClass(el, className) {
			return new RegExp("\\b" + className + "\\b").test(el.className);
		};

		addClass = function addClass(el, className) {
			if (!hasClass(el, className)) {
				el.className += " " + className;
			}
		};

		removeClass = function removeClass(el, className) {
			el.className = el.className.replace(
				new RegExp("\\b" + className + "\\b", "g"),
				""
			);
		};
	}

	var toggleClass = function toggleClass(el, className) {
		if (hasClass(el, className)) {
			removeClass(el, className);
		} else {
			addClass(el, className);
		}
	};

	root.hasClass = hasClass;
	root.addClass = addClass;
	root.removeClass = removeClass;
	root.toggleClass = toggleClass;
})("undefined" !== typeof window ? window : this, document);
/*!
 * modified loadExt
 * @see {@link https://gist.github.com/englishextra/ff9dc7ab002312568742861cb80865c9}
 * passes jshint
 */

(function(root, document) {
	"use strict";

	var loadJsCss = function loadJsCss(files, callback, type) {
		var _this = this;

		var appendChild = "appendChild";
		var body = "body";
		var createElement = "createElement";
		var getElementsByTagName = "getElementsByTagName";
		var setAttribute = "setAttribute";
		var _length = "length";
		_this.files = files;
		_this.js = [];
		_this.head = document[getElementsByTagName]("head")[0] || "";
		_this.body = document[body] || "";
		_this.ref = document[getElementsByTagName]("script")[0] || "";

		_this.callback = callback || function() {};

		_this.type = type ? type.toLowerCase() : "";

		_this.loadStyle = function(file) {
			var link = document[createElement]("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = file;
			link.media = "only x";

			link.onload = function() {
				this.onload = null;
				this.media = "all";
			};

			link[setAttribute]("property", "stylesheet");
			/* _this.head[appendChild](link); */

			(_this.body || _this.head)[appendChild](link);
		};

		_this.loadScript = function(i) {
			var script = document[createElement]("script");
			script.type = "text/javascript";
			script.async = true;
			script.src = _this.js[i];

			var loadNextScript = function loadNextScript() {
				if (++i < _this.js[_length]) {
					_this.loadScript(i);
				} else {
					_this.callback();
				}
			};

			script.onload = function() {
				loadNextScript();
			};

			_this.head[appendChild](script);
			/* if (_this.ref[parentNode]) {
      	_this.ref[parentNode][insertBefore](script, _this.ref);
      } else {
      	(_this.body || _this.head)[appendChild](script);
      } */

			(_this.body || _this.head)[appendChild](script);
		};

		var i, l;

		for (i = 0, l = _this.files[_length]; i < l; i += 1) {
			if (/\.js$|\.js\?/.test(_this.files[i]) || _this.type === "js") {
				_this.js.push(_this.files[i]);
			}

			if (
				/\.css$|\.css\?|\/css\?/.test(_this.files[i]) ||
				_this.type === "css"
			) {
				_this.loadStyle(_this.files[i]);
			}
		}

		i = l = null;

		if (_this.js[_length] > 0) {
			_this.loadScript(0);
		} else {
			_this.callback();
		}
	};

	root.loadJsCss = loadJsCss;
})("undefined" !== typeof window ? window : this, document);
/*!
 * throttle
 */

(function(root) {
	"use strict";

	var throttle = function throttle(func, wait) {
		var ctx;
		var args;
		var rtn;
		var timeoutID;
		var last = 0;

		function call() {
			timeoutID = 0;
			last = +new Date();
			rtn = func.apply(ctx, args);
			ctx = null;
			args = null;
		}

		return function throttled() {
			ctx = this;
			args = arguments;
			var delta = new Date() - last;

			if (!timeoutID) {
				if (delta >= wait) {
					call();
				} else {
					timeoutID = setTimeout(call, wait - delta);
				}
			}

			return rtn;
		};
	};

	root.throttle = throttle;
})("undefined" !== typeof window ? window : this);
/*!
 * debounce
 */

(function(root) {
	"use strict";

	var debounce = function debounce(func, wait) {
		var timeout;
		var args;
		var context;
		var timestamp;
		return function() {
			context = this;
			args = [].slice.call(arguments, 0);
			timestamp = new Date();

			var later = function later() {
				var last = new Date() - timestamp;

				if (last < wait) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					func.apply(context, args);
				}
			};

			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
		};
	};

	root.debounce = debounce;
})("undefined" !== typeof window ? window : this);
/*!
 * isNodejs isElectron isNwjs;
 */

(function(root) {
	"use strict";

	var isNodejs =
		("undefined" !== typeof process && "undefined" !== typeof require) ||
		"";

	var isElectron = (function() {
		if (
			typeof root !== "undefined" &&
			_typeof(root.process) === "object" &&
			root.process.type === "renderer"
		) {
			return true;
		}

		if (
			typeof root !== "undefined" &&
			typeof root.process !== "undefined" &&
			_typeof(root.process.versions) === "object" &&
			!!root.process.versions.electron
		) {
			return true;
		}

		if (
			(typeof navigator === "undefined"
				? "undefined"
				: _typeof(navigator)) === "object" &&
			typeof navigator.userAgent === "string" &&
			navigator.userAgent.indexOf("Electron") >= 0
		) {
			return true;
		}

		return false;
	})();

	var isNwjs = (function() {
		if ("undefined" !== typeof isNodejs && isNodejs) {
			try {
				if ("undefined" !== typeof require("nw.gui")) {
					return true;
				}
			} catch (e) {
				return false;
			}
		}

		return false;
	})();

	root.isNodejs = isNodejs;
	root.isElectron = isElectron;
	root.isNwjs = isNwjs;
})("undefined" !== typeof window ? window : this);
/*!
 * openDeviceBrowser
 */

(function(root) {
	"use strict";

	var openDeviceBrowser = function openDeviceBrowser(url) {
		var onElectron = function onElectron() {
			var es = isElectron ? require("electron").shell : "";
			return es ? es.openExternal(url) : "";
		};

		var onNwjs = function onNwjs() {
			var ns = isNwjs ? require("nw.gui").Shell : "";
			return ns ? ns.openExternal(url) : "";
		};

		var onLocal = function onLocal() {
			return root.open(url, "_system", "scrollbars=1,location=no");
		};

		if (isElectron) {
			onElectron();
		} else if (isNwjs) {
			onNwjs();
		} else {
			var locProtocol = root.location.protocol || "",
				hasHTTP = locProtocol
					? "http:" === locProtocol
						? "http"
						: "https:" === locProtocol
						? "https"
						: ""
					: "";

			if (hasHTTP) {
				return true;
			} else {
				onLocal();
			}
		}
	};

	root.openDeviceBrowser = openDeviceBrowser;
})("undefined" !== typeof window ? window : this);
/*!
 * getHTTP
 */

(function(root) {
	"use strict";

	var getHTTP = function getHTTP(force) {
		var any = force || "";
		var locProtocol = root.location.protocol || "";
		return "http:" === locProtocol
			? "http"
			: "https:" === locProtocol
			? "https"
			: any
			? "http"
			: "";
	};

	root.getHTTP = getHTTP;
})("undefined" !== typeof window ? window : this);
/*!
 * parseLink
 */

(function(root, document) {
	"use strict";

	var createElement = "createElement";
	/*jshint bitwise: false */

	var parseLink = function parseLink(url, full) {
		var _full = full || "";

		return (function() {
			var _replace = function _replace(s) {
				return s.replace(/^(#|\?)/, "").replace(/\:$/, "");
			};

			var _location = location || "";

			var _protocol = function _protocol(protocol) {
				switch (protocol) {
					case "http:":
						return _full ? ":" + 80 : 80;

					case "https:":
						return _full ? ":" + 443 : 443;

					default:
						return _full ? ":" + _location.port : _location.port;
				}
			};

			var _isAbsolute = 0 === url.indexOf("//") || !!~url.indexOf("://");

			var _locationHref = root.location || "";

			var _origin = function _origin() {
				var o =
					_locationHref.protocol +
					"//" +
					_locationHref.hostname +
					(_locationHref.port ? ":" + _locationHref.port : "");
				return o || "";
			};

			var _isCrossDomain = function _isCrossDomain() {
				var c = document[createElement]("a");
				c.href = url;
				var v =
					c.protocol +
					"//" +
					c.hostname +
					(c.port ? ":" + c.port : "");
				return v !== _origin();
			};

			var _link = document[createElement]("a");

			_link.href = url;
			return {
				href: _link.href,
				origin: _origin(),
				host: _link.host || _location.host,
				port:
					"0" === _link.port || "" === _link.port
						? _protocol(_link.protocol)
						: _full
						? _link.port
						: _replace(_link.port),
				hash: _full ? _link.hash : _replace(_link.hash),
				hostname: _link.hostname || _location.hostname,
				pathname:
					_link.pathname.charAt(0) !== "/"
						? _full
							? "/" + _link.pathname
							: _link.pathname
						: _full
						? _link.pathname
						: _link.pathname.slice(1),
				protocol:
					!_link.protocol || ":" === _link.protocol
						? _full
							? _location.protocol
							: _replace(_location.protocol)
						: _full
						? _link.protocol
						: _replace(_link.protocol),
				search: _full ? _link.search : _replace(_link.search),
				query: _full ? _link.search : _replace(_link.search),
				isAbsolute: _isAbsolute,
				isRelative: !_isAbsolute,
				isCrossDomain: _isCrossDomain(),
				hasHTTP: /^(http|https):\/\//i.test(url) ? true : false
			};
		})();
	};
	/*jshint bitwise: true */

	root.parseLink = parseLink;
})("undefined" !== typeof window ? window : this, document);
/*!
 * scroll2Top
 */

(function(root, document) {
	"use strict";

	var docElem = document.documentElement || "";

	var scroll2Top = function scroll2Top(scrollTargetY, speed, easing) {
		var scrollY = root.scrollY || docElem.scrollTop;
		var posY = scrollTargetY || 0;
		var rate = speed || 2000;
		var soothing = easing || "easeOutSine";
		var currentTime = 0;
		var time = Math.max(
			0.1,
			Math.min(Math.abs(scrollY - posY) / rate, 0.8)
		);
		var easingEquations = {
			easeOutSine: function easeOutSine(pos) {
				return Math.sin(pos * (Math.PI / 2));
			},
			easeInOutSine: function easeInOutSine(pos) {
				return -0.5 * (Math.cos(Math.PI * pos) - 1);
			},
			easeInOutQuint: function easeInOutQuint(pos) {
				if ((pos /= 0.5) < 1) {
					return 0.5 * Math.pow(pos, 5);
				}

				return 0.5 * (Math.pow(pos - 2, 5) + 2);
			}
		};

		function tick() {
			currentTime += 1 / 60;
			var p = currentTime / time;
			var t = easingEquations[soothing](p);

			if (p < 1) {
				requestAnimationFrame(tick);
				root.scrollTo(0, scrollY + (posY - scrollY) * t);
			} else {
				root.scrollTo(0, posY);
			}
		}

		tick();
	};

	root.scroll2Top = scroll2Top;
})("undefined" !== typeof window ? window : this, document);
/*!
 * manageExternalLinkAll
 */

(function(root, document) {
	"use strict";

	var getAttribute = "getAttribute";
	var getElementsByTagName = "getElementsByTagName";
	var _addEventListener = "addEventListener";
	var _length = "length";

	var manageExternalLinkAll = function manageExternalLinkAll() {
		var link = document[getElementsByTagName]("a") || "";

		var handle = function handle(url, ev) {
			ev.stopPropagation();
			ev.preventDefault();

			var logic = function logic() {
				openDeviceBrowser(url);
			};

			debounce(logic, 200).call(root);
		};

		var arrange = function arrange(e) {
			var externalLinkIsBindedClass = "external-link--is-binded";

			if (!hasClass(e, externalLinkIsBindedClass)) {
				var url = e[getAttribute]("href") || "";

				if (
					url &&
					parseLink(url).isCrossDomain &&
					parseLink(url).hasHTTP
				) {
					e.title =
						"" +
						(parseLink(url).hostname || "") +
						" откроется в новой вкладке";

					if ("undefined" !== typeof getHTTP && getHTTP()) {
						e.target = "_blank";
						e.rel = "noopener";
					} else {
						e[_addEventListener]("click", handle.bind(null, url));
					}

					addClass(e, externalLinkIsBindedClass);
				}
			}
		};

		if (link) {
			var i, l;

			for (i = 0, l = link[_length]; i < l; i += 1) {
				arrange(link[i]);
			}

			i = l = null;
		}
	};

	root.manageExternalLinkAll = manageExternalLinkAll;
})("undefined" !== typeof window ? window : this, document);
/*!
 * Macy
 */

(function(root) {
	"use strict";

	var getElementsByClassName = "getElementsByClassName";
	var isActiveClass = "is-active";
	root.macyInstance = null;

	var updateMacy = function updateMacy(delay) {
		var timeout = delay || 100;
		var logThis;

		logThis = function logThis() {
			console.log("updateMacy");
		};

		if (root.macyInstance) {
			var timer = setTimeout(function() {
				clearTimeout(timer);
				timer = null;
				logThis();
				root.macyInstance.recalculate(true, true);
			}, timeout);
		}
	};

	var updateMacyThrottled = throttle(updateMacy, 1000);

	var initMacy = function initMacy(macyClass, options) {
		var defaultSettings = {
			/* container: ".macy", */
			trueOrder: false,
			waitForImages: false,
			margin: 0,
			columns: 5,
			breakAt: {
				1280: 5,
				1024: 4,
				960: 3,
				640: 2,
				480: 2,
				360: 1
			}
		};
		var settings = options || {};
		settings.container = "." + macyClass;
		var opt;

		for (opt in defaultSettings) {
			if (
				defaultSettings.hasOwnProperty(opt) &&
				!settings.hasOwnProperty(opt)
			) {
				settings[opt] = defaultSettings[opt];
			}
		}

		opt = null;
		var macy = document[getElementsByClassName](macyClass)[0] || "";

		if (macy) {
			try {
				if (root.macyInstance) {
					root.macyInstance.remove();
					root.macyInstance = null;
				}

				root.macyInstance = new Macy(settings);
				/* this will be set later after rendering all macy items */

				/* addClass(macy, isActiveClass); */
			} catch (err) {
				throw new Error("cannot init Macy " + err);
			}
		}
	};

	var manageMacy = function manageMacy(macyClass, options) {
		var macy = document[getElementsByClassName](macyClass)[0] || "";

		var handleMacy = function handleMacy() {
			if (!hasClass(macy, isActiveClass)) {
				initMacy(macyClass, options);
			}
		};

		if (root.Macy && macy) {
			handleMacy();
		}
	};

	root.updateMacy = updateMacy;
	root.updateMacyThrottled = updateMacyThrottled;
	root.manageMacy = manageMacy;
})("undefined" !== typeof window ? window : this);
/*!
 * renderAC
 */

(function(root) {
	"use strict";

	var appendChild = "appendChild";

	var renderAC = function renderAC(
		acGrid,
		cardObj,
		renderOptions,
		onExecute,
		callback
	) {
		if (root.AdaptiveCards && acGrid) {
			var adaptiveCard = new AdaptiveCards.AdaptiveCard();
			adaptiveCard.hostConfig = new AdaptiveCards.HostConfig(
				renderOptions
			);
			adaptiveCard.onExecuteAction = onExecute;
			adaptiveCard.parse(cardObj);
			var renderedCard = adaptiveCard.render();
			acGrid[appendChild](renderedCard);

			if (callback && "function" === typeof callback) {
				callback();
			}

			adaptiveCard = renderedCard = null;
		}
	};

	root.renderAC = renderAC;
})("undefined" !== typeof window ? window : this);
/*!
 * manageReadMore
 */

(function(root, document) {
	"use strict";

	var getElementsByClassName = "getElementsByClassName";
	var _addEventListener = "addEventListener";
	var _length = "length";

	var manageReadMore = function manageReadMore(callback, options) {
		var cb = function cb() {
			return callback && "function" === typeof callback && callback();
		};

		var defaultSettings = {
			target: ".dummy",
			numOfWords: 10,
			toggle: true,
			moreLink: "БОЛЬШЕ",
			lessLink: "МЕНЬШЕ",
			inline: true,
			customBlockElement: "p"
		};
		var settings = options || {};
		var opt;

		for (opt in defaultSettings) {
			if (
				defaultSettings.hasOwnProperty(opt) &&
				!settings.hasOwnProperty(opt)
			) {
				settings[opt] = defaultSettings[opt];
			}
		}

		opt = null;
		var rmLink = document[getElementsByClassName]("rm-link") || "";

		var arrange = function arrange(e) {
			var rmLinkIsBindedClass = "rm-link--is-binded";

			if (!hasClass(e, rmLinkIsBindedClass)) {
				addClass(e, rmLinkIsBindedClass);

				e[_addEventListener]("click", cb);
			}
		};

		var initScript = function initScript() {
			$readMoreJS.init(settings);
			var i, l;

			for (i = 0, l = rmLink[_length]; i < l; i += 1) {
				arrange(rmLink[i]);
			}

			i = l = null;
		};

		if (root.$readMoreJS && rmLink) {
			initScript();
		}
	};

	root.manageReadMore = manageReadMore;
})("undefined" !== typeof window ? window : this, document);
/*!
 * UWP layout
 */

(function(root, document) {
	"use strict";

	var docBody = document.body || "";
	var getElementsByClassName = "getElementsByClassName";
	var getElementsByTagName = "getElementsByTagName";
	var setAttribute = "setAttribute";

	var getButtons = function getButtons() {
		var container =
			document[getElementsByClassName]("layout-type-buttons")[0] || "";
		return container ? container[getElementsByTagName]("button") || "" : "";
	};

	root.layoutTypeToTabs = function(e) {
		var evt = root.event || e;
		evt.preventDefault();
		Array.prototype.slice.call(getButtons()).forEach(function(el) {
			return (el.disabled = false);
		});
		evt.target.disabled = true;
		docBody[setAttribute]("data-layout-type", "tabs");
	};

	root.layoutTypeToOverlay = function(e) {
		var evt = root.event || e;
		evt.preventDefault();
		Array.prototype.slice.call(getButtons()).forEach(function(el) {
			return (el.disabled = false);
		});
		evt.target.disabled = true;
		docBody[setAttribute]("data-layout-type", "overlay");
	};

	root.layoutTypeToDockedMinimized = function(e) {
		var evt = root.event || e;
		evt.preventDefault();
		Array.prototype.slice.call(getButtons()).forEach(function(el) {
			return (el.disabled = false);
		});
		evt.target.disabled = true;
		docBody[setAttribute]("data-layout-type", "docked-minimized");
	};

	root.layoutTypeToDocked = function(e) {
		var evt = root.event || e;
		evt.preventDefault();
		Array.prototype.slice.call(getButtons()).forEach(function(el) {
			return (el.disabled = false);
		});
		evt.target.disabled = true;
		docBody[setAttribute]("data-layout-type", "docked");
	};
})("undefined" !== typeof window ? window : this, document);
/*!
 * removeChildren
 */

(function(root) {
	"use strict";

	var removeChildren = function removeChildren(e) {
		if (e && e.firstChild) {
			for (; e.firstChild; ) {
				e.removeChild(e.firstChild);
			}
		}
	};

	root.removeChildren = removeChildren;
})("undefined" !== typeof window ? window : this);
/*!
 * revealYandexMap
 */

(function(root, document) {
	"use strict";

	var dataset = "dataset";
	var parentNode = "parentNode";
	var isActiveClass = "is-active";

	var revealYandexMap = function revealYandexMap(_this) {
		var yandexMap =
			document.getElementsByClassName("yandex-map-iframe")[0] || "";

		if (yandexMap) {
			yandexMap.src = yandexMap[dataset].src;
			addClass(yandexMap, isActiveClass);

			if (_this[parentNode][parentNode] !== null) {
				_this[parentNode][parentNode].removeChild(_this[parentNode]);
			}
		}
	};

	root.revealYandexMap = revealYandexMap;
})("undefined" !== typeof window ? window : this, document);
/*!
 * loadingSpinner
 */

(function(root, document) {
	"use strict";

	var getElementsByClassName = "getElementsByClassName";
	var isActiveClass = "is-active";

	var LoadingSpinner = (function() {
		var uwpLoading =
			document[getElementsByClassName]("uwp-loading")[0] || "";

		if (!uwpLoading) {
			return;
		}

		return {
			hide: function hide() {
				removeClass(uwpLoading, isActiveClass);
			},
			show: function show() {
				addClass(uwpLoading, isActiveClass);
			}
		};
	})();

	root.LoadingSpinner = LoadingSpinner;
})("undefined" !== typeof window ? window : this, document);
/*!
 * app logic
 */

(function(root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docImplem = document.implementation || "";
	var docBody = document.body || "";
	var classList = "classList";
	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var defineProperty = "defineProperty";
	var getOwnPropertyDescriptor = "getOwnPropertyDescriptor";
	var querySelector = "querySelector";
	var querySelectorAll = "querySelectorAll";
	var title = "title";
	var _addEventListener = "addEventListener";
	var _length = "length";
	var toStringFn = {}.toString;
	var supportsSvgSmilAnimation =
		(!!document[createElementNS] &&
			/SVGAnimate/.test(
				toStringFn.call(
					document[createElementNS](
						"http://www.w3.org/2000/svg",
						"animate"
					)
				)
			)) ||
		"";

	if (supportsSvgSmilAnimation && docElem) {
		addClass(docElem, "svganimate");
	}

	var supportsCanvas;

	supportsCanvas = (function() {
		var elem = document[createElement]("canvas");
		return !!(elem.getContext && elem.getContext("2d"));
	})();

	var run = function run() {
		if (docElem && docElem[classList]) {
			removeClass(docElem, "no-js");
			addClass(docElem, "js");
		}

		var earlyDeviceFormfactor = (function(selectors) {
			var orientation;
			var size;

			var f = function f(a) {
				var b = a.split(" ");

				if (selectors) {
					var c;

					for (c = 0; c < b[_length]; c += 1) {
						a = b[c];
						selectors.add(a);
					}

					c = null;
				}
			};

			var g = function g(a) {
				var b = a.split(" ");

				if (selectors) {
					var c;

					for (c = 0; c < b[_length]; c += 1) {
						a = b[c];
						selectors.remove(a);
					}

					c = null;
				}
			};

			var h = {
				landscape: "all and (orientation:landscape)",
				portrait: "all and (orientation:portrait)"
			};
			var k = {
				small: "all and (max-width:768px)",
				medium: "all and (min-width:768px) and (max-width:991px)",
				large: "all and (min-width:992px)"
			};
			var d;
			var matchMedia = "matchMedia";
			var matches = "matches";

			var o = function o(a, b) {
				var c = function c(a) {
					if (a[matches]) {
						f(b);
						orientation = b;
					} else {
						g(b);
					}
				};

				c(a);
				a.addListener(c);
			};

			var s = function s(a, b) {
				var c = function c(a) {
					if (a[matches]) {
						f(b);
						size = b;
					} else {
						g(b);
					}
				};

				c(a);
				a.addListener(c);
			};

			for (d in h) {
				if (h.hasOwnProperty(d)) {
					o(root[matchMedia](h[d]), d);
				}
			}

			for (d in k) {
				if (k.hasOwnProperty(d)) {
					s(root[matchMedia](k[d]), d);
				}
			}

			return {
				orientation: orientation || "",
				size: size || ""
			};
		})(docElem[classList] || "");

		var earlyDeviceType = (function(mobile, desktop, opera) {
			var selector =
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
					opera
				) ||
				/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
					opera.substr(0, 4)
				)
					? mobile
					: desktop;
			addClass(docElem, selector);
			return selector;
		})(
			"mobile",
			"desktop",
			navigator.userAgent || navigator.vendor || root.opera
		);

		var earlySvgSupport = (function(selector) {
			selector = docImplem.hasFeature("http://www.w3.org/2000/svg", "1.1")
				? selector
				: "no-" + selector;
			addClass(docElem, selector);
			return selector;
		})("svg");

		var earlySvgasimgSupport = (function(selector) {
			selector = docImplem.hasFeature(
				"http://www.w3.org/TR/SVG11/feature#Image",
				"1.1"
			)
				? selector
				: "no-" + selector;
			addClass(docElem, selector);
			return selector;
		})("svgasimg");

		var earlyHasTouch = (function(selector) {
			selector = "ontouchstart" in docElem ? selector : "no-" + selector;
			addClass(docElem, selector);
			return selector;
		})("touch");

		var getHumanDate = (function() {
			var newDate = new Date();
			var newDay = newDate.getDate();
			var newYear = newDate.getFullYear();
			var newMonth = newDate.getMonth();
			newMonth += 1;

			if (10 > newDay) {
				newDay = "0" + newDay;
			}

			if (10 > newMonth) {
				newMonth = "0" + newMonth;
			}

			return newYear + "-" + newMonth + "-" + newDay;
		})();

		var userBrowser =
			" [" +
			(getHumanDate ? getHumanDate : "") +
			(earlyDeviceType ? " " + earlyDeviceType : "") +
			(earlyDeviceFormfactor.orientation
				? " " + earlyDeviceFormfactor.orientation
				: "") +
			(earlyDeviceFormfactor.size
				? " " + earlyDeviceFormfactor.size
				: "") +
			(earlySvgSupport ? " " + earlySvgSupport : "") +
			(earlySvgasimgSupport ? " " + earlySvgasimgSupport : "") +
			(earlyHasTouch ? " " + earlyHasTouch : "") +
			"]";
		var hashBang = "#/";

		var onPageLoad = function onPageLoad() {
			if (document[title]) {
				document[title] = document[title] + userBrowser;
			}

			var hashName = root.location.hash
				? root.location.hash.split(hashBang)[1]
				: "";
			var routes = [
				{
					hash: "",
					fn: runHome
				},
				{
					hash: "home",
					fn: runHome
				},
				{
					hash: "works",
					fn: runWorks
				},
				{
					hash: "pictures",
					fn: runPictures
				},
				{
					hash: "gallery",
					fn: runGallery
				},
				{
					hash: "about",
					fn: runAbout
				}
			];
			var i, l;

			for (i = 0, l = routes[_length]; i < l; i += 1) {
				if (hashName === routes[i].hash) {
					if ("function" === typeof routes[i].fn) {
						/* routes[i].fn.call(root); */
						routes[i].fn();
					}
				}
			}

			i = l = null;
		};

		if (root.UWP) {
			root.UWP.init({
				pageTitle: "UWP web framework",
				layoutType: "docked-minimized",
				activeColor: "#29b6f6",
				mainColor: "#424242",
				mainColorDarkened: "#0288d1",
				includes: "./includes/serguei-uwp",
				includeScript: "./libs/serguei-uwp/js/include-script",
				includeStyle: "./libs/serguei-uwp/css/include-style",
				navContainer: "nav-container",
				home: "home",
				hashNavKey: "page",
				hashBang: hashBang,
				onPageLoad: onPageLoad,
				errorTitle: "Что-то пошло не так",
				errorLinkText: "На Главную"
			});
		}

		var switchLayoutType = function switchLayoutType() {
			var addMqHandler = function addMqHandler(mqString, callback) {
				var handle = function handle(x) {
					if (x.matches) {
						if (callback && "function" === typeof callback) {
							callback();
						}
					}
				};

				var mq = root.matchMedia(mqString);
				handle(mq);
				mq.addListener(handle);
			};

			var mqCallback = function mqCallback(attrName, layoutType) {
				docBody.setAttribute(attrName, layoutType);
			};

			var mqHandlers = [
				{
					val: "(max-width: 639px)",
					fn: mqCallback.bind(null, "data-layout-type", "overlay")
				},
				{
					val: "(min-width: 640px) and (max-width: 1023px)",
					fn: mqCallback.bind(null, "data-layout-type", "tabs")
				},
				{
					val: "(min-width: 1024px)",
					fn: mqCallback.bind(
						null,
						"data-layout-type",
						"docked-minimized"
					)
				}
			];
			var i, l;

			for (i = 0, l = mqHandlers[_length]; i < l; i += 1) {
				if ("function" === typeof mqHandlers[i].fn) {
					addMqHandler(mqHandlers[i].val, mqHandlers[i].fn);
				}
			}

			i = l = null;
		};

		switchLayoutType();
	};

	var scripts = ["./libs/serguei-uwp/css/bundle.min.css"];

	var supportsPassive = (function() {
		var support = false;

		try {
			var opts =
				Object[defineProperty] &&
				Object[defineProperty]({}, "passive", {
					get: function get() {
						support = true;
					}
				});

			root[_addEventListener]("test", function() {}, opts);
		} catch (err) {}

		return support;
	})();

	var needsPolyfills = (function() {
		return (
			!String.prototype.startsWith ||
			!supportsPassive ||
			!root.requestAnimationFrame ||
			!root.matchMedia ||
			("undefined" === typeof root.Element && !("dataset" in docElem)) ||
			!("classList" in document[createElement]("_")) ||
			(document[createElementNS] &&
				!(
					"classList" in
					document[createElementNS]("http://www.w3.org/2000/svg", "g")
				)) ||
			(root.attachEvent && !root[_addEventListener]) ||
			!("onhashchange" in root) ||
			!Array.prototype.indexOf ||
			!root.Promise ||
			!root.fetch ||
			!document[querySelectorAll] ||
			!document[querySelector] ||
			!Function.prototype.bind ||
			(Object[defineProperty] &&
				Object[getOwnPropertyDescriptor] &&
				Object[getOwnPropertyDescriptor](
					Element.prototype,
					"textContent"
				) &&
				!Object[getOwnPropertyDescriptor](
					Element.prototype,
					"textContent"
				).get) ||
			!(
				"undefined" !== typeof root.localStorage &&
				"undefined" !== typeof root.sessionStorage
			) ||
			!root.WeakMap ||
			!root.MutationObserver
		);
	})();

	if (needsPolyfills) {
		scripts.push("./cdn/polyfills/js/polyfills.fixed.min.js");
	}

	scripts.push(
		"./libs/serguei-uwp/js/vendors.min.js",
		"./libs/serguei-uwp/js/pages.min.js"
	);
	var bodyFontFamily = "Roboto";

	var onFontsLoaded = function onFontsLoaded() {
		var slot;

		var init = function init() {
			clearInterval(slot);
			slot = null;

			if (
				!supportsSvgSmilAnimation &&
				"undefined" !== typeof progressBar
			) {
				progressBar.increase(20);
			}

			var load;
			load = new loadJsCss(scripts, run);
		};

		var check;

		check = function check() {
			if (doesFontExist(bodyFontFamily)) {
				init();
			}
		};
		/* if (supportsCanvas) {
    	slot = setInterval(check, 100);
    } else {
    	slot = null;
    	init();
    } */

		init();
	};

	var loadDeferred = function loadDeferred(urlArray, callback) {
		var timer;

		var handle = function handle() {
			clearTimeout(timer);
			timer = null;
			var load;
			load = new loadJsCss(urlArray, callback);
		};

		var req;

		var raf = function raf() {
			cancelAnimationFrame(req);
			timer = setTimeout(handle, 0);
		};

		if (root.requestAnimationFrame) {
			req = requestAnimationFrame(raf);
		} else {
			root[_addEventListener]("load", handle);
		}
	};

	loadDeferred(
		[
			"./libs/serguei-uwp/css/vendors.min.css",
			"./libs/serguei-uwp/css/pages.min.css"
		],
		onFontsLoaded
	);
})("undefined" !== typeof window ? window : this, document);
