"use strict";

/*global console, GLightbox, imagesLoaded, LazyLoad, loadJsCss,
manageExternalLinkAll, manageMacy, manageReadMore, scriptIsLoaded,
updateMacyThrottled*/

/*!
 * page logic
 */
(function (root, document) {
  "use strict";

  var run = function run() {
    var classList = "classList";
    var getElementsByClassName = "getElementsByClassName";
    var querySelectorAll = "querySelectorAll";
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

      if (!scriptIsLoaded("../../cdn/glightbox/1.0.8/js/glightbox.fixed.min.js")) {
        var load;
        load = new loadJsCss(["../../cdn/glightbox/1.0.8/css/glightbox.fixed.min.css", "../../cdn/glightbox/1.0.8/js/glightbox.fixed.min.js"], initScript);
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

          console.log("imagesLoaded: found " + instance.images[_length] + " images");
        };

        imgLoad.on("always", onAlways);
      }
    };

    var isBindedMacyItemClass = "is-binded-macy-item";
    var macyGridClass = "macy-grid";
    var macyGrid = document[getElementsByClassName](macyGridClass)[0] || "";

    var onMacyRender = function onMacyRender() {
      updateMacyThrottled();
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
        var container = macyGrid ? macyGrid.children || macyGrid[querySelectorAll]("." + macyGridClass + " > *") || "" : "";

        if (container) {
          var i, l;

          for (i = 0, l = container[_length]; i < l; i += 1) {
            if (!container[i][classList].contains(isBindedMacyItemClass)) {
              container[i][classList].add(isBindedMacyItemClass);

              container[i][_addEventListener]("onresize", updateMacyThrottled, {
                passive: true
              });
            }
          }

          i = l = null;
        }
      } catch (err) {
        throw new Error("cannot onMacyResize " + err);
      }
    };

    var onMacyManage = function onMacyManage() {
      onMacyRender();
      onMacyResize();
    };

    var addMacyItems = function addMacyItems(macyGrid, callback) {
      if ("function" === typeof callback) {
        callback();
      }
    };

    if (macyGrid) {
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
      addMacyItems(macyGrid, onMacyManage);
    }

    if (root.manageExternalLinkAll) {
      manageExternalLinkAll();
    }
  };

  run();
})("undefined" !== typeof window ? window : void 0, document);