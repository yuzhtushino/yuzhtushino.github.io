/*global ActiveXObject, console */
(function(root, document) {
	"use strict";

	Element.prototype.prependChild = function(node) {
		var firstChild = this.firstChild;

		if (firstChild) {
			return this.insertBefore(node, firstChild);
		} else {
			return this.appendChild(node);
		}
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
			return _color
				.match(hex_match)
				.slice(2)
				.map(function(piece) {
					return parseInt(piece, 16);
				});
		}

		console.error("Unrecognized color format.");
		return null;
	};

	var calculateBrightness = function calculateBrightness(color) {
		return (
			color.reduce(function(p, c) {
				return p + parseInt(c, 10);
			}, 0) / 3
		);
	};

	var removeChildren = function removeChildren(e) {
		if (e && e.firstChild) {
			for (; e.firstChild; ) {
				e.removeChild(e.firstChild);
			}
		}
	};

	var removeJsCssFile = function removeJsCssFile(filename, filetype) {
		var targetelement =
			filetype == "js" ? "script" : filetype == "css" ? "link" : "none";
		var targetattr =
			filetype == "js" ? "src" : filetype == "css" ? "href" : "none";
		var allsuspects = document.getElementsByTagName(targetelement) || "";
		var i;

		for (i = allsuspects.length; i >= 0; i--) {
			if (
				allsuspects[i] &&
				allsuspects[i].getAttribute(targetattr) != null &&
				allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1
			) {
				allsuspects[i].parentNode.removeChild(allsuspects[i]);
			}
		}

		i = null;
	};

	var _extends = function _extends() {
		var _extends =
			Object.assign ||
			function(target) {
				var i;

				for (i = 1; i < arguments.length; i++) {
					var source = arguments[i];
					var key;

					for (key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							target[key] = source[key];
						}
					}

					key = null;
				}

				i = null;
				return target;
			};

		return _extends.apply(this, arguments);
	};

	var parseDomFromString = function parseDomFromString(responseText) {
		var tempDiv = document.createElement("div");
		tempDiv.innerHTML = responseText;
		return tempDiv;
	};

	var UWP = {
		version: "2.0.0",
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
			hashNavKey: "page",
			hashBang: "#/",
			onPageLoad: function onPageLoad() {
				return;
			},
			errorTitle: "Something went wrong",
			errorLinkText: "Go Home"
		},
		init: function init(params) {
			console.log("UWP.init()");
			UWP.head = document.head;
			UWP.body = document.body;
			UWP.container = null;

			var _uwp_container =
				document.getElementsByClassName("uwp-container")[0] || "";

			if (!_uwp_container) {
				UWP.container = document.createElement("div");
				UWP.container.setAttribute("class", "uwp-container");
				UWP.container.setAttribute("role", "document");
				document.body.appendChild(UWP.container);
			} else {
				UWP.container = _uwp_container;
			}

			UWP.header = null;

			var _UWP_header =
				document.getElementsByClassName("uwp-header")[0] || "";

			if (!_UWP_header) {
				UWP.header = document.createElement("div");
				UWP.header.setAttribute("class", "uwp-header");
				UWP.header.setAttribute("role", "navigation");
				UWP.container.appendChild(UWP.header);
			} else {
				UWP.header = _UWP_header;
			}

			UWP.main = null;

			var _uwp_main =
				document.getElementsByClassName("uwp-main")[0] || "";

			if (!_uwp_main) {
				UWP.main = document.createElement("div");
				UWP.main.setAttribute("class", "uwp-main");
				UWP.main.setAttribute("role", "main");
				UWP.container.appendChild(UWP.main);
			} else {
				UWP.main = _uwp_main;
			}

			UWP.loading = null;

			var _uwp_loading =
				document.getElementsByClassName("uwp-loading")[0] || "";

			if (!_uwp_loading) {
				UWP.loading = document.createElement("div");
				UWP.loading.setAttribute("class", "uwp-loading");
				UWP.loading.setAttribute("role", "main");
				UWP.loading.innerHTML =
					'<div class="uwp-loading__part"><div class="uwp-loading__rotator"></div></div><div class="uwp-loading__part uwp-loading__part--bottom"><div class="uwp-loading__rotator"></div></div>\n';
				document.body.appendChild(UWP.loading);
			} else {
				UWP.loading = _uwp_loading;
			}

			UWP.revealUWPLoading = function() {
				UWP.loading.classList.add("is-active");
			};

			UWP.concealUWPLoading = function() {
				var timer = setTimeout(function() {
					clearTimeout(timer);
					timer = null;
					UWP.loading.classList.remove("is-active");
				}, 1000);
			};

			UWP.removeUWPLoading = function() {
				UWP.loading.classList.remove("is-active");
			};

			UWP.getConfig(params);
			UWP.header.type = UWP.config.layoutType;
			UWP.body.setAttribute("data-layout-type", UWP.header.type);
			UWP.body.addEventListener("click", function(event) {
				if (event.target.getAttribute("data-target") !== null) {
					event.stopPropagation();
					event.preventDefault();
					UWP.navigate(event.target.getAttribute("data-target"));
				}
			});
			UWP.getNavigation();
			UWP.createStyles();
			UWP.navigate(root.location.hash.split(/#\//)[1], false);

			root.onhashchange = function() {
				UWP.navigate(root.location.hash.split(/#\//)[1], false);
			};

			UWP.pageTitle = null;

			var _uwp_page_heading =
				document.getElementsByClassName("uwp-page-heading")[0] || "";

			if (!_uwp_page_heading) {
				UWP.pageTitle = document.createElement("h1");
				UWP.pageTitle.setAttribute("class", "uwp-page-heading");
				UWP.pageTitle.innerHTML = UWP.config.pageTitle;
				UWP.header.appendChild(UWP.pageTitle);
			} else {
				UWP.pageTitle = _uwp_page_heading;
			}
		},
		getConfig: function getConfig(params) {
			console.log("UWP.getConfig()");
			UWP.config = _extends(UWP.config, params);
		},
		getNavigation: function getNavigation(target) {
			console.log("UWP.getNavigation()");

			if (typeof target === "undefined") {
				target = UWP.config.navContainer;
			}

			function parseNavElement(el) {
				var elLabel = el
					? el.getElementsByTagName("nav-label")[0] || ""
					: "";
				var navLabel = elLabel.textContent || "";
				var elTarget = el
					? el.getElementsByTagName("nav-target")[0] || ""
					: "";
				var navTarget = elTarget.textContent || "";
				var elIcon = el
					? el.getElementsByTagName("nav-icon")[0] || ""
					: "";
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

					if (/\.(jpg|png|gif|svg)/.test(navIconSource.textContent)) {
						var navIconImage = document.createElement("img");
						navIconImage.src = navIconSource.textContent;
						navIcon.appendChild(navIconImage);
					} else {
						navIcon.innerHTML = navIconSource.innerHTML;
					}

					navLink.prependChild(navIcon);
				}

				navLink.addEventListener("click", function(event) {
					event.stopPropagation();
					event.preventDefault();

					if (
						root.location.hash !==
						"".concat(UWP.config.hashBang, navTarget)
					) {
						UWP.menuList.classList.remove("active");
						UWP.navigate(navTarget);
					}
				});
				navLink.setAttribute("data-target", navTarget);
				navElement.appendChild(navLink);
				return navElement;
			}

			var URL = "".concat(UWP.config.includes, "/", target, ".html");
			var UWP_navigation_request = root.XMLHttpRequest
				? new XMLHttpRequest()
				: new ActiveXObject("Microsoft.XMLHTTP");
			UWP_navigation_request.overrideMimeType("text/html;charset=utf-8");
			UWP_navigation_request.open("GET", URL, true);
			UWP_navigation_request.withCredentials = false;

			UWP_navigation_request.onreadystatechange = function() {
				if (
					UWP_navigation_request.status === 404 ||
					UWP_navigation_request.status === 0
				) {
					console.log(
						"Error XMLHttpRequest-ing file",
						UWP_navigation_request.status
					);
				} else if (
					UWP_navigation_request.readyState === 4 &&
					UWP_navigation_request.status === 200 &&
					UWP_navigation_request.responseText
				) {
					var parsed = parseDomFromString(
						UWP_navigation_request.responseText
					);
					var elMainMenu =
						parsed.getElementsByTagName("nav-container")[0] || "";
					var navsSource = elMainMenu || "";
					var nav = document.createElement("div");
					nav.setAttribute("class", "uwp-nav");
					UWP.nav = nav;
					var elList = navsSource
						? navsSource.getElementsByTagName("nav-list") || ""
						: "";
					toArray(elList).forEach(function(navSource) {
						var navMain = document.createElement("ul");
						UWP.nav.appendChild(navMain);
						var elEl = navsSource
							? navSource.getElementsByTagName("nav-item") || ""
							: "";
						toArray(elEl).forEach(function(el) {
							navMain.appendChild(parseNavElement(el));
						});
					});

					if (toArray(elList).length) {
						UWP.header.appendChild(UWP.nav);
						UWP.addMenuButton();
					}
				}
			};

			UWP_navigation_request.send(null);
		},
		updateNavigation: function updateNavigation() {
			console.log("UWP.updateNavigation()");
			var nav = document.getElementsByClassName("uwp-nav")[0] || "";
			var navA = nav ? nav.getElementsByTagName("a") || "" : "";
			toArray(navA).forEach(function(link) {
				if (
					link.getAttribute("data-target") === UWP.config.currentPage
				) {
					link.parentElement.classList.add("active");
				} else {
					link.parentElement.classList.remove("active");
				}
			});
		},
		createStyles: function createStyles() {
			console.log("UWP.createStyles()");
			UWP.customStyle = document.createElement("style");

			if (UWP.config.mainColor) {
				var mainColor_RGB = parseColor(UWP.config.mainColor);

				if (mainColor_RGB) {
					var mainColor_brightness = calculateBrightness(
						mainColor_RGB
					);

					if (mainColor_brightness >= 128) {
						UWP.body.classList.add("uwp-theme--light");
					} else {
						UWP.body.classList.add("uwp-theme--dark");
					}

					var mainColorDarkened = mainColor_RGB.map(function(color) {
						var newColor = color - 20;
						if (newColor < 0) newColor = 0;
						return newColor;
					});

					if (!UWP.config.mainColorDarkened) {
						UWP.config.mainColorDarkened = "rgb(".concat(
							mainColorDarkened,
							")"
						);
					}
				}

				UWP.customStyle.innerHTML += '\n\t[data-layout-type="tabs"] .uwp-header {\n\tbackground: '
					.concat(
						UWP.config.mainColor,
						';\n\t}\n\n\t[data-layout-type="overlay"] .uwp-header {\n\tbackground: '
					)
					.concat(
						UWP.config.mainColor,
						';\n\t}\n\t[data-layout-type="overlay"] .uwp-header .uwp-nav:nth-of-type(1) {\n\tbackground-color: '
					)
					.concat(
						UWP.config.mainColorDarkened,
						';\n\t}\n\n\t[data-layout-type="docked-minimized"] .uwp-header {\n\tbackground: '
					)
					.concat(
						UWP.config.mainColor,
						';\n\t}\n\t[data-layout-type="docked-minimized"] .uwp-header .uwp-nav:nth-of-type(1) {\n\tbackground: '
					)
					.concat(
						UWP.config.mainColorDarkened,
						';\n\t}\n\n\t[data-layout-type="docked"] .uwp-header {\n\tbackground: '
					)
					.concat(
						UWP.config.mainColor,
						';\n\t}\n\t[data-layout-type="docked"] .uwp-header .uwp-nav:nth-of-type(1) {\n\tbackground: '
					)
					.concat(UWP.config.mainColorDarkened, ";\n\t}\n\t");
			}

			if (UWP.config.activeColor) {
				var activeColor_RGB = parseColor(UWP.config.activeColor);

				if (activeColor_RGB) {
					var activeColor_brightness = calculateBrightness(
						activeColor_RGB
					);

					if (activeColor_brightness >= 128) {
						UWP.body.classList.add("uwp-theme--active-light");
					} else {
						UWP.body.classList.add("uwp-theme--active-dark");
					}
				}

				UWP.customStyle.innerHTML += '\n\t[data-layout-type="tabs"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\tcolor: '
					.concat(
						UWP.config.activeColor,
						";\n\tborder-bottom-color: "
					)
					.concat(
						UWP.config.activeColor,
						';\n\t}\n\t[data-layout-type="overlay"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\tbackground-color: '
					)
					.concat(
						UWP.config.activeColor,
						';\n\t}\n\t[data-layout-type="docked-minimized"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\tbackground-color: '
					)
					.concat(
						UWP.config.activeColor,
						';\n\t}\n\t[data-layout-type="docked"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\tbackground-color: '
					)
					.concat(UWP.config.activeColor, ";\n\t}\n\t");
			}

			if (UWP.customStyle.innerHTML.length) {
				UWP.body.appendChild(UWP.customStyle);
			}
		},
		addMenuButton: function addMenuButton() {
			console.log("UWP.addMenuButton()");
			UWP.menuButton = null;

			var _uwp_menu_button =
				document.getElementsByClassName("uwp-menu-button")[0] || "";

			if (!_uwp_menu_button) {
				UWP.menuButton = document.createElement("button");
				UWP.menuButton.setAttribute("class", "uwp-menu-button");
				UWP.menuButton.setAttribute("aria-label", "Menu");
				UWP.menuButton.innerHTML =
					'<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" transform="scale(1.75 1.75) translate(0 0)" d="M1024 320h-1024v-64h1024v64zm0 512h-1024v-64h1024v64zm0-256.5h-1024v-63.5h1024v63.5z"/></svg>';
				UWP.header.prependChild(UWP.menuButton);
			} else {
				UWP.menuButton = _uwp_menu_button;
			}

			UWP.menuList =
				UWP.header.getElementsByClassName("uwp-nav")[0] || "";

			if (UWP.menuList) {
				UWP.menuButton.addEventListener("click", function() {
					UWP.menuList.classList.toggle("active");
				});
				UWP.main.addEventListener("click", function() {
					UWP.menuList.classList.remove("active");
				});
			}
		},
		navigate: function navigate(target, addHistory) {
			console.log("UWP.navigate()");

			if (typeof target === "undefined") {
				target = UWP.config.home;
			}

			UWP.config.currentPage = target;

			if (addHistory !== false) {
				history.pushState(
					"",
					"",
					"".concat(
						root.location.href.split(/#\//)[0],
						UWP.config.hashBang,
						target
					)
				);
			}
			/* UWP.main.innerHTML = ""; */

			removeChildren(UWP.main);

			function displayError(title, linkText) {
				UWP.main.innerHTML = '\n\t<div class="uwp-error">\n\t<p>'.concat(
					title,
					'</p>\n\t<p><a href="javascript:void(0);" class="uwp-error-link">' +
						linkText +
						"</a></p>\n\t</div>\n\t"
				);
				var mainA =
					UWP.main.getElementsByClassName("uwp-error-link")[0] || "";
				mainA.addEventListener("click", function(event) {
					event.stopPropagation();
					event.preventDefault();
					UWP.navigate(UWP.config.home);
				});
				UWP.updateNavigation();
				UWP.removeUWPLoading();
			}

			var URL = ""
				.concat(UWP.config.includes, "/")
				.concat(target, ".html");
			var UWP_navigate_request = root.XMLHttpRequest
				? new XMLHttpRequest()
				: new ActiveXObject("Microsoft.XMLHTTP");
			UWP_navigate_request.overrideMimeType("text/html;charset=utf-8");
			UWP_navigate_request.open("GET", URL, true);
			UWP_navigate_request.withCredentials = false;

			UWP_navigate_request.onreadystatechange = function() {
				if (
					UWP_navigate_request.status === 404 ||
					UWP_navigate_request.status === 0
				) {
					console.log(
						"Error XMLHttpRequest-ing file",
						UWP_navigate_request.status
					);
					console.error(UWP.config.errorTitle);
					displayError(
						UWP.config.errorTitle,
						UWP.config.errorLinkText
					);
				} else if (
					UWP_navigate_request.readyState === 4 &&
					UWP_navigate_request.status === 200 &&
					UWP_navigate_request.responseText
				) {
					var parsed = parseDomFromString(
						UWP_navigate_request.responseText
					);
					var page =
						parsed.getElementsByTagName("page-container")[0] || "";

					if (!page) {
						console.error(UWP.config.errorTitle);
						displayError(
							UWP.config.errorTitle,
							UWP.config.errorLinkText
						);
					}

					UWP.revealUWPLoading();
					var elTitle = page
						? page.getElementsByTagName("page-title")[0] || ""
						: "";
					var pageTitle = elTitle.textContent || "";
					var elBody = page
						? page.getElementsByTagName("page-content")[0] || ""
						: "";
					var pageBody = elBody.innerHTML || "";
					var pageIncludeScript = page
						? page.getElementsByTagName("include-script")[0] || ""
						: "";
					var pageIncludeStyle = page
						? page.getElementsByTagName("include-style")[0] || ""
						: "";
					/* UWP.main.innerHTML = ""; */

					removeChildren(UWP.main);
					UWP.main.innerHTML = pageBody;
					UWP.main.classList.remove("uwp-main--with-animation");

					(function() {
						return UWP.main.offsetWidth;
					})();

					UWP.main.classList.add("uwp-main--with-animation");
					UWP.pageTitle.innerHTML = pageTitle;
					document.title = ""
						.concat(pageTitle, " - ")
						.concat(UWP.config.pageTitle);

					if (pageIncludeScript) {
						var scriptName = pageIncludeScript.textContent;

						var _src = ""
							.concat(UWP.config.includeScript, "/")
							.concat(scriptName);

						removeJsCssFile(_src, "js");
						var script = document.createElement("script");
						script.setAttribute("src", _src);
						script.async = true;
						UWP.body.appendChild(script);
					}

					if (pageIncludeStyle) {
						var styleName = pageIncludeStyle.textContent;

						var _href = ""
							.concat(UWP.config.includeStyle, "/")
							.concat(styleName);

						removeJsCssFile(_href, "css");
						var link = document.createElement("link");
						link.setAttribute("href", _href);
						link.setAttribute("property", "stylesheet");
						link.rel = "stylesheet";
						link.media = "all";
						UWP.body.appendChild(link);
					}

					if (
						UWP.config.onPageLoad &&
						"function" === typeof UWP.config.onPageLoad
					) {
						UWP.config.onPageLoad();
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

/*!
 * Macy.js - v2.3.1
 * @see {@link https://github.com/bigbitecreative/macy.js}
 * passes jshint
 */
(function(global, factory) {
	if (
		(typeof exports === "undefined" ? "undefined" : _typeof(exports)) ===
			"object" &&
		typeof module !== "undefined"
	) {
		module.exports = factory();
	} else if (typeof define === "function" && define.amd) {
		define(factory);
	} else {
		global.Macy = factory();
	}
})("undefined" !== typeof window ? window : this, function() {
	"use strict";

	var $e = function $e(parameter, context) {
		if (!(this instanceof $e)) {
			return new $e(parameter, context);
		}

		parameter = parameter.replace(/^\s*/, "").replace(/\s*$/, "");

		if (context) {
			return this.byCss(parameter, context);
		}

		for (var key in this.selectors) {
			if (this.selectors.hasOwnProperty(key)) {
				context = key.split("/");

				if (new RegExp(context[1], context[2]).test(parameter)) {
					return this.selectors[key](parameter);
				}
			}
		}

		return this.byCss(parameter);
	};

	$e.prototype.byCss = function(parameter, context) {
		return (context || document).querySelectorAll(parameter);
	};

	$e.prototype.selectors = {};

	$e.prototype.selectors[/^\.[\w\-]+$/] = function(param) {
		return document.getElementsByClassName(param.substring(1));
	};

	$e.prototype.selectors[/^\w+$/] = function(param) {
		return document.getElementsByTagName(param);
	};

	$e.prototype.selectors[/^\#[\w\-]+$/] = function(param) {
		return document.getElementById(param.substring(1));
	};

	function wait(func, delta) {
		var to = void 0;
		return function() {
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
		var events =
			arguments.length > 0 && arguments[0] !== undefined
				? arguments[0]
				: false;
		this.running = false;
		this.events = [];
		this.add(events);
	};

	Queue.prototype.run = function() {
		if (!this.running && this.events.length > 0) {
			var fn = this.events.shift();
			this.running = true;
			fn();
			this.running = false;
			this.run();
		}
	};

	Queue.prototype.add = function() {
		var _this = this;

		var event =
			arguments.length > 0 && arguments[0] !== undefined
				? arguments[0]
				: false;

		if (!event) {
			return false;
		}

		if (Array.isArray(event)) {
			return foreach(event, function(evt) {
				return _this.add(evt);
			});
		}

		this.events.push(event);
		this.run();
	};

	Queue.prototype.clear = function() {
		this.events = [];
	};

	var Event = function Event(instance) {
		var data =
			arguments.length > 1 && arguments[1] !== undefined
				? arguments[1]
				: {};
		this.instance = instance;
		this.data = data;
		return this;
	};

	var EventManager = function EventManager() {
		var instance =
			arguments.length > 0 && arguments[0] !== undefined
				? arguments[0]
				: false;
		this.events = {};
		this.instance = instance;
	};

	EventManager.prototype.on = function() {
		var key =
			arguments.length > 0 && arguments[0] !== undefined
				? arguments[0]
				: false;
		var func =
			arguments.length > 1 && arguments[1] !== undefined
				? arguments[1]
				: false;

		if (!key || !func) {
			return false;
		}

		if (!Array.isArray(this.events[key])) {
			this.events[key] = [];
		}

		return this.events[key].push(func);
	};

	EventManager.prototype.emit = function() {
		var key =
			arguments.length > 0 && arguments[0] !== undefined
				? arguments[0]
				: false;
		var data =
			arguments.length > 1 && arguments[1] !== undefined
				? arguments[1]
				: {};

		if (!key || !Array.isArray(this.events[key])) {
			return false;
		}

		var evt = new Event(this.instance, data);
		foreach(this.events[key], function(fn) {
			return fn(evt);
		});
	};

	var imageHasLoaded = function imageHasLoaded(img) {
		return (
			!(
				"naturalHeight" in img &&
				img.naturalHeight + img.naturalWidth === 0
			) || img.width + img.height !== 0
		);
	};

	var promise = function promise(ctx, image) {
		var emitOnLoad =
			arguments.length > 2 && arguments[2] !== undefined
				? arguments[2]
				: false;
		return new Promise(function(resolve, reject) {
			if (image.complete) {
				if (!imageHasLoaded(image)) {
					return reject(image);
				}

				return resolve(image);
			}

			image.addEventListener("load", function() {
				if (imageHasLoaded(image)) {
					return resolve(image);
				}

				return reject(image);
			});
			image.addEventListener("error", function() {
				return reject(image);
			});
		})
			.then(function(img) {
				if (emitOnLoad) {
					ctx.emit(ctx.constants.EVENT_IMAGE_LOAD, {
						img: img
					});
				}
			})
			.catch(function(img) {
				return ctx.emit(ctx.constants.EVENT_IMAGE_ERROR, {
					img: img
				});
			});
	};

	var getImagePromises = function getImagePromises(ctx, images) {
		var emitOnLoad =
			arguments.length > 2 && arguments[2] !== undefined
				? arguments[2]
				: false;
		return map(images, function(image) {
			return promise(ctx, image, emitOnLoad);
		});
	};

	var imageLoaderPromise = function imageLoaderPromise(ctx, images) {
		var emitOnLoad =
			arguments.length > 2 && arguments[2] !== undefined
				? arguments[2]
				: false;
		return Promise.all(getImagePromises(ctx, images, emitOnLoad)).then(
			function() {
				ctx.emit(ctx.constants.EVENT_IMAGE_COMPLETE);
			}
		);
	};

	function imagesLoadedNew(ctx, imgs) {
		var during =
			arguments.length > 2 && arguments[2] !== undefined
				? arguments[2]
				: false;
		imageLoaderPromise(ctx, imgs, during);
	}

	var createResizeEvent = function createResizeEvent(ctx) {
		return wait(function() {
			ctx.emit(ctx.constants.EVENT_RESIZE);
			ctx.queue.add(function() {
				return ctx.recalculate(true, true);
			});
		}, 100);
	};

	var setupContainer = function setupContainer(ctx) {
		ctx.container = $e(ctx.options.container);

		if (ctx.container instanceof $e || !ctx.container) {
			return ctx.options.debug
				? console.error("Error: Container not found")
				: false;
		}

		delete ctx.options.container;

		if (ctx.container.length) {
			ctx.container = ctx.container[0];
		}

		ctx.container.style.position = "relative";
	};

	var setupState = function setupState(ctx) {
		ctx.queue = new Queue();
		ctx.events = new EventManager(ctx);
		ctx.rows = [];
		ctx.resizer = createResizeEvent(ctx);
	};

	var setupEventListeners = function setupEventListeners(ctx) {
		var imgs = $e("img", ctx.container);
		window.addEventListener("resize", ctx.resizer);
		ctx.on(ctx.constants.EVENT_IMAGE_LOAD, function() {
			return ctx.recalculate(false, false);
		});
		ctx.on(ctx.constants.EVENT_IMAGE_COMPLETE, function() {
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
		return (
			obj === Object(obj) &&
			Object.prototype.toString.call(obj) !== "[object Array]"
		);
	};

	var replaceOptionsResponsively = function replaceOptionsResponsively(
		tempOpts,
		responsiveOptions
	) {
		if (!isObject(tempOpts)) {
			responsiveOptions.columns = tempOpts;
		}

		if (isObject(tempOpts) && tempOpts.columns) {
			responsiveOptions.columns = tempOpts.columns;
		}

		if (
			isObject(tempOpts) &&
			tempOpts.margin &&
			!isObject(tempOpts.margin)
		) {
			responsiveOptions.margin = {
				x: tempOpts.margin,
				y: tempOpts.margin
			};
		}

		if (
			isObject(tempOpts) &&
			tempOpts.margin &&
			isObject(tempOpts.margin) &&
			tempOpts.margin.x
		) {
			responsiveOptions.margin.x = tempOpts.margin.x;
		}

		if (
			isObject(tempOpts) &&
			tempOpts.margin &&
			isObject(tempOpts.margin) &&
			tempOpts.margin.y
		) {
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
		var noOfColumns = getResponsiveOptions(options).columns;
		return noOfColumns;
	}

	function getCurrentMargin(options) {
		var margin = getResponsiveOptions(options).margin;
		return margin;
	}

	function getWidths(options) {
		var marginsIncluded =
			arguments.length > 1 && arguments[1] !== undefined
				? arguments[1]
				: true;
		var noOfColumns = getCurrentColumns(options);
		var margins = getCurrentMargin(options).x;
		var width = 100 / noOfColumns;

		if (!marginsIncluded) {
			return width;
		}

		if (noOfColumns === 1) {
			return "100%";
		}

		margins = ((noOfColumns - 1) * margins) / noOfColumns;
		return "calc(" + width + "% - " + margins + "px)";
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

		baseMargin = getCurrentMargin(ctx.options).x;
		margin =
			(baseMargin - ((noOfColumns - 1) * baseMargin) / noOfColumns) *
			(col - 1);
		totalLeft += getWidths(ctx.options, false) * (col - 1);
		str = "calc(" + totalLeft + "% + " + margin + "px)";
		return str;
	}

	function setContainerHeight(ctx) {
		var largest = 0;
		var container = ctx.container,
			rows = ctx.rows;
		foreach(rows, function(row) {
			largest = row > largest ? row : largest;
		});
		container.style.height = largest + "px";
	}

	var prop = function prop(element, property) {
		return window
			.getComputedStyle(element, null)
			.getPropertyValue(property);
	};

	var setUpRows = function setUpRows(ctx, cols) {
		var refresh =
			arguments.length > 2 && arguments[2] !== undefined
				? arguments[2]
				: false;

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
		var refresh =
			arguments.length > 2 && arguments[2] !== undefined
				? arguments[2]
				: false;
		var markasComplete =
			arguments.length > 3 && arguments[3] !== undefined
				? arguments[3]
				: true;
		var cols = getCurrentColumns(ctx.options);
		var margin = getCurrentMargin(ctx.options).y;
		setUpRows(ctx, cols, refresh);
		foreach($eles, function(ele) {
			var smallest = 0;
			var eleHeight = parseInt(ele.offsetHeight, 10);
			if (isNaN(eleHeight)) return;
			ctx.rows.forEach(function(v, k) {
				if (v < ctx.rows[smallest]) {
					smallest = k;
				}
			});
			ele.style.position = "absolute";
			ele.style.top = ctx.rows[smallest] + "px";
			ele.style.left = "" + ctx.cols[smallest];
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
		var refresh =
			arguments.length > 2 && arguments[2] !== undefined
				? arguments[2]
				: false;
		var markasComplete =
			arguments.length > 3 && arguments[3] !== undefined
				? arguments[3]
				: true;
		var cols = getCurrentColumns(ctx.options);
		var margin = getCurrentMargin(ctx.options).y;
		setUpRows(ctx, cols, refresh);
		foreach($eles, function(ele) {
			if (ctx.lastcol === cols) {
				ctx.lastcol = 0;
			}

			var eleHeight = prop(ele, "height");
			eleHeight = parseInt(ele.offsetHeight, 10);
			if (isNaN(eleHeight)) return;
			ele.style.position = "absolute";
			ele.style.top = ctx.rows[ctx.lastcol] + "px";
			ele.style.left = "" + ctx.cols[ctx.lastcol];
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
		var refresh =
			arguments.length > 1 && arguments[1] !== undefined
				? arguments[1]
				: false;
		var loaded =
			arguments.length > 2 && arguments[2] !== undefined
				? arguments[2]
				: true;
		var children = refresh
			? ctx.container.children
			: $e(':scope > *:not([data-macy-complete="1"])', ctx.container);
		var eleWidth = getWidths(ctx.options);
		foreach(children, function(child) {
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
			document.createElement("a").querySelector(":scope *");
		} catch (error) {
			(function() {
				var scope = /:scope\b/gi;
				var querySelectorWithScope = polyfill(
					Element.prototype.querySelector
				);

				Element.prototype.querySelector = function querySelector(
					selectors
				) {
					return querySelectorWithScope.apply(this, arguments);
				};

				var querySelectorAllWithScope = polyfill(
					Element.prototype.querySelectorAll
				);

				Element.prototype.querySelectorAll = function querySelectorAll(
					selectors
				) {
					return querySelectorAllWithScope.apply(this, arguments);
				};

				function polyfill(originalQuerySelector) {
					return function(selectors) {
						var hasScope = selectors && scope.test(selectors);

						if (hasScope) {
							var id = this.getAttribute("id");

							if (!id) {
								this.id =
									"q" +
									Math.floor(Math.random() * 9000000) +
									1000000;
							}

							arguments[0] = selectors.replace(
								scope,
								"#" + this.id
							);
							var elementOrNodeList = originalQuerySelector.apply(
								this,
								arguments
							);

							if (id === null) {
								this.removeAttribute("id");
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

	var _extends =
		Object.assign ||
		function(target) {
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
		var opts =
			arguments.length > 0 && arguments[0] !== undefined
				? arguments[0]
				: defaults;

		if (!(this instanceof Macy)) {
			return new Macy(opts);
		}

		this.options = {};

		_extends(this.options, defaults, opts);

		setup(this);
	};

	Macy.init = function(options) {
		console.warn(
			"Depreciated: Macy.init will be removed in v3.0.0 opt to use Macy directly like so Macy({ /*options here*/ }) "
		);
		return new Macy(options);
	};

	Macy.prototype.recalculateOnImageLoad = function() {
		var waitUntilFinish =
			arguments.length > 0 && arguments[0] !== undefined
				? arguments[0]
				: false;
		var imgs = $e("img", this.container);
		return imagesLoadedNew(this, imgs, !waitUntilFinish);
	};

	Macy.prototype.runOnImageLoad = function(func) {
		var everyLoad =
			arguments.length > 1 && arguments[1] !== undefined
				? arguments[1]
				: false;
		var imgs = $e("img", this.container);
		this.on(this.constants.EVENT_IMAGE_COMPLETE, func);

		if (everyLoad) {
			this.on(this.constants.EVENT_IMAGE_LOAD, func);
		}

		return imagesLoadedNew(this, imgs, everyLoad);
	};

	Macy.prototype.recalculate = function() {
		var _this = this;

		var refresh =
			arguments.length > 0 && arguments[0] !== undefined
				? arguments[0]
				: false;
		var loaded =
			arguments.length > 1 && arguments[1] !== undefined
				? arguments[1]
				: true;

		if (loaded) {
			this.queue.clear();
		}

		return this.queue.add(function() {
			return calculate(_this, refresh, loaded);
		});
	};

	Macy.prototype.remove = function() {
		window.removeEventListener("resize", this.resizer);
		foreach(this.container.children, function(child) {
			child.removeAttribute("data-macy-complete");
			child.removeAttribute("style");
		});
		this.container.removeAttribute("style");
	};

	Macy.prototype.reInit = function() {
		this.recalculate(true, true);
		this.emit(this.constants.EVENT_INITIALIZED);
		window.addEventListener("resize", this.resizer);
		this.container.style.position = "relative";
	};

	Macy.prototype.on = function(key, func) {
		this.events.on(key, func);
	};

	Macy.prototype.emit = function(key, data) {
		this.events.emit(key, data);
	};

	Macy.constants = {
		EVENT_INITIALIZED: "macy.initialized",
		EVENT_RECALCULATED: "macy.recalculated",
		EVENT_IMAGE_LOAD: "macy.image.load",
		EVENT_IMAGE_ERROR: "macy.image.error",
		EVENT_IMAGE_COMPLETE: "macy.images.complete",
		EVENT_RESIZE: "macy.resize"
	};
	Macy.prototype.constants = Macy.constants;
	return Macy;
});

/*!
 * @app ReadMoreJS
 * @desc Breaks the content of an element to the specified number of words
 * @version 1.0.0
 * @license The MIT License (MIT)
 * @author George Raptis | http://georap.gr
 * @see {@link https://github.com/georapbox/ReadMore.js/blob/master/src/readMoreJS.js}
 * changed: rmLink = doc.querySelectorAll('.rm-link');
 * to: rmLink = doc.querySelectorAll('.rm-link') || "";
 * changed: var target = doc.querySelectorAll(options.target)
 * to: var target = elementsSelector(options.target)
 */
(function(win, doc, undef) {
	"use strict";

	var RM = {};
	RM.helpers = {
		extendObj: function extendObj() {
			for (var i = 1, l = arguments.length; i < l; i += 1) {
				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {
						if (
							arguments[i][key] &&
							arguments[i][key].constructor &&
							arguments[i][key].constructor === Object
						) {
							arguments[0][key] = arguments[0][key] || {};
							this.extendObj(
								arguments[0][key],
								arguments[i][key]
							);
						} else {
							arguments[0][key] = arguments[i][key];
						}
					}
				}
			}

			return arguments[0];
		}
	};

	RM.countWords = function(str) {
		return str.split(/\s+/).length;
	};

	RM.generateTrimmed = function(str, wordsNum) {
		return (
			str
				.split(/\s+/)
				.slice(0, wordsNum)
				.join(" ") + "..."
		);
	};

	RM.init = function(options) {
		var defaults = {
			target: "",
			numOfWords: 50,
			toggle: true,
			moreLink: "read more...",
			lessLink: "read less"
		};
		options = RM.helpers.extendObj({}, defaults, options);
		var target = doc.querySelectorAll(options.target),
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
			trimmedTargetContent = RM.generateTrimmed(
				targetContent,
				options.numOfWords
			);
			targetContentWords = RM.countWords(targetContent);
			initArr.push(targetContent);
			trimmedArr.push(trimmedTargetContent);

			if (options.numOfWords < targetContentWords - 1) {
				target[i].innerHTML = trimmedArr[i];

				if (options.inline) {
					moreContainer = doc.createElement("span");
				} else {
					if (options.customBlockElement) {
						moreContainer = doc.createElement(
							options.customBlockElement
						);
					} else {
						moreContainer = doc.createElement("div");
					}
				}

				moreContainer.innerHTML =
					'<a href="javascript:void(0);" id="rm-more_' +
					i +
					'" class="rm-link" style="cursor:pointer;">' +
					options.moreLink +
					"</a>";

				if (options.inline) {
					target[i].appendChild(moreContainer);
				} else {
					target[i].parentNode.insertBefore(
						moreContainer,
						target[i].nextSibling
					);
				}
			}
		}

		rmLink = doc.querySelectorAll(".rm-link") || "";

		var func = function func() {
			moreLinkID = this.getAttribute("id");
			index = moreLinkID.split("_")[1];

			if (this.getAttribute("data-clicked") !== "true") {
				target[index].innerHTML = initArr[index];

				if (options.toggle !== false) {
					this.innerHTML = options.lessLink;
					this.setAttribute("data-clicked", true);
				} else {
					this.innerHTML = "";
				}
			} else {
				target[index].innerHTML = trimmedArr[index];
				this.innerHTML = options.moreLink;
				this.setAttribute("data-clicked", false);
			}
		};

		for (j = 0, l = rmLink.length; j < l; j++) {
			rmLink[j].onclick = func;
		}
	};

	window.$readMoreJS = RM;
})("undefined" !== typeof window ? window : this, document);

/*!
 * A small javascript library for ripples
 * /Written by Aaron Längert
 * @see {@link https://github.com/SirBaaron/ripple-js}
 * replaced eval with workaround
 * moved functions away from for loop
 * == to ===
 * added is binded ripple class to avoid multiple assignments
 * moved some functions higher
 * passes jshint
 */
(function(root, document) {
	"use strict";

	var ripple = (function() {
		function getRippleContainer(el) {
			var childs = el.childNodes;

			for (var ii = 0; ii < childs.length; ii++) {
				try {
					/* if (childs[ii].className.indexOf("rippleContainer") > -1) { */
					if (childs[ii].classList.contains("rippleContainer")) {
						return childs[ii];
					}
				} catch (err) {}
			}

			return el;
		}

		function rippleStart(e) {
			var rippleContainer = getRippleContainer(e.target);
			/* if ((rippleContainer.getAttribute("animating") === "0" || !rippleContainer.hasAttribute("animating")) && e.target.className.indexOf("ripple") > -1) { */

			if (
				(rippleContainer.getAttribute("animating") === "0" ||
					!rippleContainer.hasAttribute("animating")) &&
				e.target.classList.contains("ripple")
			) {
				rippleContainer.setAttribute("animating", "1");
				var offsetX =
					typeof e.offsetX === "number"
						? e.offsetX
						: e.touches[0].clientX -
						  e.target.getBoundingClientRect().left;
				var offsetY =
					typeof e.offsetY === "number"
						? e.offsetY
						: e.touches[0].clientY -
						  e.target.getBoundingClientRect().top;
				var fullCoverRadius = Math.max(
					Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
					Math.sqrt(
						Math.pow(e.target.clientWidth - offsetX, 2) +
							Math.pow(e.target.clientHeight - offsetY, 2)
					),
					Math.sqrt(
						Math.pow(offsetX, 2) +
							Math.pow(e.target.clientHeight - offsetY, 2)
					),
					Math.sqrt(
						Math.pow(offsetY, 2) +
							Math.pow(e.target.clientWidth - offsetX, 2)
					)
				);
				var expandTime =
					e.target.getAttribute("ripple-press-expand-time") || 3;
				rippleContainer.style.transition =
					"transform " +
					expandTime +
					"s ease-out, box-shadow 0.1s linear";
				rippleContainer.style.background =
					e.target.getAttribute("ripple-color") || "white";
				rippleContainer.style.opacity =
					e.target.getAttribute("ripple-opacity") || "0.6";
				rippleContainer.style.boxShadow =
					e.target.getAttribute("ripple-shadow") || "none";
				rippleContainer.style.top = offsetY + "px";
				rippleContainer.style.left = offsetX + "px";
				rippleContainer.style.transform =
					"translate(-50%, -50%) scale(" +
					fullCoverRadius / 100 +
					")";
			}
		}

		function rippleEnd(e) {
			var rippleContainer = getRippleContainer(e.target);

			if (rippleContainer.getAttribute("animating") === "1") {
				rippleContainer.setAttribute("animating", "2");
				var background = root
					.getComputedStyle(rippleContainer, null)
					.getPropertyValue("background");
				var destinationRadius =
					e.target.clientWidth + e.target.clientHeight;
				rippleContainer.style.transition = "none";
				var expandTime =
					e.target.getAttribute("ripple-release-expand-time") || 0.4;
				rippleContainer.style.transition =
					"transform " +
					expandTime +
					"s linear, background " +
					expandTime +
					"s linear, opacity " +
					expandTime +
					"s ease-in-out";
				rippleContainer.style.transform =
					"translate(-50%, -50%) scale(" +
					destinationRadius / 100 +
					")";
				rippleContainer.style.background =
					"radial-gradient(transparent 10%, " + background + " 40%)";
				rippleContainer.style.opacity = "0";
				e.target.dispatchEvent(
					new CustomEvent("ripple-button-click", {
						target: e.target
					})
				);
				var Fn = Function;
				new Fn("" + e.target.getAttribute("onrippleclick")).call(root);
			}
		}

		function rippleRetrieve(e) {
			var rippleContainer = getRippleContainer(e.target);

			if (
				rippleContainer.style.transform ===
				"translate(-50%, -50%) scale(0)"
			) {
				rippleContainer.setAttribute("animating", "0");
			}

			if (rippleContainer.getAttribute("animating") === "1") {
				rippleContainer.setAttribute("animating", "3");
				var collapseTime =
					e.target.getAttribute("ripple-leave-collapse-time") || 0.4;
				rippleContainer.style.transition =
					"transform " +
					collapseTime +
					"s linear, box-shadow " +
					collapseTime +
					"s linear";
				rippleContainer.style.boxShadow = "none";
				rippleContainer.style.transform =
					"translate(-50%, -50%) scale(0)";
			}
		}

		var ripple = {
			registerRipples: function registerRipples() {
				var rippleButtons = document.getElementsByClassName("ripple");
				var i;

				var fn1 = function fn1() {
					rippleButtons[i].addEventListener(
						"touchstart",
						function(e) {
							rippleStart(e);
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"touchmove",
						function(e) {
							if (
								e.target.hasAttribute("ripple-cancel-on-move")
							) {
								rippleRetrieve(e);
								return;
							}

							var overEl;

							try {
								/* overEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).className.indexOf("ripple") >= 0; */
								overEl = document
									.elementFromPoint(
										e.touches[0].clientX,
										e.touches[0].clientY
									)
									.classList.contains("ripple");
							} catch (err) {
								overEl = false;
							}

							if (!overEl) {
								rippleRetrieve(e);
							}
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"touchend",
						function(e) {
							rippleEnd(e);
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"mousedown",
						function(e) {
							rippleStart(e);
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"mouseup",
						function(e) {
							rippleEnd(e);
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"mousemove",
						function(e) {
							if (
								e.target.hasAttribute(
									"ripple-cancel-on-move"
								) &&
								(e.movementX !== 0 || e.movementY !== 0)
							) {
								rippleRetrieve(e);
							}
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"mouseleave",
						function(e) {
							rippleRetrieve(e);
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"transitionend",
						function(e) {
							if (
								e.target.getAttribute("animating") === "2" ||
								e.target.getAttribute("animating") === "3"
							) {
								e.target.style.transition = "none";
								e.target.style.transform =
									"translate(-50%, -50%) scale(0)";
								e.target.style.boxShadow = "none";
								e.target.setAttribute("animating", "0");
							}
						},
						{
							passive: true
						}
					);

					if (
						getRippleContainer(rippleButtons[i]) ===
						rippleButtons[i]
					) {
						rippleButtons[i].innerHTML +=
							'<div class="rippleContainer"></div>';
					}
				};

				var isBindedRippleClass = "ripple--is-binded";

				for (i = 0; i < rippleButtons.length; i++) {
					if (
						!rippleButtons[i].classList.contains(
							isBindedRippleClass
						)
					) {
						rippleButtons[i].classList.add(isBindedRippleClass);
						fn1();
					}
				}
			},
			ripple: function ripple(el) {
				/* if (el.className.indexOf("ripple") < 0) { */
				if (!el.classList.contains("ripple")) {
					return;
				}

				var rect = el.getBoundingClientRect();
				var e = {
					target: el,
					offsetX: rect.width / 2,
					offsetY: rect.height / 2
				};
				rippleStart(e);
				rippleEnd(e);
			}
		};
		/* root.addEventListener("load", function () { */

		var css = document.createElement("style");
		css.type = "text/css";
		css.innerHTML =
			".ripple { overflow: hidden !important; position: relative; } .ripple .rippleContainer { display: block; height: 200px !important; width: 200px !important; padding: 0px 0px 0px 0px; border-radius: 50%; position: absolute !important; top: 0px; left: 0px; transform: translate(-50%, -50%) scale(0); -webkit-transform: translate(-50%, -50%) scale(0); -ms-transform: translate(-50%, -50%) scale(0); background-color: transparent; } .ripple * {pointer-events: none !important;}";
		document.head.appendChild(css);
		ripple.registerRipples();
		/* }); */

		return ripple;
	})();

	root.ripple = ripple;
})("undefined" !== typeof window ? window : this, document);

/*!
 * @see {@link https://github.com/englishextra/iframe-lightbox}
 * modified Simple lightbox effect in pure JS
 * @see {@link https://github.com/squeral/lightbox}
 * @see {@link https://github.com/squeral/lightbox/blob/master/lightbox.js}
 * @params {Object} elem Node element
 * @params {Object} settings object
 * el.lightbox = new IframeLightbox(elem, settings)
 * passes jshint
 */

/*jshint -W014 */
(function(root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docBody = document.body || "";
	var containerClass = "iframe-lightbox";
	var iframeLightboxWindowIsBindedClass = "iframe-lightbox-window--is-binded";
	var iframeLightboxOpenClass = "iframe-lightbox--open";
	var iframeLightboxLinkIsBindedClass = "iframe-lightbox-link--is-binded";
	var isLoadedClass = "is-loaded";
	var isOpenedClass = "is-opened";
	var isShowingClass = "is-showing";
	var isMobile = navigator.userAgent.match(
		/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i
	);
	var isTouch =
		isMobile !== null ||
		document.createTouch !== undefined ||
		"ontouchstart" in root ||
		"onmsgesturechange" in root ||
		navigator.msMaxTouchPoints;

	var IframeLightbox = function IframeLightbox(elem, settings) {
		var options = settings || {};
		this.trigger = elem;
		this.el = document.getElementsByClassName(containerClass)[0] || "";
		this.body = this.el ? this.el.getElementsByClassName("body")[0] : "";
		this.content = this.el
			? this.el.getElementsByClassName("content")[0]
			: "";
		this.src = elem.dataset.src || "";
		this.href = elem.getAttribute("href") || "";
		this.dataPaddingBottom = elem.dataset.paddingBottom || "";
		this.dataScrolling = elem.dataset.scrolling || "";
		this.dataTouch = elem.dataset.touch || "";
		this.rate = options.rate || 500;
		this.scrolling = options.scrolling;
		this.touch = options.touch;
		this.onOpened = options.onOpened;
		this.onIframeLoaded = options.onIframeLoaded;
		this.onLoaded = options.onLoaded;
		this.onCreated = options.onCreated;
		this.onClosed = options.onClosed;
		this.init();
	};

	IframeLightbox.prototype.init = function() {
		var _this = this;

		if (!this.el) {
			this.create();
		}

		var debounce = function debounce(func, wait) {
			var timeout, args, context, timestamp;
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

		var logic = function logic() {
			_this.open();
		};

		var handleIframeLightboxLink = function handleIframeLightboxLink(e) {
			e.stopPropagation();
			e.preventDefault();
			debounce(logic, this.rate).call();
		};

		if (
			!this.trigger.classList.contains(iframeLightboxLinkIsBindedClass)
		) {
			this.trigger.classList.add(iframeLightboxLinkIsBindedClass);

			this.trigger.addEventListener("click", handleIframeLightboxLink);

			if (isTouch && (_this.touch || _this.dataTouch)) {
				this.trigger.addEventListener(
					"touchstart",
					handleIframeLightboxLink
				);
			}
		}
	};

	IframeLightbox.prototype.create = function() {
		var _this = this,
			backdrop = document.createElement("div");

		backdrop.classList.add("backdrop");
		this.el = document.createElement("div");
		this.el.classList.add(containerClass);
		this.el.appendChild(backdrop);
		this.content = document.createElement("div");
		this.content.classList.add("content");
		this.body = document.createElement("div");
		this.body.classList.add("body");
		this.content.appendChild(this.body);
		this.contentHolder = document.createElement("div");
		this.contentHolder.classList.add("content-holder");
		this.contentHolder.appendChild(this.content);
		this.el.appendChild(this.contentHolder);
		this.btnClose = document.createElement("a");
		this.btnClose.classList.add("btn-close");
		/* jshint -W107 */

		this.btnClose.setAttribute("href", "javascript:void(0);");
		/* jshint +W107 */

		this.el.appendChild(this.btnClose);
		docBody.appendChild(this.el);

		backdrop.addEventListener("click", function() {
			_this.close();
		});

		this.btnClose.addEventListener("click", function() {
			_this.close();
		});

		if (!docElem.classList.contains(iframeLightboxWindowIsBindedClass)) {
			docElem.classList.add(iframeLightboxWindowIsBindedClass);
			addListener(root, "keyup", function(ev) {
				if (27 === (ev.which || ev.keyCode)) {
					_this.close();
				}
			});
		}

		var clearBody = function clearBody() {
			if (_this.isOpen()) {
				return;
			}

			_this.el.classList.remove(isShowingClass);

			_this.body.innerHTML = "";
		};

		this.el.addEventListener("transitionend", clearBody, false);

		this.el.addEventListener("webkitTransitionEnd", clearBody, false);

		this.el.addEventListener("mozTransitionEnd", clearBody, false);

		this.el.addEventListener("msTransitionEnd", clearBody, false);

		this.callCallback(this.onCreated, this);
	};

	IframeLightbox.prototype.loadIframe = function() {
		var _this = this;

		this.iframeId = containerClass + Date.now();
		this.iframeSrc = this.src || this.href || "";
		var html = [];
		html.push(
			'<iframe src="' +
				this.iframeSrc +
				'" name="' +
				this.iframeId +
				'" id="' +
				this.iframeId +
				'" onload="this.style.opacity=1;" style="opacity:0;border:none;" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" height="166" frameborder="no"></iframe>'
		);
		html.push(
			'<div class="half-circle-spinner"><div class="circle circle-1"></div><div class="circle circle-2"></div></div>'
		);
		this.body.innerHTML = html.join("");

		(function(iframeId, body) {
			var iframe = document.getElementById(iframeId);

			iframe.onload = function() {
				this.style.opacity = 1;
				body.classList.add(isLoadedClass);

				if (_this.scrolling || _this.dataScrolling) {
					iframe.removeAttribute("scrolling");
					iframe.style.overflow = "scroll";
				} else {
					iframe.setAttribute("scrolling", "no");
					iframe.style.overflow = "hidden";
				}

				_this.callCallback(_this.onIframeLoaded, _this);

				_this.callCallback(_this.onLoaded, _this);
			};
		})(this.iframeId, this.body);
	};

	IframeLightbox.prototype.open = function() {
		this.loadIframe();

		if (this.dataPaddingBottom) {
			this.content.style.paddingBottom = this.dataPaddingBottom;
		} else {
			this.content.removeAttribute("style");
		}

		this.el.classList.add(isShowingClass);
		this.el.classList.add(isOpenedClass);
		docElem.classList.add(iframeLightboxOpenClass);
		docBody.classList.add(iframeLightboxOpenClass);
		this.callCallback(this.onOpened, this);
	};

	IframeLightbox.prototype.close = function() {
		this.el.classList.remove(isOpenedClass);
		this.body.classList.remove(isLoadedClass);
		docElem.classList.remove(iframeLightboxOpenClass);
		docBody.classList.remove(iframeLightboxOpenClass);
		this.callCallback(this.onClosed, this);
	};

	IframeLightbox.prototype.isOpen = function() {
		return this.el.classList.contains(isOpenedClass);
	};

	IframeLightbox.prototype.callCallback = function(func, data) {
		if (typeof func !== "function") {
			return;
		}

		var caller = func.bind(this);
		caller(data);
	};

	root.IframeLightbox = IframeLightbox;
})("undefined" !== typeof window ? window : this, document);

/*!
 * @see {@link https://github.com/englishextra/img-lightbox}
 * imgLightbox
 * requires this very img-lightbox.js, and animate.css, img-lightbox.css
 * @params {String} linkClass
 * @params {Object} settings object
 * imgLightbox(linkClass, settings)
 * passes jshint
 */

/*jshint -W014 */
(function(root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docBody = document.body || "";
	var animatedClass = "animated";
	var btnCloseClass = "btn-close";
	var containerClass = "img-lightbox";
	var fadeInClass = "fadeIn";
	var fadeInUpClass = "fadeInUp";
	var fadeOutClass = "fadeOut";
	var fadeOutDownClass = "fadeOutDown";
	var imgLightboxWindowIsBindedClass = "img-lightbox-window--is-binded";
	var imgLightboxOpenClass = "img-lightbox--open";
	var imgLightboxLinkIsBindedClass = "img-lightbox-link--is-binded";
	var isLoadedClass = "is-loaded";
	var dummySrc =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
	var isMobile = navigator.userAgent.match(
		/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i
	);
	var isTouch =
		isMobile !== null ||
		document.createTouch !== undefined ||
		"ontouchstart" in root ||
		"onmsgesturechange" in root ||
		navigator.msMaxTouchPoints;

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

	var callCallback = function callCallback(func, data) {
		if (typeof func !== "function") {
			return;
		}

		var caller = func.bind(this);
		caller(data);
	};

	var setDisplayBlock = function (e) {
		if (e) {
			e.style.display = "block";
		}
	};

	var setDisplayNone = function (e) {
		if (e) {
			e.style.display = "none";
		}
	};

	var hideImgLightbox = function hideImgLightbox(callback) {
		var container =
			document.getElementsByClassName(containerClass)[0] || "";
		var img = container
			? container.getElementsByTagName("img")[0] || ""
			: "";

		var hideContainer = function hideContainer() {
			container.classList.remove(fadeInClass);
			container.classList.add(fadeOutClass);

			var hideImg = function hideImg() {
				container.classList.remove(animatedClass);
				container.classList.remove(fadeOutClass);
				img.classList.remove(animatedClass);
				img.classList.remove(fadeOutDownClass);

				img.onload = function() {
					container.classList.remove(isLoadedClass);
				};

				img.src = dummySrc;
				setDisplayNone(container);
				callCallback(callback, root);
			};

			var timer = setTimeout(function() {
				clearTimeout(timer);
				timer = null;
				hideImg();
			}, 400);
		};

		if (container && img) {
			img.classList.remove(fadeInUpClass);
			img.classList.add(fadeOutDownClass);
			var timer = setTimeout(function() {
				clearTimeout(timer);
				timer = null;
				hideContainer();
			}, 400);
		}

		docElem.classList.remove(imgLightboxOpenClass);
		docBody.classList.remove(imgLightboxOpenClass);
	};

	var imgLightbox = function imgLightbox(linkClass, settings) {
		var _linkClass = linkClass || "";

		var options = settings || {};
		var rate = options.rate || 500;
		var touch = options.touch;
		var onError = options.onError;
		var onLoaded = options.onLoaded;
		var onCreated = options.onCreated;
		var onClosed = options.onClosed;
		var link = document.getElementsByClassName(_linkClass) || "";
		var container =
			document.getElementsByClassName(containerClass)[0] || "";
		var img = container
			? container.getElementsByTagName("img")[0] || ""
			: "";

		if (!container) {
			container = document.createElement("div");
			container.classList.add(containerClass);
			var html = [];
			html.push('<img src="' + dummySrc + '" alt="" />');
			html.push(
				'<div class="half-circle-spinner"><div class="circle circle-1"></div><div class="circle circle-2"></div></div>'
			);
			html.push('<a href="javascript:void(0);" class="btn-close"></a>');
			container.innerHTML = html.join("");
			docBody.appendChild(container);
			img = container
				? container.getElementsByTagName("img")[0] || ""
				: "";
			var btnClose = container
				? container.getElementsByClassName(btnCloseClass)[0] || ""
				: "";

			var handleImgLightboxContainer = function handleImgLightboxContainer() {
				hideImgLightbox(onClosed);
			};

			container.addEventListener("click", handleImgLightboxContainer);

			btnClose.addEventListener("click", handleImgLightboxContainer);

			if (!docElem.classList.contains(imgLightboxWindowIsBindedClass)) {
				docElem.classList.add(imgLightboxWindowIsBindedClass);
				addListener(root, "keyup", function(ev) {
					if (27 === (ev.which || ev.keyCode)) {
						hideImgLightbox(onClosed);
					}
				});
			}
		}

		var arrange = function arrange(e) {
			var hrefString =
				e.getAttribute("href") || e.getAttribute("data-src") || "";
			var dataTouch = e.getAttribute("data-touch") || "";

			if (!hrefString) {
				return;
			}

			var handleImgLightboxLink = function handleImgLightboxLink(ev) {
				ev.stopPropagation();
				ev.preventDefault();
				docElem.classList.add(imgLightboxOpenClass);
				docBody.classList.add(imgLightboxOpenClass);
				container.classList.remove(isLoadedClass);

				var logic = function logic() {
					if (onCreated) {
						callCallback(onCreated, root);
					}

					container.classList.add(animatedClass);
					container.classList.add(fadeInClass);
					img.classList.add(animatedClass);
					img.classList.add(fadeInUpClass);

					img.onload = function() {
						container.classList.add(isLoadedClass);

						if (onLoaded) {
							callCallback(onLoaded, root);
						}
					};

					img.onerror = function() {
						if (onError) {
							callCallback(onError, root);
						}
					};

					img.src = hrefString;
					setDisplayBlock(container);
				};

				debounce(logic, rate).call();
			};

			if (!e.classList.contains(imgLightboxLinkIsBindedClass)) {
				e.classList.add(imgLightboxLinkIsBindedClass);

				e.addEventListener("click", handleImgLightboxLink);

				if (isTouch && (touch || dataTouch)) {
					e.addEventListener("touchstart", handleImgLightboxLink);
				}
			}
		};

		if (container && img && link) {
			var i, l;

			for (i = 0, l = link.length; i < l; i += 1) {
				arrange(link[i]);
			}

			i = l = null;
		}
	};

	root.imgLightbox = imgLightbox;
})("undefined" !== typeof window ? window : this, document);

/*!
 * modified qr.js -- QR code generator in Javascript (revision 2011-01-19)
 * Written by Kang Seonghoon <public+qrjs@mearie.org>.
 * v0.0.20110119
 * This source code is in the public domain; if your jurisdiction does not
 * recognize the public domain the terms of Creative Commons CC0 license
 * apply. In the other words, you can always do what you want.
 * added options properties: fillcolor and textcolor
 * svg now works in Edge 13 and IE 11
 * @see {@link https://gist.github.com/englishextra/b46969e3382ef737c611bb59d837220b}
 * @see {@link https://github.com/lifthrasiir/qr.js/blob/v0.0.20110119/qr.js}
 * passes jshint with suppressing comments
 */

/*jshint bitwise: false */
(function(root, document) {
	"use strict";

	var length = "length";
	var VERSIONS = [
		null,
		[[10, 7, 17, 13], [1, 1, 1, 1], []],
		[[16, 10, 28, 22], [1, 1, 1, 1], [4, 16]],
		[[26, 15, 22, 18], [1, 1, 2, 2], [4, 20]],
		[[18, 20, 16, 26], [2, 1, 4, 2], [4, 24]],
		[[24, 26, 22, 18], [2, 1, 4, 4], [4, 28]],
		[[16, 18, 28, 24], [4, 2, 4, 4], [4, 32]],
		[[18, 20, 26, 18], [4, 2, 5, 6], [4, 20, 36]],
		[[22, 24, 26, 22], [4, 2, 6, 6], [4, 22, 40]],
		[[22, 30, 24, 20], [5, 2, 8, 8], [4, 24, 44]],
		[[26, 18, 28, 24], [5, 4, 8, 8], [4, 26, 48]],
		[[30, 20, 24, 28], [5, 4, 11, 8], [4, 28, 52]],
		[[22, 24, 28, 26], [8, 4, 11, 10], [4, 30, 56]],
		[[22, 26, 22, 24], [9, 4, 16, 12], [4, 32, 60]],
		[[24, 30, 24, 20], [9, 4, 16, 16], [4, 24, 44, 64]],
		[[24, 22, 24, 30], [10, 6, 18, 12], [4, 24, 46, 68]],
		[[28, 24, 30, 24], [10, 6, 16, 17], [4, 24, 48, 72]],
		[[28, 28, 28, 28], [11, 6, 19, 16], [4, 28, 52, 76]],
		[[26, 30, 28, 28], [13, 6, 21, 18], [4, 28, 54, 80]],
		[[26, 28, 26, 26], [14, 7, 25, 21], [4, 28, 56, 84]],
		[[26, 28, 28, 30], [16, 8, 25, 20], [4, 32, 60, 88]],
		[[26, 28, 30, 28], [17, 8, 25, 23], [4, 26, 48, 70, 92]],
		[[28, 28, 24, 30], [17, 9, 34, 23], [4, 24, 48, 72, 96]],
		[[28, 30, 30, 30], [18, 9, 30, 25], [4, 28, 52, 76, 100]],
		[[28, 30, 30, 30], [20, 10, 32, 27], [4, 26, 52, 78, 104]],
		[[28, 26, 30, 30], [21, 12, 35, 29], [4, 30, 56, 82, 108]],
		[[28, 28, 30, 28], [23, 12, 37, 34], [4, 28, 56, 84, 112]],
		[[28, 30, 30, 30], [25, 12, 40, 34], [4, 32, 60, 88, 116]],
		[[28, 30, 30, 30], [26, 13, 42, 35], [4, 24, 48, 72, 96, 120]],
		[[28, 30, 30, 30], [28, 14, 45, 38], [4, 28, 52, 76, 100, 124]],
		[[28, 30, 30, 30], [29, 15, 48, 40], [4, 24, 50, 76, 102, 128]],
		[[28, 30, 30, 30], [31, 16, 51, 43], [4, 28, 54, 80, 106, 132]],
		[[28, 30, 30, 30], [33, 17, 54, 45], [4, 32, 58, 84, 110, 136]],
		[[28, 30, 30, 30], [35, 18, 57, 48], [4, 28, 56, 84, 112, 140]],
		[[28, 30, 30, 30], [37, 19, 60, 51], [4, 32, 60, 88, 116, 144]],
		[[28, 30, 30, 30], [38, 19, 63, 53], [4, 28, 52, 76, 100, 124, 148]],
		[[28, 30, 30, 30], [40, 20, 66, 56], [4, 22, 48, 74, 100, 126, 152]],
		[[28, 30, 30, 30], [43, 21, 70, 59], [4, 26, 52, 78, 104, 130, 156]],
		[[28, 30, 30, 30], [45, 22, 74, 62], [4, 30, 56, 82, 108, 134, 160]],
		[[28, 30, 30, 30], [47, 24, 77, 65], [4, 24, 52, 80, 108, 136, 164]],
		[[28, 30, 30, 30], [49, 25, 81, 68], [4, 28, 56, 84, 112, 140, 168]]
	];
	var MODE_TERMINATOR = 0;
	var MODE_NUMERIC = 1,
		MODE_ALPHANUMERIC = 2,
		MODE_OCTET = 4,
		MODE_KANJI = 8;
	var NUMERIC_REGEXP = /^\d*$/;
	var ALPHANUMERIC_REGEXP = /^[A-Za-z0-9 $%*+\-./:] * $ /;
	var ALPHANUMERIC_OUT_REGEXP = /^[A-Z0-9 $%*+\-./:] * $ /;
	var ECCLEVEL_L = 1,
		ECCLEVEL_M = 0,
		ECCLEVEL_Q = 3,
		ECCLEVEL_H = 2;
	var GF256_MAP = [],
		GF256_INVMAP = [-1];

	for (var i1 = 0, v = 1; i1 < 255; ++i1) {
		GF256_MAP.push(v);
		GF256_INVMAP[v] = i1;
		v = (v * 2) ^ (v >= 128 ? 0x11d : 0);
	}

	var GF256_GENPOLY = [[]];

	for (var i2 = 0; i2 < 30; ++i2) {
		var prevpoly = GF256_GENPOLY[i2],
			poly = [];

		for (var j1 = 0; j1 <= i2; ++j1) {
			var a = j1 < i2 ? GF256_MAP[prevpoly[j1]] : 0;
			var b = GF256_MAP[(i2 + (prevpoly[j1 - 1] || 0)) % 255];
			poly.push(GF256_INVMAP[a ^ b]);
		}

		GF256_GENPOLY.push(poly);
	}

	var ALPHANUMERIC_MAP = {};

	for (var i = 0; i < 45; ++i) {
		ALPHANUMERIC_MAP[
			"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".charAt(i)
		] = i;
	}

	var MASKFUNCS = [
		function(i, j) {
			return (i + j) % 2 === 0;
		},
		function(i) {
			return i % 2 === 0;
		},
		function(i, j) {
			return j % 3 === 0;
		},
		function(i, j) {
			return (i + j) % 3 === 0;
		},
		function(i, j) {
			return (((i / 2) | 0) + ((j / 3) | 0)) % 2 === 0;
		},
		function(i, j) {
			return ((i * j) % 2) + ((i * j) % 3) === 0;
		},
		function(i, j) {
			return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
		},
		function(i, j) {
			return (((i + j) % 2) + ((i * j) % 3)) % 2 === 0;
		}
	];

	var needsverinfo = function needsverinfo(ver) {
		return ver > 6;
	};

	var getsizebyver = function getsizebyver(ver) {
		return 4 * ver + 17;
	};

	var nfullbits = function nfullbits(ver) {
		var v = VERSIONS[ver];
		var nbits = 16 * ver * ver + 128 * ver + 64;

		if (needsverinfo(ver)) {
			nbits -= 36;
		}

		if (v[2][length]) {
			nbits -= 25 * v[2][length] * v[2][length] - 10 * v[2][length] - 55;
		}

		return nbits;
	};

	var ndatabits = function ndatabits(ver, ecclevel) {
		var nbits = nfullbits(ver) & ~7;
		var v = VERSIONS[ver];
		nbits -= 8 * v[0][ecclevel] * v[1][ecclevel];
		return nbits;
	};

	var ndatalenbits = function ndatalenbits(ver, mode) {
		switch (mode) {
			case MODE_NUMERIC:
				return ver < 10 ? 10 : ver < 27 ? 12 : 14;

			case MODE_ALPHANUMERIC:
				return ver < 10 ? 9 : ver < 27 ? 11 : 13;

			case MODE_OCTET:
				return ver < 10 ? 8 : 16;

			case MODE_KANJI:
				return ver < 10 ? 8 : ver < 27 ? 10 : 12;
		}
	};

	var getmaxdatalen = function getmaxdatalen(ver, mode, ecclevel) {
		var nbits = ndatabits(ver, ecclevel) - 4 - ndatalenbits(ver, mode);

		switch (mode) {
			case MODE_NUMERIC:
				return (
					((nbits / 10) | 0) * 3 +
					(nbits % 10 < 4 ? 0 : nbits % 10 < 7 ? 1 : 2)
				);

			case MODE_ALPHANUMERIC:
				return ((nbits / 11) | 0) * 2 + (nbits % 11 < 6 ? 0 : 1);

			case MODE_OCTET:
				return (nbits / 8) | 0;

			case MODE_KANJI:
				return (nbits / 13) | 0;
		}
	};

	var validatedata = function validatedata(mode, data) {
		switch (mode) {
			case MODE_NUMERIC:
				if (!data.match(NUMERIC_REGEXP)) {
					return null;
				}

				return data;

			case MODE_ALPHANUMERIC:
				if (!data.match(ALPHANUMERIC_REGEXP)) {
					return null;
				}

				return data.toUpperCase();

			case MODE_OCTET:
				if (typeof data === "string") {
					var newdata = [];

					for (var i = 0; i < data[length]; ++i) {
						var ch = data.charCodeAt(i);

						if (ch < 0x80) {
							newdata.push(ch);
						} else if (ch < 0x800) {
							newdata.push(0xc0 | (ch >> 6), 0x80 | (ch & 0x3f));
						} else if (ch < 0x10000) {
							newdata.push(
								0xe0 | (ch >> 12),
								0x80 | ((ch >> 6) & 0x3f),
								0x80 | (ch & 0x3f)
							);
						} else {
							newdata.push(
								0xf0 | (ch >> 18),
								0x80 | ((ch >> 12) & 0x3f),
								0x80 | ((ch >> 6) & 0x3f),
								0x80 | (ch & 0x3f)
							);
						}
					}

					return newdata;
				} else {
					return data;
				}
		}
	};

	var encode = function encode(ver, mode, data, maxbuflen) {
		var buf = [];
		var bits = 0,
			remaining = 8;
		var datalen = data[length];

		var pack = function pack(x, n) {
			if (n >= remaining) {
				buf.push(bits | (x >> (n -= remaining)));

				while (n >= 8) {
					buf.push((x >> (n -= 8)) & 255);
				}

				bits = 0;
				remaining = 8;
			}

			if (n > 0) {
				bits |= (x & ((1 << n) - 1)) << (remaining -= n);
			}
		};

		var nlenbits = ndatalenbits(ver, mode);
		pack(mode, 4);
		pack(datalen, nlenbits);

		switch (mode) {
			case MODE_NUMERIC:
				for (var i = 2; i < datalen; i += 3) {
					pack(parseInt(data.substring(i - 2, i + 1), 10), 10);
				}

				pack(
					parseInt(data.substring(i - 2), 10),
					[0, 4, 7][datalen % 3]
				);
				break;

			case MODE_ALPHANUMERIC:
				for (var i2 = 1; i2 < datalen; i2 += 2) {
					pack(
						ALPHANUMERIC_MAP[data.charAt(i2 - 1)] * 45 +
							ALPHANUMERIC_MAP[data.charAt(i2)],
						11
					);
				}

				if (datalen % 2 === 1) {
					pack(ALPHANUMERIC_MAP[data.charAt(i2 - 1)], 6);
				}

				break;

			case MODE_OCTET:
				for (var i3 = 0; i3 < datalen; ++i3) {
					pack(data[i3], 8);
				}

				break;
		}

		pack(MODE_TERMINATOR, 4);

		if (remaining < 8) {
			buf.push(bits);
		}

		while (buf[length] + 1 < maxbuflen) {
			buf.push(0xec, 0x11);
		}

		if (buf[length] < maxbuflen) {
			buf.push(0xec);
		}

		return buf;
	};

	var calculateecc = function calculateecc(poly, genpoly) {
		var modulus = poly.slice(0);
		var polylen = poly[length],
			genpolylen = genpoly[length];

		for (var k = 0; k < genpolylen; ++k) {
			modulus.push(0);
		}

		for (var i = 0; i < polylen; ) {
			var quotient = GF256_INVMAP[modulus[i++]];

			if (quotient >= 0) {
				for (var j = 0; j < genpolylen; ++j) {
					modulus[i + j] ^= GF256_MAP[(quotient + genpoly[j]) % 255];
				}
			}
		}

		return modulus.slice(polylen);
	};

	var augumenteccs = function augumenteccs(poly, nblocks, genpoly) {
		var subsizes = [];
		var subsize = (poly[length] / nblocks) | 0,
			subsize0 = 0;
		var pivot = nblocks - (poly[length] % nblocks);

		for (var i = 0; i < pivot; ++i) {
			subsizes.push(subsize0);
			subsize0 += subsize;
		}

		for (var i2 = pivot; i2 < nblocks; ++i2) {
			subsizes.push(subsize0);
			subsize0 += subsize + 1;
		}

		subsizes.push(subsize0);
		var eccs = [];

		for (var i3 = 0; i3 < nblocks; ++i3) {
			eccs.push(
				calculateecc(
					poly.slice(subsizes[i3], subsizes[i3 + 1]),
					genpoly
				)
			);
		}

		var result = [];
		var nitemsperblock = (poly[length] / nblocks) | 0;

		for (var i4 = 0; i4 < nitemsperblock; ++i4) {
			for (var j = 0; j < nblocks; ++j) {
				result.push(poly[subsizes[j] + i4]);
			}
		}

		for (var j2 = pivot; j2 < nblocks; ++j2) {
			result.push(poly[subsizes[j2 + 1] - 1]);
		}

		for (var i5 = 0; i5 < genpoly[length]; ++i5) {
			for (var j3 = 0; j3 < nblocks; ++j3) {
				result.push(eccs[j3][i5]);
			}
		}

		return result;
	};

	var augumentbch = function augumentbch(poly, p, genpoly, q) {
		var modulus = poly << q;

		for (var i = p - 1; i >= 0; --i) {
			if ((modulus >> (q + i)) & 1) {
				modulus ^= genpoly << i;
			}
		}

		return (poly << q) | modulus;
	};

	var makebasematrix = function makebasematrix(ver) {
		var v = VERSIONS[ver],
			n = getsizebyver(ver);
		var matrix = [],
			reserved = [];

		for (var i = 0; i < n; ++i) {
			matrix.push([]);
			reserved.push([]);
		}

		var blit = function blit(y, x, h, w, bits) {
			for (var i = 0; i < h; ++i) {
				for (var j = 0; j < w; ++j) {
					matrix[y + i][x + j] = (bits[i] >> j) & 1;
					reserved[y + i][x + j] = 1;
				}
			}
		};

		blit(0, 0, 9, 9, [
			0x7f,
			0x41,
			0x5d,
			0x5d,
			0x5d,
			0x41,
			0x17f,
			0x00,
			0x40
		]);
		blit(n - 8, 0, 8, 9, [0x100, 0x7f, 0x41, 0x5d, 0x5d, 0x5d, 0x41, 0x7f]);
		blit(0, n - 8, 9, 8, [
			0xfe,
			0x82,
			0xba,
			0xba,
			0xba,
			0x82,
			0xfe,
			0x00,
			0x00
		]);

		for (var i2 = 9; i2 < n - 8; ++i2) {
			matrix[6][i2] = matrix[i2][6] = ~i2 & 1;
			reserved[6][i2] = reserved[i2][6] = 1;
		}

		var aligns = v[2],
			m = aligns[length];

		for (var i3 = 0; i3 < m; ++i3) {
			var minj = i3 === 0 || i3 === m - 1 ? 1 : 0,
				maxj = i3 === 0 ? m - 1 : m;

			for (var j = minj; j < maxj; ++j) {
				blit(aligns[i3], aligns[j], 5, 5, [
					0x1f,
					0x11,
					0x15,
					0x11,
					0x1f
				]);
			}
		}

		if (needsverinfo(ver)) {
			var code = augumentbch(ver, 6, 0x1f25, 12);
			var k = 0;

			for (var i4 = 0; i4 < 6; ++i4) {
				for (var j2 = 0; j2 < 3; ++j2) {
					matrix[i4][n - 11 + j2] = matrix[n - 11 + j2][i4] =
						(code >> k++) & 1;
					reserved[i4][n - 11 + j2] = reserved[n - 11 + j2][i4] = 1;
				}
			}
		}

		return {
			matrix: matrix,
			reserved: reserved
		};
	};

	var putdata = function putdata(matrix, reserved, buf) {
		var n = matrix[length];
		var k = 0,
			dir = -1;

		for (var i = n - 1; i >= 0; i -= 2) {
			if (i === 6) {
				--i;
			}

			var jj = dir < 0 ? n - 1 : 0;

			for (var j = 0; j < n; ++j) {
				for (var ii = i; ii > i - 2; --ii) {
					if (!reserved[jj][ii]) {
						matrix[jj][ii] = (buf[k >> 3] >> (~k & 7)) & 1;
						++k;
					}
				}

				jj += dir;
			}

			dir = -dir;
		}

		return matrix;
	};

	var maskdata = function maskdata(matrix, reserved, mask) {
		var maskf = MASKFUNCS[mask];
		var n = matrix[length];

		for (var i = 0; i < n; ++i) {
			for (var j = 0; j < n; ++j) {
				if (!reserved[i][j]) {
					matrix[i][j] ^= maskf(i, j);
				}
			}
		}

		return matrix;
	};

	var putformatinfo = function putformatinfo(
		matrix,
		reserved,
		ecclevel,
		mask
	) {
		var n = matrix[length];
		var code = augumentbch((ecclevel << 3) | mask, 5, 0x537, 10) ^ 0x5412;

		for (var i = 0; i < 15; ++i) {
			var r = [
				0,
				1,
				2,
				3,
				4,
				5,
				7,
				8,
				n - 7,
				n - 6,
				n - 5,
				n - 4,
				n - 3,
				n - 2,
				n - 1
			][i];
			var c = [
				n - 1,
				n - 2,
				n - 3,
				n - 4,
				n - 5,
				n - 6,
				n - 7,
				n - 8,
				7,
				5,
				4,
				3,
				2,
				1,
				0
			][i];
			matrix[r][8] = matrix[8][c] = (code >> i) & 1;
		}

		return matrix;
	};

	var evaluatematrix = function evaluatematrix(matrix) {
		var PENALTY_CONSECUTIVE = 3;
		var PENALTY_TWOBYTWO = 3;
		var PENALTY_FINDERLIKE = 40;
		var PENALTY_DENSITY = 10;

		var evaluategroup = function evaluategroup(groups) {
			var score = 0;

			for (var i = 0; i < groups[length]; ++i) {
				if (groups[i] >= 5) {
					score += PENALTY_CONSECUTIVE + (groups[i] - 5);
				}
			}

			for (var i2 = 5; i2 < groups[length]; i2 += 2) {
				var p = groups[i2];

				if (
					groups[i2 - 1] === p &&
					groups[i2 - 2] === 3 * p &&
					groups[i2 - 3] === p &&
					groups[i2 - 4] === p &&
					(groups[i2 - 5] >= 4 * p || groups[i2 + 1] >= 4 * p)
				) {
					score += PENALTY_FINDERLIKE;
				}
			}

			return score;
		};

		var n = matrix[length];
		var score = 0,
			nblacks = 0;

		for (var i = 0; i < n; ++i) {
			var row = matrix[i];
			var groups;
			groups = [0];

			for (var j = 0; j < n; ) {
				var k;

				for (k = 0; j < n && row[j]; ++k) {
					++j;
				}

				groups.push(k);

				for (k = 0; j < n && !row[j]; ++k) {
					++j;
				}

				groups.push(k);
			}

			score += evaluategroup(groups);
			groups = [0];

			for (var j2 = 0; j2 < n; ) {
				var k2;

				for (k2 = 0; j2 < n && matrix[j2][i]; ++k2) {
					++j2;
				}

				groups.push(k2);

				for (k2 = 0; j2 < n && !matrix[j2][i]; ++k2) {
					++j2;
				}

				groups.push(k2);
			}

			score += evaluategroup(groups);
			var nextrow = matrix[i + 1] || [];
			nblacks += row[0];

			for (var j3 = 1; j3 < n; ++j3) {
				var p = row[j3];
				nblacks += p;

				if (
					row[j3 - 1] === p &&
					nextrow[j3] === p &&
					nextrow[j3 - 1] === p
				) {
					score += PENALTY_TWOBYTWO;
				}
			}
		}

		score +=
			PENALTY_DENSITY * ((Math.abs(nblacks / n / n - 0.5) / 0.05) | 0);
		return score;
	};

	var _generate = function generate(data, ver, mode, ecclevel, mask) {
		var v = VERSIONS[ver];
		var buf = encode(ver, mode, data, ndatabits(ver, ecclevel) >> 3);
		buf = augumenteccs(buf, v[1][ecclevel], GF256_GENPOLY[v[0][ecclevel]]);
		var result = makebasematrix(ver);
		var matrix = result.matrix,
			reserved = result.reserved;
		putdata(matrix, reserved, buf);

		if (mask < 0) {
			maskdata(matrix, reserved, 0);
			putformatinfo(matrix, reserved, ecclevel, 0);
			var bestmask = 0,
				bestscore = evaluatematrix(matrix);
			maskdata(matrix, reserved, 0);

			for (mask = 1; mask < 8; ++mask) {
				maskdata(matrix, reserved, mask);
				putformatinfo(matrix, reserved, ecclevel, mask);
				var score = evaluatematrix(matrix);

				if (bestscore > score) {
					bestscore = score;
					bestmask = mask;
				}

				maskdata(matrix, reserved, mask);
			}

			mask = bestmask;
		}

		maskdata(matrix, reserved, mask);
		putformatinfo(matrix, reserved, ecclevel, mask);
		return matrix;
	};

	var QRCode = {
		generate: function generate(data, settings) {
			var options = settings || {};
			var MODES = {
				numeric: MODE_NUMERIC,
				alphanumeric: MODE_ALPHANUMERIC,
				octet: MODE_OCTET
			};
			var ECCLEVELS = {
				L: ECCLEVEL_L,
				M: ECCLEVEL_M,
				Q: ECCLEVEL_Q,
				H: ECCLEVEL_H
			};
			var ver = options.version || -1;
			var ecclevel = ECCLEVELS[(options.ecclevel || "L").toUpperCase()];
			var mode = options.mode ? MODES[options.mode.toLowerCase()] : -1;
			var mask = "mask" in options ? options.mask : -1;

			if (mode < 0) {
				if (typeof data === "string") {
					if (data.match(NUMERIC_REGEXP)) {
						mode = MODE_NUMERIC;
					} else if (data.match(ALPHANUMERIC_OUT_REGEXP)) {
						mode = MODE_ALPHANUMERIC;
					} else {
						mode = MODE_OCTET;
					}
				} else {
					mode = MODE_OCTET;
				}
			} else if (
				!(
					mode === MODE_NUMERIC ||
					mode === MODE_ALPHANUMERIC ||
					mode === MODE_OCTET
				)
			) {
				throw "invalid or unsupported mode";
			}

			data = validatedata(mode, data);

			if (data === null) {
				throw "invalid data format";
			}

			if (ecclevel < 0 || ecclevel > 3) {
				throw "invalid ECC level";
			}

			if (ver < 0) {
				for (ver = 1; ver <= 40; ++ver) {
					if (data[length] <= getmaxdatalen(ver, mode, ecclevel)) {
						break;
					}
				}

				if (ver > 40) {
					throw "too large data";
				}
			} else if (ver < 1 || ver > 40) {
				throw "invalid version";
			}

			if (mask !== -1 && (mask < 0 || mask > 8)) {
				throw "invalid mask";
			}

			return _generate(data, ver, mode, ecclevel, mask);
		},
		generateHTML: function generateHTML(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode.generate(data, options);
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(
				options.margin !== null ? options.margin : 4,
				0.0
			);
			var e = document.createElement("div");
			var n = matrix[length];
			var html = [
				'<table border="0" cellspacing="0" cellpadding="0" style="border:' +
					modsize * margin +
					"px solid " +
					fillcolor +
					";background:" +
					fillcolor +
					'">'
			];

			for (var i = 0; i < n; ++i) {
				html.push("<tr>");

				for (var j = 0; j < n; ++j) {
					html.push(
						'<td style="width:' +
							modsize +
							"px;height:" +
							modsize +
							"px" +
							(matrix[i][j] ? ";background:" + textcolor : "") +
							'"></td>'
					);
				}

				html.push("</tr>");
			}

			e.className = "qrcode";
			/* e.innerHTML = html.join("") + "</table>"; */

			var range = document.createRange();
			range.selectNodeContents(e);
			var frag = range.createContextualFragment(
				html.join("") + "</table>"
			);
			e.appendChild(frag);
			return e;
		},
		generateSVG: function generateSVG(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode.generate(data, options);
			var n = matrix[length];
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(options.margin ? options.margin : 4, 0.0);
			var size = modsize * (n + 2 * margin);
			/* var common = ' class= "fg"' + ' width="' + modsize + '" height="' + modsize + '"/>'; */

			var e = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"svg"
			);
			e.setAttributeNS(null, "viewBox", "0 0 " + size + " " + size);
			e.setAttributeNS(null, "style", "shape-rendering:crispEdges");
			var qrcodeId = "qrcode" + Date.now();
			e.setAttributeNS(null, "id", qrcodeId);
			var frag = document.createDocumentFragment();
			/* var svg = ['<style scoped>.bg{fill:' + fillcolor + '}.fg{fill:' + textcolor + '}</style>', '<rect class="bg" x="0" y="0"', 'width="' + size + '" height="' + size + '"/>', ]; */

			var style = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"style"
			);
			style.appendChild(
				document.createTextNode(
					"#" +
						qrcodeId +
						" .bg{fill:" +
						fillcolor +
						"}#" +
						qrcodeId +
						" .fg{fill:" +
						textcolor +
						"}"
				)
			);
			/* style.setAttributeNS(null, "scoped", "scoped"); */

			frag.appendChild(style);

			var createRect = function createRect(c, f, x, y, s) {
				var fg =
					document.createElementNS(
						"http://www.w3.org/2000/svg",
						"rect"
					) || "";
				fg.setAttributeNS(null, "class", c);
				fg.setAttributeNS(null, "fill", f);
				fg.setAttributeNS(null, "x", x);
				fg.setAttributeNS(null, "y", y);
				fg.setAttributeNS(null, "width", s);
				fg.setAttributeNS(null, "height", s);
				return fg;
			};

			frag.appendChild(createRect("bg", "none", 0, 0, size));
			var yo = margin * modsize;

			for (var y = 0; y < n; ++y) {
				var xo = margin * modsize;

				for (var x = 0; x < n; ++x) {
					if (matrix[y][x]) {
						/* svg.push('<rect x="' + xo + '" y="' + yo + '"', common); */
						frag.appendChild(
							createRect("fg", "none", xo, yo, modsize)
						);
					}

					xo += modsize;
				}

				yo += modsize;
			}
			/* e.innerHTML = svg.join(""); */

			e.appendChild(frag);
			return e;
		},
		generatePNG: function generatePNG(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor || "#FFFFFF";
			var textcolor = options.textcolor || "#000000";
			var matrix = QRCode.generate(data, options);
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(
				options.margin !== null && options.margin !== undefined
					? options.margin
					: 4,
				0.0
			);
			var n = matrix[length];
			var size = modsize * (n + 2 * margin);
			var canvas = document.createElement("canvas"),
				context;
			canvas.width = canvas.height = size;
			context = canvas.getContext("2d");

			if (!context) {
				throw "canvas support is needed for PNG output";
			}

			context.fillStyle = fillcolor;
			context.fillRect(0, 0, size, size);
			context.fillStyle = textcolor;

			for (var i = 0; i < n; ++i) {
				for (var j = 0; j < n; ++j) {
					if (matrix[i][j]) {
						context.fillRect(
							modsize * (margin + j),
							modsize * (margin + i),
							modsize,
							modsize
						);
					}
				}
			}

			return canvas.toDataURL();
		}
	};
	root.QRCode = QRCode;
})("undefined" !== typeof window ? window : this, document);
/*jshint bitwise: true */

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
(function() {
	var Main;

	Main = (function() {
		function Main(o) {
			this.o = o != null ? o : {};

			if (window.isAnyResizeEventInited) {
				return;
			}

			this.vars();
			this.redefineProto();
		}

		Main.prototype.vars = function() {
			window.isAnyResizeEventInited = true;
			this.allowedProtos = [
				HTMLDivElement,
				HTMLFormElement,
				HTMLLinkElement,
				HTMLBodyElement,
				HTMLParagraphElement,
				HTMLFieldSetElement,
				HTMLLegendElement,
				HTMLLabelElement,
				HTMLButtonElement,
				HTMLUListElement,
				HTMLOListElement,
				HTMLLIElement,
				HTMLHeadingElement,
				HTMLQuoteElement,
				HTMLPreElement,
				HTMLBRElement,
				HTMLFontElement,
				HTMLHRElement,
				HTMLModElement,
				HTMLParamElement,
				HTMLMapElement,
				HTMLTableElement,
				HTMLTableCaptionElement,
				HTMLImageElement,
				HTMLTableCellElement,
				HTMLSelectElement,
				HTMLInputElement,
				HTMLTextAreaElement,
				HTMLAnchorElement,
				HTMLObjectElement,
				HTMLTableColElement,
				HTMLTableSectionElement,
				HTMLTableRowElement
			];
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

		Main.prototype.redefineProto = function() {
			var i, it, proto, t;
			it = this;
			return (t = function() {
				var _i, _len, _ref, _results;

				_ref = this.allowedProtos;
				_results = [];

				var fn = function fn(proto) {
					var listener, remover;
					listener =
						proto.prototype.addEventListener ||
						proto.prototype.attachEvent;
					var wrappedListener;

					(function(listener) {
						wrappedListener = function wrappedListener() {
							var option;

							if (this !== window || this !== document) {
								option =
									arguments[0] === "onresize" &&
									!this.isAnyResizeEventInited;

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

					remover =
						proto.prototype.removeEventListener ||
						proto.prototype.detachEvent;
					return (function(remover) {
						var wrappedRemover;

						wrappedRemover = function wrappedRemover() {
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
			}.call(this));
		};

		Main.prototype.handleResize = function(args) {
			var computedStyle, el, iframe, isEmpty, isStatic, _ref;

			el = args.that;

			if (!this.timerElements[el.tagName.toLowerCase()]) {
				iframe = document.createElement("iframe");
				el.appendChild(iframe);
				iframe.style.width = "100%";
				iframe.style.height = "100%";
				iframe.style.position = "absolute";
				iframe.style.zIndex = -999;
				iframe.style.opacity = 0;
				iframe.style.top = 0;
				iframe.style.left = 0;
				iframe.setAttribute("title", "any-resize-event");
				iframe.setAttribute("aria-hidden", true);
				computedStyle = window.getComputedStyle
					? getComputedStyle(el)
					: el.currentStyle;
				isStatic =
					computedStyle.position === "static" &&
					el.style.position === "";
				isEmpty =
					computedStyle.position === "" && el.style.position === "";

				if (isStatic || isEmpty) {
					el.style.position = "relative";
				}

				if ((_ref = iframe.contentWindow) != null) {
					_ref.onresize = (function(_this) {
						return function(e) {
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

		Main.prototype.initTimer = function(el) {
			var height, width;
			width = 0;
			height = 0;
			return (this.interval = setInterval(
				(function(_this) {
					return function() {
						var newHeight, newWidth;
						newWidth = el.offsetWidth;
						newHeight = el.offsetHeight;

						if (newWidth !== width || newHeight !== height) {
							_this.dispatchEvent(el);

							width = newWidth;
							return (height = newHeight);
						}
					};
				})(this),
				this.o.interval || 62.5
			));
		};

		Main.prototype.dispatchEvent = function(el) {
			var e;

			if (document.createEvent) {
				e = document.createEvent("HTMLEvents");
				e.initEvent("onresize", false, false);
				return el.dispatchEvent(e);
			} else if (document.createEventObject) {
				e = document.createEventObject();
				return el.fireEvent("onresize", e);
			} else {
				return false;
			}
		};

		Main.prototype.destroy = function() {
			var i, it, proto, _i, _len, _ref, _results;

			clearInterval(this.interval);
			this.interval = null;
			window.isAnyResizeEventInited = false;
			it = this;
			_ref = this.allowedProtos;
			_results = [];

			var fn = function fn(proto) {
				var listener;
				listener =
					proto.prototype.addEventListener ||
					proto.prototype.attachEvent;

				if (proto.prototype.addEventListener) {
					proto.prototype.addEventListener =
						Element.prototype.addEventListener;
				} else if (proto.prototype.attachEvent) {
					proto.prototype.attachEvent = Element.prototype.attachEvent;
				}

				if (proto.prototype.removeEventListener) {
					return (proto.prototype.removeEventListener =
						Element.prototype.removeEventListener);
				} else if (proto.prototype.detachEvent) {
					return (proto.prototype.detachEvent =
						Element.prototype.detachEvent);
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

	if (typeof define === "function" && define.amd) {
		define("any-resize-event", [], function() {
			return new Main();
		});
	} else if (
		(typeof module === "undefined" ? "undefined" : _typeof(module)) ===
			"object" &&
		_typeof(module.exports) === "object"
	) {
		module.exports = new Main();
	} else {
		if (typeof window !== "undefined" && window !== null) {
			window.AnyResizeEvent = Main;
		}

		if (typeof window !== "undefined" && window !== null) {
			window.anyResizeEvent = new Main();
		}
	}
}.call(this));

var _extends =
	Object.assign ||
	function(target) {
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

var LazyLoad = (function() {
	"use strict";

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
		return elements.filter(function(element) {
			return !getWasProcessedData(element);
		});
	};

	var purgeOneElement = function purgeOneElement(elements, elementToPurge) {
		return elements.filter(function(element) {
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
			return (
				canvas.toDataURL(webpString).indexOf("data:" + webpString) === 0
			);
		}

		return false;
	};

	var runningOnBrowser = typeof window !== "undefined";
	var isBot =
		(runningOnBrowser && !("onscroll" in window)) ||
		/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);
	var supportsIntersectionObserver =
		runningOnBrowser && "IntersectionObserver" in window;
	var supportsClassList =
		runningOnBrowser && "classList" in document.createElement("p");
	var supportsWebp = runningOnBrowser && detectWebp();

	var setSourcesInChildren = function setSourcesInChildren(
		parentTag,
		attrName,
		dataAttrName,
		toWebpFlag
	) {
		for (var i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
			if (childTag.tagName === "SOURCE") {
				var attrValue = getData(childTag, dataAttrName);
				setAttributeIfValue(childTag, attrName, attrValue, toWebpFlag);
			}
		}
	};

	var setAttributeIfValue = function setAttributeIfValue(
		element,
		attrName,
		value,
		toWebpFlag
	) {
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
			element.style.backgroundImage = 'url("' + setValue + '")';
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

		element.className = element.className
			.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ")
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

	var addEventListener = function addEventListener(
		element,
		eventName,
		handler
	) {
		element.addEventListener(eventName, handler);
	};

	var removeEventListener = function removeEventListener(
		element,
		eventName,
		handler
	) {
		element.removeEventListener(eventName, handler);
	};

	var addEventListeners = function addEventListeners(
		element,
		loadHandler,
		errorHandler
	) {
		addEventListener(element, genericLoadEventName, loadHandler);
		addEventListener(element, mediaLoadEventName, loadHandler);
		addEventListener(element, errorEventName, errorHandler);
	};

	var removeEventListeners = function removeEventListeners(
		element,
		loadHandler,
		errorHandler
	) {
		removeEventListener(element, genericLoadEventName, loadHandler);
		removeEventListener(element, mediaLoadEventName, loadHandler);
		removeEventListener(element, errorEventName, errorHandler);
	};

	var eventHandler = function eventHandler(event, success, instance) {
		var settings = instance._settings;
		var className = success ? settings.class_loaded : settings.class_error;
		var callback = success
			? settings.callback_load
			: settings.callback_error;
		var element = event.target;
		removeClass(element, settings.class_loading);
		addClass(element, className);
		callbackIfSet(callback, element);

		instance._updateLoadingCount(-1);
	};

	var addOneShotEventListeners = function addOneShotEventListeners(
		element,
		instance
	) {
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

	var loadAndUnobserve = function loadAndUnobserve(
		element,
		observer,
		instance
	) {
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

		timeoutId = setTimeout(function() {
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

			this._observer = new IntersectionObserver(
				this._onIntersection.bind(this),
				getObserverSettings(this._settings)
			);
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
			var nodeSet =
				elements ||
				settings.container.querySelectorAll(settings.elements_selector);
			this._elements = purgeProcessedElements(
				Array.prototype.slice.call(nodeSet) // NOTE: nodeset to array for IE compatibility
			);

			if (isBot || !this._observer) {
				this.loadAll();
				return;
			}

			this._elements.forEach(function(element) {
				_this._observer.observe(element);
			});
		},
		destroy: function destroy() {
			var _this2 = this;

			if (this._observer) {
				this._elements.forEach(function(element) {
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
			elements.forEach(function(element) {
				_this3.load(element);
			});
		}
	};
	/* Automatic instances creation if required (useful for async script loading) */

	if (runningOnBrowser) {
		autoInitialize(LazyLoad, window.lazyLoadOptions);
	}

	return LazyLoad;
})();
