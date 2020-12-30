/*jslint browser: true */

/*jslint node: true */

/*global addClass, manageMacyItemAll, getByClass, GLightbox, loadJsCss,
macyClass, macyIsActiveClass, macyItemIsBindedClass, manageDataSrcImgAll,
manageExternalLinkAll, manageMacy, manageReadMore, onMacyImagesLoaded,
revealYandexMap, updateMacyThrottled*/

/*!
 * page logic
 */
(function(root, document) {
    "use strict";

    root.runAbout = function() {

        /*!
         * @see {@link https://glightbox.mcstudios.com.mx/#options}
         */
        var glightboxClass = "glightbox";
        root.handleGLightbox = null;

        var manageGLightbox = function manageGLightbox(linkClass) {
            var link = getByClass(document, linkClass)[0] || "";

            var initScript = function initScript() {
                if (root.handleGLightbox) {
                    root.handleGLightbox.destroy();
                    root.handleGLightbox = null;
                }

                root.handleGLightbox = new GLightbox({
                    selector: linkClass
                });
            };

            if (link) {
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
            }
        };

        var macy = getByClass(document, macyClass)[0] || "";

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
            addClass(macy, macyIsActiveClass);
            onMacyImagesLoaded(macy, updateMacyThrottled);
            manageMacyItemAll(macy);
            manageDataSrcImgAll(updateMacyThrottled);
            manageExternalLinkAll();
            manageGLightbox(glightboxClass);
            manageReadMore(updateMacyThrottled);
        };

        var macyItems = [];

        var addMacyItems = function addMacyItems(macy, callback) {
            macyItems = getByClass(document, "col") || "";
            var count = 0;
            var i,
                l;
            for (i = 0, l = macyItems.length; i < l; i += 1) {
                addClass(macyItems[i], macyItemIsBindedClass);
                count++;
                if (count === macyItems.length) {
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

        var macyItems = [{
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/chajkhona_1_lodochnaja_ul_4.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/chajkhona_1_lodochnaja_ul_4.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/chastnaja_shkola_shevr_ul_svobody_31_str_1.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/chastnaja_shkola_shevr_ul_svobody_31_str_1.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/chitaj_gorod_skhodnjenskaja_ul_50.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/chitaj_gorod_skhodnjenskaja_ul_50.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/chudo_tandyr_ul_fabriciusa_22_korp_1.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/chudo_tandyr_ul_fabriciusa_22_korp_1.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/cjentr_gosuslug_mfc_ul_vasilija_pjetushkova_13_korp_1.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/cjentr_gosuslug_mfc_ul_vasilija_pjetushkova_13_korp_1.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/cjentr_inostrannykh_jazykov_ul_svobody_31_str_1.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/cjentr_inostrannykh_jazykov_ul_svobody_31_str_1.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/cjentr_zhilishhnykh_subsidij_shturval_naja_ul_5_str_1.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/cjentr_zhilishhnykh_subsidij_shturval_naja_ul_5_str_1.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/ekran_optika_skhodnjenskaja_ul_3611.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/ekran_optika_skhodnjenskaja_ul_3611.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/english_time_bul_jana_rajnisa_1_etazh_1.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/english_time_bul_jana_rajnisa_1_etazh_1.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/fotografija_ul_svobody_249.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/fotografija_ul_svobody_249.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/foto_na_khimkinskom_khimkinskij_bul_17.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/foto_na_khimkinskom_khimkinskij_bul_17.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/foto_svoboda_bul_jana_rajnisa_1_1_etazh.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/foto_svoboda_bul_jana_rajnisa_1_1_etazh.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/ifns_rossii_33_pokhodnyj_pr_3.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/ifns_rossii_33_pokhodnyj_pr_3.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/kafje_bar_burovaja_ul_tushinskaja_16_str_4.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/kafje_bar_burovaja_ul_tushinskaja_16_str_4.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/kafje_kulinarija_skhodnjenskaja_ul_4417.jpg.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/kafje_kulinarija_skhodnjenskaja_ul_4417.jpg.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/kafje_ljegjenda_ul_svobody_71_korp_3.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/kafje_ljegjenda_ul_svobody_71_korp_3.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/kinotjeatr_baltika_ul_skhodnjenskaja_56.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/kinotjeatr_baltika_ul_skhodnjenskaja_56.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/kinotjeatr_poljet_ul_njelidovskaja_10.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/kinotjeatr_poljet_ul_njelidovskaja_10.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/konsul_grupp_ul_svobody_50.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/konsul_grupp_ul_svobody_50.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/kul_turnyj_cjentr_saljut_ul_svobody_37.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/kul_turnyj_cjentr_saljut_ul_svobody_37.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/lavstor_ul_svobody_42.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/lavstor_ul_svobody_42.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/na_khimkinskom_khimkinskij_bul_17.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/na_khimkinskom_khimkinskij_bul_17.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/notarius_panfjerova_je_b_adrjes_ul_svobody_42.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/notarius_panfjerova_je_b_adrjes_ul_svobody_42.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/ods_4_dispjetchjerskaja_shturval_naja_ul_5_str_1.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/ods_4_dispjetchjerskaja_shturval_naja_ul_5_str_1.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/parikmakhjerskaja_miljena_njelidovskaja_ul_1744.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/parikmakhjerskaja_miljena_njelidovskaja_ul_1744.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/parikmakhjerskaja_parusnyj_pr_6.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/parikmakhjerskaja_parusnyj_pr_6.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/parikmakhjerskaja_ul_svobody_1510.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/parikmakhjerskaja_ul_svobody_1510.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/park_sjevjernoje_tushino_ul_svobody_56.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/park_sjevjernoje_tushino_ul_svobody_56.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/pfr_juzhnoje_tushino_njelidovskaja_ul_23_korp_2.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/pfr_juzhnoje_tushino_njelidovskaja_ul_23_korp_2.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/pokrovskij_ul_svobody_1510.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/pokrovskij_ul_svobody_1510.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/policvjet_ul_fabriciusa_14.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/policvjet_ul_fabriciusa_14.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/profmastjer_ul_svobody_42.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/profmastjer_ul_svobody_42.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/rjepjetitor_sjergjej_shimanskij_pr_dosflota_3.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/rjepjetitor_sjergjej_shimanskij_pr_dosflota_3.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/rjestoran_tanuki_ul_svobody_48_korp_1.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/rjestoran_tanuki_ul_svobody_48_korp_1.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/salon_atmosfjera_krasoty_ul_svobody_42.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/salon_atmosfjera_krasoty_ul_svobody_42.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/salon_optiki_glazochki_ul_svobody_45_str_1.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/salon_optiki_glazochki_ul_svobody_45_str_1.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/stadion_saljut_lodochnaja_ul_15.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/stadion_saljut_lodochnaja_ul_15.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/status_vjet_ul_svobody_39.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/status_vjet_ul_svobody_39.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/traktir_na_lodochnoj_ul_svobody_35_str_39.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/traktir_na_lodochnoj_ul_svobody_35_str_39.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/tushinskij_stroitjel_bul_jana_rajnisa_8.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/tushinskij_stroitjel_bul_jana_rajnisa_8.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/vjetjerinarnyj_cjentr_gjerstjendorf_ul_svobody_29.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/vjetjerinarnyj_cjentr_gjerstjendorf_ul_svobody_29.jpg"
            },
            {
                href: "./libs/serguei-uwp/img/mytushino-gallery/@2x/zhantil_khimkinskij_bul_17.jpg",
                src: "./libs/serguei-uwp/img/mytushino-gallery/@1x/zhantil_khimkinskij_bul_17.jpg"
            }
        ];

        var addMacyItems = function addMacyItems(macy, callback) {
            var transparentPixel =
                "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201%201%27%2F%3E";
            var html = [];
            var count = 0;
            var i,
                l;
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

/*jslint browser: true */

/*jslint node: true */

/*global addClass, manageMacyItemAll, getByClass, macyClass, macyIsActiveClass,
macyItemIsBindedClass, manageDataSrcImgAll, manageExternalLinkAll, manageMacy,
manageReadMore, onMacyImagesLoaded, revealYandexMap, updateMacyThrottled*/

/*!
 * page logic
 */
(function(root, document) {
    "use strict";

    root.runHome = function() {

        /*!
         * @see {@link https://glightbox.mcstudios.com.mx/#options}
         */
        var glightboxClass = "glightbox";

        root.handleGLightbox = null;
        var manageGLightbox = function(linkClass) {
            var link = getByClass(document, linkClass)[0] || "";
            var initScript = function() {
                if (root.handleGLightbox) {
                    root.handleGLightbox.destroy();
                    root.handleGLightbox = null;
                }
                root.handleGLightbox = new GLightbox({
                    selector: linkClass
                });
            };
            if (link) {
                if (!root.GLightbox) {
                    var load;
                    load = new loadJsCss(["./cdn/glightbox/1.0.8/css/glightbox.fixed.min.css",
                        "./cdn/glightbox/1.0.8/js/glightbox.fixed.min.js"
                    ], initScript);
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
            addClass(macy, macyIsActiveClass);
            onMacyImagesLoaded(macy, updateMacyThrottled);
            manageMacyItemAll(macy);
            manageDataSrcImgAll(updateMacyThrottled);
            manageExternalLinkAll();
            manageGLightbox(glightboxClass);
            manageReadMore(updateMacyThrottled);
            revealYandexMap();
        };

        var macyItems = [];

        var addMacyItems = function addMacyItems(macy, callback) {
            macyItems = getByClass(document, "col") || "";
            var count = 0;
            var i,
                l;
            for (i = 0, l = macyItems.length; i < l; i += 1) {
                addClass(macyItems[i], macyItemIsBindedClass);
                count++;
                if (count === macyItems.length) {
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

/*jslint browser: true */

/*jslint node: true */

/*global addClass, manageMacyItemAll, dataSrcImgClass, getByClass, GLightbox,
loadJsCss, macyClass, macyIsActiveClass, macyItemIsBindedClass,
manageDataSrcImgAll, manageExternalLinkAll, manageMacy, onMacyImagesLoaded,
updateMacyThrottled*/

/*!
 * page logic
 */
(function(root, document) {
    "use strict";

    root.runPictures = function() {

        /*!
         * @see {@link https://glightbox.mcstudios.com.mx/#options}
         */
        var glightboxClass = "glightbox";
        root.handleGLightbox = null;

        var manageGLightbox = function manageGLightbox(linkClass) {
            var link = getByClass(document, linkClass)[0] || "";

            var initScript = function initScript() {
                if (root.handleGLightbox) {
                    root.handleGLightbox.destroy();
                    root.handleGLightbox = null;
                }

                root.handleGLightbox = new GLightbox({
                    selector: linkClass
                });
            };

            if (link) {
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
            manageGLightbox(glightboxClass);
        };

        var macyItems = [{
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26036740714_dd47df27c0_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26036740714_dd47df27c0_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26039009973_ed4b59a832_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26039009973_ed4b59a832_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26039010063_971c7482c2_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26039010063_971c7482c2_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26072583523_34e81c64eb_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26072583523_34e81c64eb_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26074591023_4cdb8c2578_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26074591023_4cdb8c2578_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26075482973_22a9cb2315_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26075482973_22a9cb2315_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26126310843_988c4cd54f_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26126310843_988c4cd54f_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26325951433_b1b2d0f6c9_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26325951433_b1b2d0f6c9_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26351278130_1f5b4f685d_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26351278130_1f5b4f685d_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26576984361_4c33589522_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26576984361_4c33589522_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26584072022_41e887d01a_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26584072022_41e887d01a_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26584858872_01827e6380_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26584858872_01827e6380_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26587130302_94a53b425c_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26587130302_94a53b425c_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26590374066_cfdfd24841_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26590374066_cfdfd24841_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26610286881_f54a485475_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26610286881_f54a485475_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26613969441_9cd6544a40_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26613969441_9cd6544a40_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26633440426_1b8f93b0c4_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26633440426_1b8f93b0c4_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26649748466_1312984841_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26649748466_1312984841_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26657054850_d8e67c6abd_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26657054850_d8e67c6abd_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/26704086846_f0c831d974_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/26704086846_f0c831d974_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/28333662912_b9b1d88c36_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/28333662912_b9b1d88c36_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/32677466200_7b6db6f15d_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/32677466200_7b6db6f15d_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/36136972621_02ff19e368_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/36136972621_02ff19e368_z.jpg"
            },
            {
                src: "./libs/serguei-uwp/img/serguei-pictures/@1x/36229259776_09b4755088_z.jpg",
                href: "./libs/serguei-uwp/img/serguei-pictures/@2x/36229259776_09b4755088_z.jpg"
            }
        ];

        var addMacyItems = function addMacyItems(macy, callback) {
            var transparentPixel =
                "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201%201%27%2F%3E";
            var html = [];
            var count = 0;
            var i,
                l;
            for (i = 0, l = macyItems.length; i < l; i += 1) {
                html.push(
                    '<a href="' +
                    macyItems[i].href +
                    '" class="' +
                    glightboxClass +
                    " " +
                    macyItemIsBindedClass +
                    '" aria-label="Показать картинку"><img src="' +
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

        var macyItems = [{
                href: "https://englishextra.github.io/403.html",
                src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-403-html.jpg"
            },
            {
                href: "https://englishextra.github.io/404.html",
                src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-404-html.jpg"
            },
            {
                href: "https://englishextra.github.io/pages/more/more_irregular_verbs.html",
                src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-pages-more-more_irregular_verbs-html.jpg"
            },
            {
                href: "https://englishextra.github.io/pages/more/more_newsletter_can_get_english_for_free.html",
                src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-pages-more-more_newsletter_can_get_english_for_free-html.jpg"
            },
            {
                href: "https://englishextra.github.io/serguei/about.html",
                src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-serguei-about-html.jpg"
            },
            {
                href: "https://englishextra.github.io/serguei/slides.html",
                src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-serguei-slides-html.jpg"
            },
            {
                href: "https://englishextra.github.io/",
                src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io.jpg"
            },
            {
                href: "https://englishextra.gitlab.io/",
                src: "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.gitlab.io.jpg"
            },
            {
                href: "https://mytushino.github.io/",
                src: "./libs/serguei-uwp/img/works-screenshots/@1x/mytushino.github.io.jpg"
            },
            {
                href: "https://noushevr.github.io/",
                src: "./libs/serguei-uwp/img/works-screenshots/@1x/noushevr.github.io.jpg"
            }
        ];

        var addMacyItems = function addMacyItems(macy, callback) {
            var transparentPixel =
                "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%201%201%27%2F%3E";
            var html = [];
            var count = 0;
            var i,
                l;
            for (i = 0, l = macyItems.length; i < l; i += 1) {
                html.push(
                    '<a href="' +
                    macyItems[i].href +
                    '" data-src="' +
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
