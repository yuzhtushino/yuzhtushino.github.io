/*global console, GLightbox, imagesLoaded, LazyLoad, loadJsCss,
manageExternalLinkAll, manageMacy, manageReadMore, renderAC, scriptIsLoaded,
updateMacyThrottled*/

/*!
 * page logic
 */
(function(root, document) {
	"use strict";

	var getElementsByClassName = "getElementsByClassName";

	root.runAbout = function() {
		var classList = "classList";
		var querySelectorAll = "querySelectorAll";
		var _addEventListener = "addEventListener";
		var _length = "length";
		var macyItems = [];
		/*!
		 * to change default style
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/rendering-cards/host-config}
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/rendering-cards/host-config#adaptivecardconfig}
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/pull/905}
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/issues/1929}
		 * @see {@link https://material.io/tools/color/#!/?view.left=0&view.right=0&secondary.color=BDBDBD&primary.color=F06292}
		 */

		var renderACOptions = {
			fontFamily:
				"Roboto, Segoe UI, Segoe MDL2 Assets, Helvetica Neue, sans-serif",
			containerStyles: {
				default: {
					foregroundColors: {
						default: {
							default: "#212121",
							subtle: "#757575"
						},
						dark: {
							default: "#000000",
							subtle: "#424242"
						},
						light: {
							default: "#757575",
							subtle: "#bdbdbd"
						},
						accent: {
							default: "#0097a7",
							subtle: "#26c6da"
						},
						good: {
							default: "#388e3c",
							subtle: "#66bb6a"
						},
						warning: {
							default: "#e64a19",
							subtle: "#ff7043"
						},
						attention: {
							default: "#d81b60",
							subtle: "#f06292"
						}
					},
					backgroundColor: "#ffffff"
				}
			}
		};

		var onExecuteAC = function onExecuteAC(action) {
			if (action.url) {
				root[location].href = action.url;
			}
		};

		var manageAC = function manageAC(macyGrid, callback) {
			if (root.renderAC) {
				var count = 0;
				var i, l;

				for (i = 0, l = macyItems[_length]; i < l; i += 1) {
					renderAC(
						macyGrid,
						macyItems[i],
						renderACOptions,
						onExecuteAC,
						null
					);
					count++;

					if (count === macyItems[_length]) {
						if (callback && "function" === typeof callback) {
							callback();
						}
					}
				}

				i = l = null;
			}
		};

		var glightboxClass = "glightbox";
		/*!
		 * @see {@link https://glightbox.mcstudios.com.mx/#options}
		 */

		root.handleGLightbox = null;

		var manageGlightbox = function manageGlightbox(macyGrid) {
			var initScript = function initScript() {
				if (root.GLightbox) {
					if (root.handleGLightbox) {
						root.handleGLightbox.destroy();
						root.handleGLightbox = null;
					}

					if (macyGrid) {
						root.handleGLightbox = GLightbox({
							selector: glightboxClass
						});
					}
				}
			};

			if (
				!scriptIsLoaded(
					"./cdn/glightbox/1.0.8/js/glightbox.fixed.min.js"
				)
			) {
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

		var dataSrcLazyClass = "data-src-lazy";
		/*!
		 * @see {@link https://github.com/verlok/lazyload}
		 */

		var manageLazyLoad = function manageLazyLoad(dataSrcLazyClass) {
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

		var onImagesLoaded = function onImagesLoaded(macyGrid) {
			if (root.imagesLoaded) {
				var imgLoad;
				imgLoad = new imagesLoaded(macyGrid);

				var onAlways = function onAlways(instance) {
					if (root.updateMacyThrottled) {
						updateMacyThrottled();
					}

					console.log(
						"imagesLoaded: found " +
							instance.images[_length] +
							" images"
					);
				};

				imgLoad.on("always", onAlways);
			}
		};

		var anyResizeEventIsBindedClass = "any-resize-event--is-binded";
		var macyGridClass = "macy-grid";
		var macyGrid = document[getElementsByClassName](macyGridClass)[0] || "";
		var macyGridIsActiveClass = "macy-grid--is-active";

		var onMacyRender = function onMacyRender() {
			macyGrid[classList].add(macyGridIsActiveClass);
			onImagesLoaded(macyGrid);
			manageLazyLoad(dataSrcLazyClass);
			manageExternalLinkAll();
			manageGlightbox(glightboxClass);
			manageReadMore(null, {
				target: ".dummy",
				numOfWords: 10,
				toggle: true,
				moreLink: "БОЛЬШЕ",
				lessLink: "МЕНЬШЕ",
				inline: true,
				customBlockElement: "p"
			});
		};

		var onMacyResize = function onMacyResize() {
			try {
				var container = macyGrid
					? macyGrid.children ||
					  macyGrid[querySelectorAll](
							"." + macyGridClass + " > *"
					  ) ||
					  ""
					: "";

				if (container) {
					var i, l;

					for (i = 0, l = container[_length]; i < l; i += 1) {
						if (
							!container[i][classList].contains(
								anyResizeEventIsBindedClass
							)
						) {
							container[i][classList].add(
								anyResizeEventIsBindedClass
							);

							container[i][_addEventListener](
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
			manageMacy(macyGridClass, {
				trueOrder: false,
				waitForImages: false,
				margin: 20,
				columns: 3,
				breakAt: {
					1280: 2,
					1024: 2,
					960: 2,
					640: 1,
					480: 1,
					360: 1
				}
			});
			onMacyRender();
			onMacyResize();
		};
		/* var macyItems = [
    ]; */

		var macyGridItemIsRenderedClass = "macy-grid__item--is-rendered";

		var addMacyItems = function addMacyItems(macyGrid, callback) {
			if (root.AdaptiveCards) {
				macyGrid.innerHTML = "";
				manageAC(macyGrid, callback);
			} else {
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
        		macyGrid.innerHTML = html.join("");
        		if (callback && "function" === typeof callback) {
        			callback();
        		}
        	}
        }
        i = l = null; */
				macyItems = document[getElementsByClassName]("col") || "";
				var count = 0;
				var i, l;

				for (i = 0, l = macyItems[_length]; i < l; i += 1) {
					macyItems[i][classList].add(macyGridItemIsRenderedClass);
					count++;

					if (count === macyItems[_length]) {
						if (callback && "function" === typeof callback) {
							callback();
						}
					}
				}

				i = l = null;
			}
		};

		if (macyGrid) {
			addMacyItems(macyGrid, onMacyManage);
		}

		if (root.manageExternalLinkAll) {
			manageExternalLinkAll();
		}
	};
})("undefined" !== typeof window ? window : this, document);

/*global console, imagesLoaded, LazyLoad, lightGallery, loadJsCss,
manageExternalLinkAll, manageMacy, scriptIsLoaded, updateMacyThrottled*/

/*!
 * page logic
 */
(function(root, document) {
	"use strict";

	var getElementsByClassName = "getElementsByClassName";

	root.runGallery = function() {
		/*var appendChild = "appendChild";*/
		var classList = "classList";
		var querySelectorAll = "querySelectorAll";
		/*var setAttribute = "setAttribute";*/

		var _addEventListener = "addEventListener";
		var _length = "length";
		/*!
		 * @see {@link https://sachinchoolur.github.io/lightgallery.js/docs/api.html}
		 */

		root.handleLightGallery = null;

		var manageLightGallery = function manageLightGallery(macyGrid) {
			var initScript = function initScript() {
				if (root.lightGallery) {
					if (root.handleLightGallery) {
						root.handleLightGallery.destroy(true);
						root.handleLightGallery = null;
					}

					if (macyGrid) {
						root.handleLightGallery = lightGallery(macyGrid, {
							autoplay: false,
							autoplayControls: false,
							hash: false,
							share: false
						});
					}
				}
			};

			if (
				!scriptIsLoaded(
					"./cdn/lightgallery.js/1.1.1/js/lightgallery.fixed.min.js"
				)
			) {
				var load;
				load = new loadJsCss(
					[
						"./cdn/lightgallery.js/1.1.1/css/lightgallery.fixed.min.css",
						"./cdn/lightgallery.js/1.1.1/js/lightgallery.fixed.min.js",
						"./cdn/lightgallery.js/1.1.1/js/lightgallery.plugins.fixed.min.js"
					],
					initScript
				);
			} else {
				initScript();
			}
		};

		var dataSrcLazyClass = "data-src-lazy";
		/*!
		 * @see {@link https://github.com/verlok/lazyload}
		 */

		var manageLazyLoad = function manageLazyLoad(dataSrcLazyClass) {
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

		var onImagesLoaded = function onImagesLoaded(macyGrid) {
			if (root.imagesLoaded) {
				var imgLoad;
				imgLoad = new imagesLoaded(macyGrid);

				var onAlways = function onAlways(instance) {
					if (root.updateMacyThrottled) {
						updateMacyThrottled();
					}

					console.log(
						"imagesLoaded: found " +
							instance.images[_length] +
							" images"
					);
				};

				imgLoad.on("always", onAlways);
			}
		};

		var anyResizeEventIsBindedClass = "any-resize-event--is-binded";
		var macyGridClass = "macy-grid";
		var macyGrid = document[getElementsByClassName](macyGridClass)[0] || "";
		var macyGridIsActiveClass = "macy-grid--is-active";

		var onMacyRender = function onMacyRender() {
			macyGrid[classList].add(macyGridIsActiveClass);
			onImagesLoaded(macyGrid);
			manageLazyLoad(dataSrcLazyClass);
			manageExternalLinkAll();
			manageLightGallery(macyGrid);
		};

		var onMacyResize = function onMacyResize() {
			try {
				var container = macyGrid
					? macyGrid.children ||
					  macyGrid[querySelectorAll](
							"." + macyGridClass + " > *"
					  ) ||
					  ""
					: "";

				if (container) {
					var i, l;

					for (i = 0, l = container[_length]; i < l; i += 1) {
						if (
							!container[i][classList].contains(
								anyResizeEventIsBindedClass
							)
						) {
							container[i][classList].add(
								anyResizeEventIsBindedClass
							);

							container[i][_addEventListener](
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
			manageMacy(macyGridClass, {
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
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/chajkhona_1_lodochnaja_ul_4.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/chajkhona_1_lodochnaja_ul_4.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/chastnaja_shkola_shevr_ul_svobody_31_str_1.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/chastnaja_shkola_shevr_ul_svobody_31_str_1.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/chitaj_gorod_skhodnjenskaja_ul_50.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/chitaj_gorod_skhodnjenskaja_ul_50.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/chudo_tandyr_ul_fabriciusa_22_korp_1.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/chudo_tandyr_ul_fabriciusa_22_korp_1.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/cjentr_gosuslug_mfc_ul_vasilija_pjetushkova_13_korp_1.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/cjentr_gosuslug_mfc_ul_vasilija_pjetushkova_13_korp_1.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/cjentr_inostrannykh_jazykov_ul_svobody_31_str_1.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/cjentr_inostrannykh_jazykov_ul_svobody_31_str_1.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/cjentr_zhilishhnykh_subsidij_shturval_naja_ul_5_str_1.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/cjentr_zhilishhnykh_subsidij_shturval_naja_ul_5_str_1.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/ekran_optika_skhodnjenskaja_ul_3611.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/ekran_optika_skhodnjenskaja_ul_3611.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/english_time_bul_jana_rajnisa_1_etazh_1.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/english_time_bul_jana_rajnisa_1_etazh_1.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/fotografija_ul_svobody_249.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/fotografija_ul_svobody_249.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/foto_na_khimkinskom_khimkinskij_bul_17.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/foto_na_khimkinskom_khimkinskij_bul_17.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/foto_svoboda_bul_jana_rajnisa_1_1_etazh.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/foto_svoboda_bul_jana_rajnisa_1_1_etazh.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/ifns_rossii_33_pokhodnyj_pr_3.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/ifns_rossii_33_pokhodnyj_pr_3.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/kafje_bar_burovaja_ul_tushinskaja_16_str_4.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/kafje_bar_burovaja_ul_tushinskaja_16_str_4.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/kafje_kulinarija_skhodnjenskaja_ul_4417.jpg.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/kafje_kulinarija_skhodnjenskaja_ul_4417.jpg.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/kafje_ljegjenda_ul_svobody_71_korp_3.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/kafje_ljegjenda_ul_svobody_71_korp_3.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/kinotjeatr_baltika_ul_skhodnjenskaja_56.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/kinotjeatr_baltika_ul_skhodnjenskaja_56.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/kinotjeatr_poljet_ul_njelidovskaja_10.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/kinotjeatr_poljet_ul_njelidovskaja_10.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/konsul_grupp_ul_svobody_50.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/konsul_grupp_ul_svobody_50.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/kul_turnyj_cjentr_saljut_ul_svobody_37.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/kul_turnyj_cjentr_saljut_ul_svobody_37.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/lavstor_ul_svobody_42.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/lavstor_ul_svobody_42.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/na_khimkinskom_khimkinskij_bul_17.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/na_khimkinskom_khimkinskij_bul_17.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/notarius_panfjerova_je_b_adrjes_ul_svobody_42.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/notarius_panfjerova_je_b_adrjes_ul_svobody_42.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/ods_4_dispjetchjerskaja_shturval_naja_ul_5_str_1.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/ods_4_dispjetchjerskaja_shturval_naja_ul_5_str_1.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/parikmakhjerskaja_miljena_njelidovskaja_ul_1744.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/parikmakhjerskaja_miljena_njelidovskaja_ul_1744.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/parikmakhjerskaja_parusnyj_pr_6.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/parikmakhjerskaja_parusnyj_pr_6.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/parikmakhjerskaja_ul_svobody_1510.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/parikmakhjerskaja_ul_svobody_1510.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/park_sjevjernoje_tushino_ul_svobody_56.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/park_sjevjernoje_tushino_ul_svobody_56.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/pfr_juzhnoje_tushino_njelidovskaja_ul_23_korp_2.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/pfr_juzhnoje_tushino_njelidovskaja_ul_23_korp_2.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/pokrovskij_ul_svobody_1510.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/pokrovskij_ul_svobody_1510.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/policvjet_ul_fabriciusa_14.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/policvjet_ul_fabriciusa_14.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/profmastjer_ul_svobody_42.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/profmastjer_ul_svobody_42.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/rjepjetitor_sjergjej_shimanskij_pr_dosflota_3.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/rjepjetitor_sjergjej_shimanskij_pr_dosflota_3.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/rjestoran_tanuki_ul_svobody_48_korp_1.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/rjestoran_tanuki_ul_svobody_48_korp_1.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/salon_atmosfjera_krasoty_ul_svobody_42.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/salon_atmosfjera_krasoty_ul_svobody_42.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/salon_optiki_glazochki_ul_svobody_45_str_1.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/salon_optiki_glazochki_ul_svobody_45_str_1.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/stadion_saljut_lodochnaja_ul_15.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/stadion_saljut_lodochnaja_ul_15.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/status_vjet_ul_svobody_39.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/status_vjet_ul_svobody_39.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/traktir_na_lodochnoj_ul_svobody_35_str_39.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/traktir_na_lodochnoj_ul_svobody_35_str_39.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/tushinskij_stroitjel_bul_jana_rajnisa_8.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/tushinskij_stroitjel_bul_jana_rajnisa_8.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/vjetjerinarnyj_cjentr_gjerstjendorf_ul_svobody_29.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/vjetjerinarnyj_cjentr_gjerstjendorf_ul_svobody_29.jpg"
			},
			{
				href:
					"./libs/serguei-uwp/img/mytushino-gallery/@2x/zhantil_khimkinskij_bul_17.jpg",
				src:
					"./libs/serguei-uwp/img/mytushino-gallery/@1x/zhantil_khimkinskij_bul_17.jpg"
			}
		];
		/*var macyGridItemIsRenderedClass = "macy-grid__item--is-rendered";*/

		var addMacyItems = function addMacyItems(macyGrid, callback) {
			var dataSrcImgKeyName = "src";
			var transparentPixel =
				"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201%201%27%2F%3E";
			/*!
			 * @see {@link https://stackoverflow.com/questions/18393981/append-vs-html-vs-innerhtml-performance}
			 */

			var html = [];
			var count = 0;
			var i, l;

			for (i = 0, l = macyItems[_length]; i < l; i += 1) {
				html.push(
					'<a href="' +
						macyItems[i].href +
						'" aria-label="Показать картинку"><img src="' +
						transparentPixel +
						'" class="' +
						dataSrcLazyClass +
						'" data-' +
						dataSrcImgKeyName +
						'="' +
						macyItems[i].src +
						'" alt="" /></a>\n'
				);
				count++;

				if (count === macyItems[_length]) {
					macyGrid.innerHTML = html.join("");

					if (callback && "function" === typeof callback) {
						callback();
					}
				}
			}

			i = l = null;
			/* var count = 0;
      var i,
      l;
      for (i = 0, l = macyItems[_length]; i < l; i += 1) {
      	var macyItem = document.createElement("a");
      	macyItem[classList].add(macyGridItemIsRenderedClass);
      	macyItem[setAttribute]("href", macyItems[i].href);
      	macyItem[setAttribute]("aria-label", "Показать картинку");
      	var img = document.createElement("img");
      	macyItem[appendChild](img);
      	img[setAttribute]("src", transparentPixel);
      	img[setAttribute]("class", dataSrcLazyClass);
      	img[setAttribute]("data-" + dataSrcImgKeyName, macyItems[i].src);
      	macyGrid[appendChild](macyItem);
      	count++;
      	if (count === macyItems[_length]) {
      		if (callback && "function" === typeof callback) {
      			callback();
      		}
      	}
      }
      i = l = null; */
		};

		if (macyGrid) {
			addMacyItems(macyGrid, onMacyManage);
		}

		if (root.manageExternalLinkAll) {
			manageExternalLinkAll();
		}
	};
})("undefined" !== typeof window ? window : this, document);

/*global console, GLightbox, imagesLoaded, LazyLoad, loadJsCss,
manageExternalLinkAll, manageMacy, manageReadMore, renderAC, scriptIsLoaded,
updateMacyThrottled*/

/*!
 * page logic
 */
(function(root, document) {
	"use strict";

	var getElementsByClassName = "getElementsByClassName";

	root.runHome = function() {
		var classList = "classList";
		var location = "location";
		var querySelectorAll = "querySelectorAll";
		var _addEventListener = "addEventListener";
		var _length = "length";
		/*!
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/sdk/rendering-cards/javascript/render-a-card}
		 * @see {@link https://adaptivecards.io/samples/}
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/issues/1984}
		 */

		var renderACVCard = {
			$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
			type: "AdaptiveCard",
			version: "1.0",
			body: [
				{
					type: "ColumnSet",
					columns: [
						{
							type: "Column",
							width: 2,
							items: [
								{
									type: "Image",
									altText: "",
									url:
										"./libs/serguei-uwp/img/shimanskybiz-instagram/@0.25x/c599a30aa1744c200a159bc418635d46.jpg",
									size: "stretch",
									style: "person"
								}
							]
						},
						{
							type: "Column",
							width: 6,
							items: [
								{
									type: "TextBlock",
									text: "Serguei Shimansky",
									size: "medium",
									color: "accent",
									weight: "default",
									wrap: true,
									spacing: "none"
								},
								{
									type: "TextBlock",
									text: "Репетитор английского",
									size: "small",
									isSubtle: true,
									wrap: true,
									spacing: "none"
								},
								{
									type: "TextBlock",
									text: "Москва, Южное Тушино",
									size: "small",
									isSubtle: true,
									wrap: true,
									spacing: "none"
								},
								{
									type: "TextBlock",
									text: "19 лет стажа",
									size: "small",
									isSubtle: true,
									wrap: true,
									spacing: "none"
								}
							]
						}
					]
				},
				{
					type: "TextBlock",
					text:
						"«С нуля», подтянуть, улучшить, подготовка к ЕГЭ. В Тушино.",
					size: "default",
					wrap: true
				},
				{
					type: "FactSet",
					facts: [
						{
							title: "Стаж:",
							value: "19 лет"
						},
						{
							title: "Образование:",
							value: "МЭГУ, менеджмент в культуре, 1994"
						},
						{
							title: "График:",
							value: "с 10:00 до 20:00"
						},
						{
							title: "Адрес:",
							value: "Москва, Южное Тушино"
						}
					]
				}
			]
		};
		var renderACIntro = {
			$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
			type: "AdaptiveCard",
			version: "1.0",
			body: [
				{
					type: "TextBlock",
					text: "Специализация",
					size: "medium",
					weight: "default",
					wrap: true,
					spacing: "none"
				},
				{
					type: "TextBlock",
					text:
						"Общий, разговорный, британский американский английский. Подготовка к олимпиаде по английскому языку, международный экзамен IELTS, деловой английский, ОГЭ по английскому языку, ЕГЭ по английскому языку. Также, увлекаюсь веб-разработкой, делаю сайты-визитки.",
					size: "default",
					wrap: true
				}
			]
		};
		var renderACBackground = {
			$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
			type: "AdaptiveCard",
			version: "1.0",
			body: [
				{
					type: "TextBlock",
					text: "Опыт работы",
					size: "medium",
					weight: "default",
					wrap: true,
					spacing: "none"
				},
				{
					type: "TextBlock",
					text:
						"Работал переводчиком в различных некоммерческих организациях (Врачи без границ, United Way, ВКБ ООН и др.), преподавателем английского в частной школе. В настоящий момент преподаю английский школьникам, студентам и взрослым в частном порядке в Тушино.",
					size: "default",
					wrap: true
				},
				{
					type: "ColumnSet",
					columns: [
						{
							type: "Column",
							width: 1,
							items: [
								{
									type: "Image",
									altText: "",
									url:
										"./libs/serguei-uwp/img/shimanskybiz-instagram/@1x/6a6e4f6198cc19aaf08995bfbf390908.jpg",
									size: "stretch"
								}
							]
						}
					]
				}
			]
		};
		var renderACInPerson = {
			$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
			type: "AdaptiveCard",
			version: "1.0",
			body: [
				{
					type: "TextBlock",
					text: "Идивидуально",
					size: "medium",
					weight: "default",
					wrap: true,
					spacing: "none"
				},
				{
					type: "TextBlock",
					text:
						"Английский индивидуально - наиболее эффективный метод образования: вы говорите больше, чем на занятиях в группах. Язык — средство общения, и мерилом служат ваши навыки аудирования, говорения и чтения, но не объем записанных новых слов вкупе с неспособностью общаться на иностранном языке в реальных ситуациях.",
					size: "default",
					wrap: true
				}
			]
		};
		var renderACDiploma1 = {
			$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
			type: "AdaptiveCard",
			version: "1.0",
			body: [
				{
					type: "TextBlock",
					text: "Дипломы",
					size: "medium",
					weight: "default",
					wrap: true,
					spacing: "none"
				},
				{
					type: "TextBlock",
					text:
						"1 место в районной олимпиаде по немецкому языку среди 8-x классов.",
					size: "default",
					wrap: true
				},
				{
					type: "ColumnSet",
					columns: [
						{
							type: "Column",
							width: 1,
							items: [
								{
									type: "Image",
									altText: "",
									url:
										"./libs/serguei-uwp/img/shimanskybiz-instagram/@1x/e58495540679687089b9f86c4b94b5dc.jpg",
									size: "stretch",
									selectAction: {
										type: "Action.OpenUrl",
										title: "Показать картинку",
										url:
											"./libs/serguei-uwp/img/shimanskybiz-instagram/@2x/e58495540679687089b9f86c4b94b5dc.jpg"
									}
								}
							]
						}
					]
				}
			]
		};
		var renderACDiploma2 = {
			$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
			type: "AdaptiveCard",
			version: "1.0",
			body: [
				{
					type: "TextBlock",
					text: "Дипломы",
					size: "medium",
					weight: "default",
					wrap: true,
					spacing: "none"
				},
				{
					type: "TextBlock",
					text:
						"1 место в районной олимпиаде по английскому языку среди 8-x классов.",
					size: "default",
					wrap: true
				},
				{
					type: "ColumnSet",
					columns: [
						{
							type: "Column",
							width: 1,
							items: [
								{
									type: "Image",
									altText: "",
									url:
										"./libs/serguei-uwp/img/shimanskybiz-instagram/@1x/29c50626a6dac85aaa355bacfca2929d.jpg",
									size: "stretch",
									selectAction: {
										type: "Action.OpenUrl",
										title: "Показать картинку",
										url:
											"./libs/serguei-uwp/img/shimanskybiz-instagram/@2x/29c50626a6dac85aaa355bacfca2929d.jpg"
									}
								}
							]
						}
					]
				}
			]
		};
		var renderACDiploma3 = {
			$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
			type: "AdaptiveCard",
			version: "1.0",
			body: [
				{
					type: "TextBlock",
					text: "Дипломы",
					size: "medium",
					weight: "default",
					wrap: true,
					spacing: "none"
				},
				{
					type: "TextBlock",
					text:
						"1 место в районной олимпиаде по английскому языку среди 9-x классов.",
					size: "default",
					wrap: true
				},
				{
					type: "ColumnSet",
					columns: [
						{
							type: "Column",
							width: 1,
							items: [
								{
									type: "Image",
									altText: "",
									url:
										"./libs/serguei-uwp/img/shimanskybiz-instagram/@1x/9d063d1fec85960f81275a0ed1f1529b.jpg",
									size: "stretch",
									selectAction: {
										type: "Action.OpenUrl",
										title: "Показать картинку",
										url:
											"./libs/serguei-uwp/img/shimanskybiz-instagram/@2x/9d063d1fec85960f81275a0ed1f1529b.jpg"
									}
								}
							]
						}
					]
				}
			]
		};
		var renderACDiploma4 = {
			$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
			type: "AdaptiveCard",
			version: "1.0",
			body: [
				{
					type: "TextBlock",
					text: "Дипломы",
					size: "medium",
					weight: "default",
					wrap: true,
					spacing: "none"
				},
				{
					type: "TextBlock",
					text:
						"1 место в районной олимпиаде по английскому языку среди 10-x классов.",
					size: "default",
					wrap: true
				},
				{
					type: "ColumnSet",
					columns: [
						{
							type: "Column",
							width: 1,
							items: [
								{
									type: "Image",
									altText: "",
									url:
										"./libs/serguei-uwp/img/shimanskybiz-instagram/@1x/799463f7476954257d5b45671dc76e0b.jpg",
									size: "stretch",
									selectAction: {
										type: "Action.OpenUrl",
										title: "Показать картинку",
										url:
											"./libs/serguei-uwp/img/shimanskybiz-instagram/@2x/799463f7476954257d5b45671dc76e0b.jpg"
									}
								}
							]
						}
					]
				}
			]
		};
		var renderACContacts = {
			$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
			type: "AdaptiveCard",
			version: "1.0",
			body: [
				{
					type: "TextBlock",
					text: "Контакты",
					size: "medium",
					weight: "default",
					wrap: true,
					spacing: "none"
				},
				{
					type: "ColumnSet",
					columns: [
						{
							type: "Column",
							width: 1,
							items: [
								{
									type: "Image",
									altText: "",
									url:
										"./libs/serguei-uwp/img/sprite-contacts/@1x/sprite-contacts-banner-email-640x640.png",
									size: "stretch",
									style: "person",
									selectAction: {
										type: "Action.OpenUrl",
										title: "Мейл",
										url: "mailto:englishextra2%40yahoo.com"
									}
								}
							]
						},
						{
							type: "Column",
							width: 1,
							items: [
								{
									type: "Image",
									altText: "",
									url:
										"./libs/serguei-uwp/img/sprite-contacts/@1x/sprite-contacts-banner-phone-640x640.png",
									size: "stretch",
									style: "person",
									selectAction: {
										type: "Action.OpenUrl",
										title: "Телефон",
										url: "tel:%2B79854416702"
									}
								}
							]
						},
						{
							type: "Column",
							width: 1,
							items: [
								{
									type: "Image",
									altText: "",
									url:
										"./libs/serguei-uwp/img/sprite-contacts/@1x/sprite-contacts-banner-telegram-640x640.png",
									size: "stretch",
									style: "person",
									selectAction: {
										type: "Action.OpenUrl",
										title: "Телеграм",
										url:
											"tg://resolve?domain=english_tushino"
									}
								}
							]
						},
						{
							type: "Column",
							width: 1,
							items: [
								{
									type: "Image",
									altText: "",
									url:
										"./libs/serguei-uwp/img/sprite-contacts/@1x/sprite-contacts-banner-viber-640x640.png",
									size: "stretch",
									style: "person",
									selectAction: {
										type: "Action.OpenUrl",
										title: "Вайбер",
										url:
											"viber://chat?number=%2B79854416702"
									}
								}
							]
						},
						{
							type: "Column",
							width: 1,
							items: [
								{
									type: "Image",
									altText: "",
									url:
										"./libs/serguei-uwp/img/sprite-contacts/@1x/sprite-contacts-banner-whatsapp-640x640.png",
									size: "stretch",
									style: "person",
									selectAction: {
										type: "Action.OpenUrl",
										title: "Вотсап",
										url: "whatsapp://send?phone=79854416702"
									}
								}
							]
						},
						{
							type: "Column",
							width: 1,
							items: [
								{
									type: "Image",
									altText: "",
									url:
										"./libs/serguei-uwp/img/sprite-contacts/@1x/sprite-contacts-banner-skype-640x640.png",
									size: "stretch",
									style: "person",
									selectAction: {
										type: "Action.OpenUrl",
										title: "Скайп",
										url: "skype:serguei.shimansky?chat"
									}
								}
							]
						}
					]
				}
			]
		};
		/*!
		 * to change default style
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/rendering-cards/host-config}
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/rendering-cards/host-config#adaptivecardconfig}
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/pull/905}
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/issues/1929}
		 * @see {@link https://material.io/tools/color/#!/?view.left=0&view.right=0&secondary.color=BDBDBD&primary.color=F06292}
		 */

		var renderACOptions = {
			fontFamily:
				"Roboto, Segoe UI, Segoe MDL2 Assets, Helvetica Neue, sans-serif",
			containerStyles: {
				default: {
					foregroundColors: {
						default: {
							default: "#212121",
							subtle: "#757575"
						},
						dark: {
							default: "#000000",
							subtle: "#424242"
						},
						light: {
							default: "#757575",
							subtle: "#bdbdbd"
						},
						accent: {
							default: "#0097a7",
							subtle: "#26c6da"
						},
						good: {
							default: "#388e3c",
							subtle: "#66bb6a"
						},
						warning: {
							default: "#e64a19",
							subtle: "#ff7043"
						},
						attention: {
							default: "#d81b60",
							subtle: "#f06292"
						}
					},
					backgroundColor: "#ffffff"
				}
			}
		};
		var macyItems = [
			renderACVCard,
			renderACIntro,
			renderACBackground,
			renderACInPerson,
			renderACDiploma1,
			renderACDiploma2,
			renderACDiploma3,
			renderACDiploma4,
			renderACContacts
		];

		var onExecuteAC = function onExecuteAC(action) {
			if (action.url) {
				root[location].href = action.url;
			}
		};

		var manageAC = function manageAC(macyGrid, callback) {
			if (root.renderAC) {
				var count = 0;
				var i, l;

				for (i = 0, l = macyItems[_length]; i < l; i += 1) {
					renderAC(
						macyGrid,
						macyItems[i],
						renderACOptions,
						onExecuteAC,
						null
					);
					count++;

					if (count === macyItems[_length]) {
						if (callback && "function" === typeof callback) {
							callback();
						}
					}
				}

				i = l = null;
			}
		};

		var glightboxClass = "glightbox";
		/*!
		 * @see {@link https://glightbox.mcstudios.com.mx/#options}
		 */

		root.handleGLightbox = null;

		var manageGlightbox = function manageGlightbox(macyGrid) {
			var initScript = function initScript() {
				if (root.GLightbox) {
					if (root.handleGLightbox) {
						root.handleGLightbox.destroy();
						root.handleGLightbox = null;
					}

					if (macyGrid) {
						root.handleGLightbox = GLightbox({
							selector: glightboxClass
						});
					}
				}
			};

			if (
				!scriptIsLoaded(
					"./cdn/glightbox/1.0.8/js/glightbox.fixed.min.js"
				)
			) {
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

		var dataSrcLazyClass = "data-src-lazy";
		/*!
		 * @see {@link https://github.com/verlok/lazyload}
		 */

		var manageLazyLoad = function manageLazyLoad(dataSrcLazyClass) {
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

		var onImagesLoaded = function onImagesLoaded(macyGrid) {
			if (root.imagesLoaded) {
				var imgLoad;
				imgLoad = new imagesLoaded(macyGrid);

				var onAlways = function onAlways(instance) {
					if (root.updateMacyThrottled) {
						updateMacyThrottled();
					}

					console.log(
						"imagesLoaded: found " +
							instance.images[_length] +
							" images"
					);
				};

				imgLoad.on("always", onAlways);
			}
		};

		var anyResizeEventIsBindedClass = "any-resize-event--is-binded";
		var macyGridClass = "macy-grid";
		var macyGrid = document[getElementsByClassName](macyGridClass)[0] || "";
		var macyGridIsActiveClass = "macy-grid--is-active";

		var onMacyRender = function onMacyRender() {
			macyGrid[classList].add(macyGridIsActiveClass);
			onImagesLoaded(macyGrid);
			manageLazyLoad(dataSrcLazyClass);
			manageExternalLinkAll();
			manageGlightbox(glightboxClass);
			manageReadMore(null, {
				target: ".dummy",
				numOfWords: 10,
				toggle: true,
				moreLink: "БОЛЬШЕ",
				lessLink: "МЕНЬШЕ",
				inline: true,
				customBlockElement: "p"
			});
		};

		var onMacyResize = function onMacyResize() {
			try {
				var container = macyGrid
					? macyGrid.children ||
					  macyGrid[querySelectorAll](
							"." + macyGridClass + " > *"
					  ) ||
					  ""
					: "";

				if (container) {
					var i, l;

					for (i = 0, l = container[_length]; i < l; i += 1) {
						if (
							!container[i][classList].contains(
								anyResizeEventIsBindedClass
							)
						) {
							container[i][classList].add(
								anyResizeEventIsBindedClass
							);

							container[i][_addEventListener](
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
			manageMacy(macyGridClass, {
				trueOrder: false,
				waitForImages: false,
				margin: 20,
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
		/* var macyItems = [
    ]; */

		var macyGridItemIsRenderedClass = "macy-grid__item--is-rendered";

		var addMacyItems = function addMacyItems(macyGrid, callback) {
			if (root.AdaptiveCards) {
				macyGrid.innerHTML = "";
				manageAC(macyGrid, callback);
			} else {
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
        		macyGrid.innerHTML = html.join("");
        		if (callback && "function" === typeof callback) {
        			callback();
        		}
        	}
        }
        i = l = null; */
				macyItems =
					document[getElementsByClassName]("ac-container") || "";
				var count = 0;
				var i, l;

				for (i = 0, l = macyItems[_length]; i < l; i += 1) {
					macyItems[i][classList].add(macyGridItemIsRenderedClass);
					count++;

					if (count === macyItems[_length]) {
						if (callback && "function" === typeof callback) {
							callback();
						}
					}
				}

				i = l = null;
			}
		};

		if (macyGrid) {
			addMacyItems(macyGrid, onMacyManage);
		}

		if (root.manageExternalLinkAll) {
			manageExternalLinkAll();
		}
	};
})("undefined" !== typeof window ? window : this, document);

/*global console, GLightbox, imagesLoaded, LazyLoad, loadJsCss,
manageExternalLinkAll, manageMacy, scriptIsLoaded, updateMacyThrottled*/

/*!
 * page logic
 */
(function(root, document) {
	"use strict";

	var getElementsByClassName = "getElementsByClassName";

	root.runPictures = function() {
		/*var appendChild = "appendChild";*/
		var classList = "classList";
		var querySelectorAll = "querySelectorAll";
		/*var setAttribute = "setAttribute";*/

		var _addEventListener = "addEventListener";
		var _length = "length";
		var glightboxClass = "glightbox";
		/*!
		 * @see {@link https://glightbox.mcstudios.com.mx/#options}
		 */

		root.handleGLightbox = null;

		var manageGlightbox = function manageGlightbox(macyGrid) {
			var initScript = function initScript() {
				if (root.GLightbox) {
					if (root.handleGLightbox) {
						root.handleGLightbox.destroy();
						root.handleGLightbox = null;
					}

					if (macyGrid) {
						root.handleGLightbox = GLightbox({
							selector: glightboxClass
						});
					}
				}
			};

			if (
				!scriptIsLoaded(
					"./cdn/glightbox/1.0.8/js/glightbox.fixed.min.js"
				)
			) {
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

		var dataSrcLazyClass = "data-src-lazy";
		/*!
		 * @see {@link https://github.com/verlok/lazyload}
		 */

		var manageLazyLoad = function manageLazyLoad(dataSrcLazyClass) {
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

		var onImagesLoaded = function onImagesLoaded(macyGrid) {
			if (root.imagesLoaded) {
				var imgLoad;
				imgLoad = new imagesLoaded(macyGrid);

				var onAlways = function onAlways(instance) {
					if (root.updateMacyThrottled) {
						updateMacyThrottled();
					}

					console.log(
						"imagesLoaded: found " +
							instance.images[_length] +
							" images"
					);
				};

				imgLoad.on("always", onAlways);
			}
		};

		var anyResizeEventIsBindedClass = "any-resize-event--is-binded";
		var macyGridClass = "macy-grid";
		var macyGrid = document[getElementsByClassName](macyGridClass)[0] || "";
		var macyGridIsActiveClass = "macy-grid--is-active";

		var onMacyRender = function onMacyRender() {
			macyGrid[classList].add(macyGridIsActiveClass);
			onImagesLoaded(macyGrid);
			manageLazyLoad(dataSrcLazyClass);
			manageExternalLinkAll();
			manageGlightbox(glightboxClass);
		};

		var onMacyResize = function onMacyResize() {
			try {
				var container = macyGrid
					? macyGrid.children ||
					  macyGrid[querySelectorAll](
							"." + macyGridClass + " > *"
					  ) ||
					  ""
					: "";

				if (container) {
					var i, l;

					for (i = 0, l = container[_length]; i < l; i += 1) {
						if (
							!container[i][classList].contains(
								anyResizeEventIsBindedClass
							)
						) {
							container[i][classList].add(
								anyResizeEventIsBindedClass
							);

							container[i][_addEventListener](
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
			manageMacy(macyGridClass, {
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
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26036740714_dd47df27c0_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26036740714_dd47df27c0_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26039009973_ed4b59a832_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26039009973_ed4b59a832_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26039010063_971c7482c2_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26039010063_971c7482c2_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26072583523_34e81c64eb_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26072583523_34e81c64eb_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26074591023_4cdb8c2578_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26074591023_4cdb8c2578_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26075482973_22a9cb2315_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26075482973_22a9cb2315_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26126310843_988c4cd54f_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26126310843_988c4cd54f_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26325951433_b1b2d0f6c9_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26325951433_b1b2d0f6c9_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26351278130_1f5b4f685d_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26351278130_1f5b4f685d_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26576984361_4c33589522_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26576984361_4c33589522_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26584072022_41e887d01a_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26584072022_41e887d01a_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26584858872_01827e6380_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26584858872_01827e6380_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26587130302_94a53b425c_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26587130302_94a53b425c_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26590374066_cfdfd24841_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26590374066_cfdfd24841_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26610286881_f54a485475_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26610286881_f54a485475_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26613969441_9cd6544a40_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26613969441_9cd6544a40_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26633440426_1b8f93b0c4_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26633440426_1b8f93b0c4_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26649748466_1312984841_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26649748466_1312984841_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26657054850_d8e67c6abd_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26657054850_d8e67c6abd_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/26704086846_f0c831d974_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/26704086846_f0c831d974_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/28333662912_b9b1d88c36_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/28333662912_b9b1d88c36_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/32677466200_7b6db6f15d_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/32677466200_7b6db6f15d_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/36136972621_02ff19e368_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/36136972621_02ff19e368_z.jpg"
			},
			{
				src:
					"./libs/serguei-uwp/img/serguei-pictures/@1x/36229259776_09b4755088_z.jpg",
				href:
					"./libs/serguei-uwp/img/serguei-pictures/@2x/36229259776_09b4755088_z.jpg"
			}
		];
		/*var macyGridItemIsRenderedClass = "macy-grid__item--is-rendered";*/

		var addMacyItems = function addMacyItems(macyGrid, callback) {
			var dataSrcImgKeyName = "src";
			var transparentPixel =
				"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201%201%27%2F%3E";
			/*!
			 * @see {@link https://stackoverflow.com/questions/18393981/append-vs-html-vs-innerhtml-performance}
			 */

			var html = [];
			var count = 0;
			var i, l;

			for (i = 0, l = macyItems[_length]; i < l; i += 1) {
				html.push(
					'<a href="' +
						macyItems[i].href +
						'" class="' +
						glightboxClass +
						'" aria-label="Показать картинку"><img src="' +
						transparentPixel +
						'" class="' +
						dataSrcLazyClass +
						'" data-' +
						dataSrcImgKeyName +
						'="' +
						macyItems[i].src +
						'" alt="" /></a>\n'
				);
				count++;

				if (count === macyItems[_length]) {
					macyGrid.innerHTML = html.join("");

					if (callback && "function" === typeof callback) {
						callback();
					}
				}
			}

			i = l = null;
			/* var count = 0;
      var i,
      l;
      for (i = 0, l = macyItems[_length]; i < l; i += 1) {
      	var macyItem = document.createElement("a");
      	macyItem[classList].add(macyGridItemIsRenderedClass);
      	macyItem[setAttribute]("href", macyItems[i].href);
      	macyItem[setAttribute]("class", glightboxClass);
      	macyItem[setAttribute]("aria-label", "Показать картинку");
      	var img = document.createElement("img");
      	macyItem[appendChild](img);
      	img[setAttribute]("src", transparentPixel);
      	img[setAttribute]("class", dataSrcLazyClass);
      	img[setAttribute]("data-" + dataSrcImgKeyName, macyItems[i].src);
      	macyGrid[appendChild](macyItem);
      	count++;
      	if (count === macyItems[_length]) {
      		if (callback && "function" === typeof callback) {
      			callback();
      		}
      	}
      }
      i = l = null; */
		};

		if (macyGrid) {
			addMacyItems(macyGrid, onMacyManage);
		}

		if (root.manageExternalLinkAll) {
			manageExternalLinkAll();
		}
	};
})("undefined" !== typeof window ? window : this, document);

/*global console, imagesLoaded, LazyLoad, manageExternalLinkAll, manageMacy,
updateMacyThrottled*/

/*!
 * page logic
 */
(function(root, document) {
	"use strict";

	var getElementsByClassName = "getElementsByClassName";

	root.runWorks = function() {
		/*var appendChild = "appendChild";*/
		var classList = "classList";
		var querySelectorAll = "querySelectorAll";
		/*var setAttribute = "setAttribute";*/

		var _addEventListener = "addEventListener";
		var _length = "length";
		var dataSrcLazyClass = "data-src-lazy";
		/*!
		 * @see {@link https://github.com/verlok/lazyload}
		 */

		var manageLazyLoad = function manageLazyLoad(dataSrcLazyClass) {
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

		var onImagesLoaded = function onImagesLoaded(macyGrid) {
			if (root.imagesLoaded) {
				var imgLoad;
				imgLoad = new imagesLoaded(macyGrid);

				var onAlways = function onAlways(instance) {
					if (root.updateMacyThrottled) {
						updateMacyThrottled();
					}

					console.log(
						"imagesLoaded: found " +
							instance.images[_length] +
							" images"
					);
				};

				imgLoad.on("always", onAlways);
			}
		};

		var anyResizeEventIsBindedClass = "any-resize-event--is-binded";
		var macyGridClass = "macy-grid";
		var macyGrid = document[getElementsByClassName](macyGridClass)[0] || "";
		var macyGridIsActiveClass = "macy-grid--is-active";

		var onMacyRender = function onMacyRender() {
			macyGrid[classList].add(macyGridIsActiveClass);
			onImagesLoaded(macyGrid);
			manageLazyLoad(dataSrcLazyClass);
			manageExternalLinkAll();
		};

		var onMacyResize = function onMacyResize() {
			try {
				var container = macyGrid
					? macyGrid.children ||
					  macyGrid[querySelectorAll](
							"." + macyGridClass + " > *"
					  ) ||
					  ""
					: "";

				if (container) {
					var i, l;

					for (i = 0, l = container[_length]; i < l; i += 1) {
						if (
							!container[i][classList].contains(
								anyResizeEventIsBindedClass
							)
						) {
							container[i][classList].add(
								anyResizeEventIsBindedClass
							);

							container[i][_addEventListener](
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
			manageMacy(macyGridClass, {
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
				href: "https://build.phonegap.com/apps/1824701/share",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/build.phonegap.com-apps-1824701-share.jpg"
			},
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
				href: "https://github.com/englishextra",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/github.com-englishextra.jpg"
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
			},
			{
				href: "https://www.behance.net/englishextra",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/www.behance.net-englishextra.jpg"
			},
			{
				href: "https://www.domestika.org/en/englishextra",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/www.domestika.org-en-englishextra.jpg"
			},
			{
				href: "https://www.npmjs.com/~englishextra",
				src:
					"./libs/serguei-uwp/img/works-screenshots/@1x/www.npmjs.com-englishextra.jpg"
			}
		];
		/*var macyGridItemIsRenderedClass = "macy-grid__item--is-rendered";*/

		var addMacyItems = function addMacyItems(macyGrid, callback) {
			var dataSrcImgKeyName = "src";
			var transparentPixel =
				"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201%201%27%2F%3E";
			/*!
			 * @see {@link https://stackoverflow.com/questions/18393981/append-vs-html-vs-innerhtml-performance}
			 */

			var html = [];
			var count = 0;
			var i, l;

			for (i = 0, l = macyItems[_length]; i < l; i += 1) {
				html.push(
					'<a href="' +
						macyItems[i].href +
						'" aria-label="Ссылка"><img src="' +
						transparentPixel +
						'" class="' +
						dataSrcLazyClass +
						'" data-' +
						dataSrcImgKeyName +
						'="' +
						macyItems[i].src +
						'" alt="" /></a>\n'
				);
				count++;

				if (count === macyItems[_length]) {
					macyGrid.innerHTML = html.join("");

					if (callback && "function" === typeof callback) {
						callback();
					}
				}
			}

			i = l = null;
			/* var count = 0;
      var i,
      l;
      for (i = 0, l = macyItems[_length]; i < l; i += 1) {
      	var macyItem = document.createElement("a");
      	macyItem[classList].add(macyGridItemIsRenderedClass);
      	macyItem[setAttribute]("href", macyItems[i].href);
      	macyItem[setAttribute]("aria-label", "Ссылка");
      	var img = document.createElement("img");
      	macyItem[appendChild](img);
      	img[setAttribute]("src", transparentPixel);
      	img[setAttribute]("class", dataSrcLazyClass);
      	img[setAttribute]("data-" + dataSrcImgKeyName, macyItems[i].src);
      	macyGrid[appendChild](macyItem);
      	count++;
      	if (count === macyItems[_length]) {
      		if (callback && "function" === typeof callback) {
      			callback();
      		}
      	}
      }
      i = l = null; */
		};

		if (macyGrid) {
			addMacyItems(macyGrid, onMacyManage);
		}

		if (root.manageExternalLinkAll) {
			manageExternalLinkAll();
		}
	};
})("undefined" !== typeof window ? window : this, document);
