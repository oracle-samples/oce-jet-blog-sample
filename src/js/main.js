/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

// The UserAgent is used to detect IE11. Only IE11 requires ES5.
(function () {
  function ojIsIE11() {
    const nAgt = navigator.userAgent;
    return nAgt.indexOf('MSIE') !== -1 || !!nAgt.match(/Trident.*rv:11./);
  }
  const ojNeedsES5 = ojIsIE11();

  // eslint-disable-next-line no-undef
  requirejs.config(
    {
      baseUrl: '/js',

      // Path mappings for the logical module names
      // Update the main-release-paths.json for release mode when updating the mappings
      // do not include the '.js' extensions here as they will
      // automatically be added
      // The point of these paths is in the "require" statements in your JavaScript
      // files you can use the name on the left of the : which maps the to actual
      // JavaScript file on the right of the :
      //    'services': 'scripts/services',
      paths:
      /*
       * Note: The comments above and below the following block are required, do NOT delete them.
       * When you build or serve the application, the tooling relies on the presence of
       * these injector comments to inject release-specific library paths in main.js.
       */
      // injector:mainReleasePaths
      {
        knockout: 'libs/knockout/knockout-3.5.0.debug',
        jquery: 'libs/jquery/jquery-3.5.1',
        'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.1',
        hammerjs: 'libs/hammer/hammer-2.0.8',
        ojdnd: 'libs/dnd-polyfill/dnd-polyfill-1.0.1',
        ojs: `libs/oj/v8.3.1/debug${ojNeedsES5 ? '_es5' : ''}`,
        ojL10n: 'libs/oj/v8.3.1/ojL10n',
        ojtranslations: 'libs/oj/v8.3.1/resources',
        text: 'libs/require/text',
        signals: 'libs/js-signals/signals',
        customElements: 'libs/webcomponents/custom-elements.min',
        proj4: 'libs/proj4js/dist/proj4-src',
        css: 'libs/require-css/css.min',
        touchr: 'libs/touchr/touchr',
        corejs: 'libs/corejs/shim',
        'regenerator-runtime': 'libs/regenerator-runtime/runtime',
        contentsdk: 'libs/contentsdk/content.min',
        xss: 'libs/xss/xss',
      },
      shim: {
        xss: { exports: 'filterXSS' }
      }
      // endinjector
    },
  );
}());

/**
 * A top-level require call executed by the Application.
 *
 * Although 'knockout' is loaded in any case (it is specified as dependencies by the modules
 * themselves), it is listed here explicitly to get the references to the 'ko' objects
 * in the callback
 */
require(['ojs/ojbootstrap', 'knockout', 'appController', 'ojs/ojlogger',
  'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojmodule'],
function (Bootstrap, ko, app, Logger, Router) {
  Bootstrap.whenDocumentReady().then(
    function () {
      function init() {
        Router.sync().then(
          function () {
            app.loadModule();
            // Bind your ViewModel for the content of the whole page body.
            ko.applyBindings(app, document.getElementById('routing-container'));
          },
          function (error) {
            Logger.error('Error in root start: ' + error.message);
          }
        );
      }

      // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
      // event before executing any code that might interact with Cordova APIs or plugins.
      if (document.body.classList.contains('oj-hybrid')) {
        document.addEventListener('deviceready', init);
      } else {
        init();
      }
    });
});
