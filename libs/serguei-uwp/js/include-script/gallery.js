/*jslint browser: true */

/*jslint node: true */

/*global addClass, manageMacyItemAll, dataSrcImgClass, getByClass, lightGallery,
loadJsCss, macyClass, macyIsActiveClass, macyItemIsBindedClass,
manageDataSrcImgAll, manageExternalLinkAll, manageMacy, onMacyImagesLoaded,
updateMacyThrottled*/

/*!
 * page logic
 */
(function(root, document) {
	"use strict";

	root.runGallery = function() {
		/*!
		 * @see {@link https://sachinchoolur.github.io/lightgallery.js/docs/api.html}
		 */
		root.handleLightGallery = null;

		var manageLightGallery = function manageLightGallery(containerClass) {
			var container = getByClass(document, containerClass)[0] || "";

			var initScript = function initScript() {
				if (root.handleLightGallery) {
					root.handleLightGallery.destroy(true);
					root.handleLightGallery = null;
				}

				root.handleLightGallery = lightGallery(container, {
					autoplay: false,
					autoplayControls: false,
					hash: false,
					share: false
				});
			};

			if (container) {
				if (!root.lightGallery) {
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
			}
		};

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
			manageLightGallery(macyClass);
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

		var addMacyItems = function addMacyItems(macy, callback) {
			var transparentPixel =
				"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201%201%27%2F%3E";
			var html = [];
			var count = 0;
			var i, l;

			for (i = 0, l = macyItems.length; i < l; i += 1) {
				html.push(
					'<a href="' +
						macyItems[i].href +
						'" class="' +
						macyItemIsBindedClass +
						'"  aria-label="Показать картинку"><img src="' +
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
