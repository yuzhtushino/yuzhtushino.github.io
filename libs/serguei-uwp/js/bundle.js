/*global AdaptiveCards, console, debounce, doesFontExist, getHTTP, isElectron,
isNwjs, loadJsCss, Macy, openDeviceBrowser, parseLink, require, runHome,
runWorks, runPictures, runGallery, runAbout,  throttle, $readMoreJS*/

/*!
 * modified loadExt
 * @see {@link https://gist.github.com/englishextra/ff9dc7ab002312568742861cb80865c9}
 * passes jshint
 */
(function(root, document) {
	"use strict";

	var loadJsCss = function loadJsCss(files, callback) {
		var _this = this;

		var appendChild = "appendChild";
		var body = "body";
		var createElement = "createElement";
		var getElementsByTagName = "getElementsByTagName";
		/* var insertBefore = "insertBefore"; */

		var _length = "length";
		/* var parentNode = "parentNode"; */

		var setAttribute = "setAttribute";
		_this.files = files;
		_this.js = [];
		_this.head = document[getElementsByTagName]("head")[0] || "";
		_this.body = document[body] || "";
		_this.ref = document[getElementsByTagName]("script")[0] || "";

		_this.callback = callback || function() {};

		_this.loadStyle = function(file) {
			var link = document[createElement]("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = file;
			/* _this.head[appendChild](link); */

			link.media = "only x";

			link.onload = function() {
				this.onload = null;
				this.media = "all";
			};

			link[setAttribute]("property", "stylesheet");

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
			if (/\.js$|\.js\?/.test(_this.files[i])) {
				_this.js.push(_this.files[i]);
			}

			if (/\.css$|\.css\?|\/css\?/.test(_this.files[i])) {
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
 * scriptIsLoaded
 */

(function(root, document) {
	"use strict";

	var getAttribute = "getAttribute";
	var getElementsByTagName = "getElementsByTagName";
	var _length = "length";

	var scriptIsLoaded = function scriptIsLoaded(scriptSrc) {
		var scriptAll, i, l;

		for (
			scriptAll = document[getElementsByTagName]("script") || "",
				i = 0,
				l = scriptAll[_length];
			i < l;
			i += 1
		) {
			if (scriptAll[i][getAttribute]("src") === scriptSrc) {
				scriptAll = i = l = null;
				return true;
			}
		}

		scriptAll = i = l = null;
		return false;
	};

	root.scriptIsLoaded = scriptIsLoaded;
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
	var isElectron =
		("undefined" !== typeof root &&
			root.process &&
			"renderer" === root.process.type) ||
		"";

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
		var triggerForElectron = function triggerForElectron() {
			var es = isElectron ? require("electron").shell : "";
			return es ? es.openExternal(url) : "";
		};

		var triggerForNwjs = function triggerForNwjs() {
			var ns = isNwjs ? require("nw.gui").Shell : "";
			return ns ? ns.openExternal(url) : "";
		};

		var triggerForHTTP = function triggerForHTTP() {
			return true;
		};

		var triggerForLocal = function triggerForLocal() {
			return root.open(url, "_system", "scrollbars=1,location=no");
		};

		if (isElectron) {
			triggerForElectron();
		} else if (isNwjs) {
			triggerForNwjs();
		} else {
			var locationProtocol = root.location.protocol || "",
				hasHTTP = locationProtocol
					? "http:" === locationProtocol
						? "http"
						: "https:" === locationProtocol
						? "https"
						: ""
					: "";

			if (hasHTTP) {
				triggerForHTTP();
			} else {
				triggerForLocal();
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
		var locationProtocol = root.location.protocol || "";
		return "http:" === locationProtocol
			? "http"
			: "https:" === locationProtocol
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
	/*jshint bitwise: false */

	var createElement = "createElement";

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

	var classList = "classList";
	var getAttribute = "getAttribute";
	var getElementsByTagName = "getElementsByTagName";
	var _addEventListener = "addEventListener";
	var _length = "length";

	var manageExternalLinkAll = function manageExternalLinkAll(scope) {
		var ctx = scope && scope.nodeName ? scope : "";
		var linkTag = "a";
		var linkAll = ctx
			? ctx[getElementsByTagName](linkTag) || ""
			: document[getElementsByTagName](linkTag) || "";

		var handleExternalLink = function handleExternalLink(url, ev) {
			ev.stopPropagation();
			ev.preventDefault();
			var logicHandleExternalLink = openDeviceBrowser.bind(null, url);
			var debounceLogicHandleExternalLink = debounce(
				logicHandleExternalLink,
				200
			);
			debounceLogicHandleExternalLink();
		};

		var arrange = function arrange(e) {
			var externalLinkIsBindedClass = "external-link--is-binded";

			if (!e[classList].contains(externalLinkIsBindedClass)) {
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
						e[_addEventListener](
							"click",
							handleExternalLink.bind(null, url)
						);
					}

					e[classList].add(externalLinkIsBindedClass);
				}
			}
		};

		if (linkAll) {
			var i, l;

			for (i = 0, l = linkAll[_length]; i < l; i += 1) {
				arrange(linkAll[i]);
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

	var classList = "classList";
	var getElementsByClassName = "getElementsByClassName";
	var macyGridIsActiveClass = "macy-grid--is-active";
	root.handleMacy = null;

	var updateMacy = function updateMacy(delay) {
		var timeout = delay || 100;
		var logThis;

		logThis = function logThis() {
			console.log("updateMacy");
		};

		if (root.handleMacy) {
			var timer = setTimeout(function() {
				clearTimeout(timer);
				timer = null;
				logThis();
				root.handleMacy.recalculate(true, true);
			}, timeout);
		}
	};

	var updateMacyThrottled = throttle(updateMacy, 1000);

	var initMacy = function initMacy(macyGridClass, options) {
		var defaultSettings = {
			/* container: ".macy-grid", */
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
		settings.container = "." + macyGridClass;
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
		var macyContainer =
			document[getElementsByClassName](macyGridClass)[0] || "";

		if (macyContainer) {
			try {
				if (root.handleMacy) {
					root.handleMacy.remove();
					root.handleMacy = null;
				}

				root.handleMacy = new Macy(settings);
				/* macyContainer[classList].add(macyGridIsActiveClass); */
			} catch (err) {
				throw new Error("cannot init Macy " + err);
			}
		}
	};

	var manageMacy = function manageMacy(macyGridClass, options) {
		var macyContainer =
			document[getElementsByClassName](macyGridClass)[0] || "";

		var handleMacyContainer = function handleMacyContainer() {
			if (!macyContainer[classList].contains(macyGridIsActiveClass)) {
				initMacy(macyGridClass, options);
			}
		};

		if (root.Macy && macyContainer) {
			handleMacyContainer();
		}
	};

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

	var classList = "classList";
	var getElementsByClassName = "getElementsByClassName";
	var rmLinkClass = "rm-link";
	var rmLinkIsBindedClass = "rm-link--is-binded";
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
		var rmLink = document[getElementsByClassName](rmLinkClass) || "";

		var arrange = function arrange(e) {
			if (!e[classList].contains(rmLinkIsBindedClass)) {
				e[classList].add(rmLinkIsBindedClass);

				e[_addEventListener]("click", cb);
			}
		};

		var initScript = function initScript() {
			if (root.$readMoreJS) {
				$readMoreJS.init(settings);
				var i, l;

				for (i = 0, l = rmLink[_length]; i < l; i += 1) {
					arrange(rmLink[i]);
				}

				i = l = null;
			}
		};

		if (rmLink) {
			/* var timer = setTimeout(function () {
      clearTimeout(timer);
      timer = null;
      initScript();
      }, 100); */
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
		document.body[setAttribute]("data-layout-type", "tabs");
	};

	root.layoutTypeToOverlay = function(e) {
		var evt = root.event || e;
		evt.preventDefault();
		Array.prototype.slice.call(getButtons()).forEach(function(el) {
			return (el.disabled = false);
		});
		evt.target.disabled = true;
		document.body[setAttribute]("data-layout-type", "overlay");
	};

	root.layoutTypeToDockedMinimized = function(e) {
		var evt = root.event || e;
		evt.preventDefault();
		Array.prototype.slice.call(getButtons()).forEach(function(el) {
			return (el.disabled = false);
		});
		evt.target.disabled = true;
		document.body[setAttribute]("data-layout-type", "docked-minimized");
	};

	root.layoutTypeToDocked = function(e) {
		var evt = root.event || e;
		evt.preventDefault();
		Array.prototype.slice.call(getButtons()).forEach(function(el) {
			return (el.disabled = false);
		});
		evt.target.disabled = true;
		document.body[setAttribute]("data-layout-type", "docked");
	};
})("undefined" !== typeof window ? window : this, document);
/*!
 * revealYandexMap
 */

(function(root, document) {
	"use strict";

	var classList = "classList";
	var dataset = "dataset";
	var parentNode = "parentNode";
	var style = "style";

	var revealYandexMap = function revealYandexMap(_this) {
		var yandexMap =
			document.getElementsByClassName("yandex-map-iframe")[0] || "";

		if (yandexMap) {
			yandexMap.src = yandexMap[dataset].src;
			yandexMap[classList].add("yandex-map-iframe--is-active");

			if (_this[parentNode]) {
				_this[parentNode][style].display = "none";
			}
		}
	};

	root.revealYandexMap = revealYandexMap;
})("undefined" !== typeof window ? window : this, document);
/*!
 * app logic
 */

(function(root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var classList = "classList";
	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var defineProperty = "defineProperty";
	var getOwnPropertyDescriptor = "getOwnPropertyDescriptor";
	var querySelector = "querySelector";
	var querySelectorAll = "querySelectorAll";
	var _addEventListener = "addEventListener";
	var _length = "length";
	docElem[classList].add("no-js");

	var run = function run() {
		var hashBang = "#/";

		var onPageLoad = function onPageLoad() {
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
				activeColor: "#26C6DA",
				mainColor: "#373737",
				mainColorDarkened: "#0097A7",
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
			var addMq = function addMq(mqString, callback) {
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
				document.body.setAttribute(attrName, layoutType);
			};

			addMq(
				"(max-width: 639px)",
				mqCallback.bind(null, "data-layout-type", "overlay")
			);
			addMq(
				"(min-width: 640px) and (max-width: 1023px)",
				mqCallback.bind(null, "data-layout-type", "tabs")
			);
			addMq(
				"(min-width: 1024px)",
				mqCallback.bind(null, "data-layout-type", "docked-minimized")
			);
		};

		switchLayoutType();
	};
	/* var scripts = [
  "../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
  "../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
  "../../cdn/typeboost-uwp.css/0.1.8/css/typeboost-uwp.css",
  "../../cdn/uwp-web-framework/2.0/css/uwp.style.fixed.css"
  ]; */

	var scripts = [
		/* "./libs/serguei-uwp/css/vendors.min.css", */
		"./libs/serguei-uwp/css/bundle.min.css"
	];

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
			/* !document.importNode || */

			/* !("content" in document[createElement]("template")) || */
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
	/* var scripts = [
  "../../cdn/imagesloaded/4.1.4/js/imagesloaded.pkgd.fixed.js",
  "../../cdn/lazyload/10.19.0/js/lazyload.iife.fixed.js",
  "../../cdn/ReadMore.js/1.0.0/js/readMoreJS.fixed.js",
  "../../cdn/uwp-web-framework/2.0/js/uwp.core.fixed.js",
  "../../cdn/resize/1.0.0/js/any-resize-event.fixed.js",
  "../../cdn/macy.js/2.3.1/js/macy.fixed.js"
  ]; */

	scripts.push(
		"./libs/serguei-uwp/js/vendors.min.js",
		"./libs/serguei-uwp/js/pages.min.js"
	);
	/*!
	 * load scripts after webfonts loaded using doesFontExist
	 */

	var supportsCanvas;

	supportsCanvas = (function() {
		var elem = document[createElement]("canvas");
		return !!(elem.getContext && elem.getContext("2d"));
	})();

	var onFontsLoadedCallback = function onFontsLoadedCallback() {
		var slot;

		var onFontsLoaded = function onFontsLoaded() {
			if (slot) {
				clearInterval(slot);
				slot = null;
			}
			/* progressBar.increase(20); */

			var load;
			load = new loadJsCss(scripts, run);
		};

		var checkFontIsLoaded;

		checkFontIsLoaded = function checkFontIsLoaded() {
			/*!
			 * check only for fonts that are used in current page
			 */
			if (
				doesFontExist("Roboto")
				/* && doesFontExist("Roboto Mono") */
			) {
				onFontsLoaded();
			}
		};
		/* if (supportsCanvas) {
    slot = setInterval(checkFontIsLoaded, 100);
    } else {
    slot = null;
    onFontsLoaded();
    } */

		onFontsLoaded();
	};

	var loadDeferred = function loadDeferred() {
		var timer;

		var logic = function logic() {
			clearTimeout(timer);
			timer = null;
			var load;
			load = new loadJsCss(
				[
					/* forcedHTTP + "://fonts.googleapis.com/css?family=Roboto+Mono%7CRoboto:300,400,500,700&subset=cyrillic,latin-ext", */
					"./libs/serguei-uwp/css/vendors.min.css",
					"./libs/serguei-uwp/css/pages.min.css"
				],
				onFontsLoadedCallback
			);
		};

		var req;

		var raf = function raf() {
			cancelAnimationFrame(req);
			timer = setTimeout(logic, 0);
		};

		if (root.requestAnimationFrame) {
			req = requestAnimationFrame(raf);
		} else {
			root[_addEventListener]("load", logic);
		}
	};

	loadDeferred();
	/*!
	 * load scripts after webfonts loaded using webfontloader
	 */

	/* root.WebFontConfig = {
  google: {
  families: [
  "Roboto:300,400,500,700:cyrillic",
  "Roboto Mono:400:cyrillic,latin-ext"
  ]
  },
  listeners: [],
  active: function () {
  this.called_ready = true;
  var i;
  for (i = 0; i < this.listeners[_length]; i++) {
  this.listeners[i]();
  }
  i = null;
  },
  ready: function (callback) {
  if (this.called_ready) {
  callback();
  } else {
  this.listeners.push(callback);
  }
  }
  };
  	var onFontsLoadedCallback = function () {
  	var onFontsLoaded = function () {
  progressBar.increase(20);
  	var load;
  load = new loadJsCss(scripts, run);
  };
  	root.WebFontConfig.ready(onFontsLoaded);
  };
  	var load;
  load = new loadJsCss(
  [forcedHTTP + "://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.min.js"],
  onFontsLoadedCallback
  ); */
})("undefined" !== typeof window ? window : this, document);
