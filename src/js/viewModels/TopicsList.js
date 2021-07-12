/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Module representing a list of Topics with a header area
 * containing company logo, company name, Contact Us and About Us Links.
 */
define([
  'ojs/ojrouter',
  'knockout',
  'js/scripts/server-config-utils.js',
  'js/scripts/services.js',
  'js/scripts/utils.js',
  'ojs/ojarraydataprovider',
  'ojs/ojmodule-element-utils',
  'ojs/ojmodule-element',
  'ojs/ojprogress',
  'ojs/ojlistview'
],
function (
  Router, ko, serverConfigUtils, services, utils, ArrayDataProvider, ModuleElementUtils
) {
  /**
   * The view model for the main content view template
   */
  function TopicsListViewModel() {
    // set the browser tab title
    document.title = 'Topics';

    const self = this;
    const router = Router.rootInstance;
    self.ModuleElementUtils = ModuleElementUtils;

    // Progress spinner displayed whilst data is loading
    self.progressValue = ko.observable(0);
    window.setInterval(function () {
      if (self.progressValue() !== -1) {
        self.progressValue(self.progressValue() + 1);
      }
    }, 30);

    // create observables which are referenced in the HTML and will have thier
    // value set when the data is obtained from the server
    self.companyName = ko.observable();
    self.companyThumbnailUrl = ko.observable();
    self.aboutUrl = ko.observable();
    self.contactUrl = ko.observable();
    self.loading = ko.observable(true);
    self.error = ko.observable(false);

    // Get the data from the server
    serverConfigUtils.getClient
      .then((client) => {
        // get the top level item which contains the following information
        // - aboutURL, contactURL, company thumbnail url, company title, list of topics
        services.fetchHomePage(client)
          .then((topLevelItem) => {
            services.getRenditionURL(client, topLevelItem.logoID)
              .then((url) => {
                // list items
                self.topics = topLevelItem.topics;
                this.dataProvider = new ArrayDataProvider(self.topics, { keyAttributes: 'id' });

                // company title and logo thumbnail
                self.companyName(topLevelItem.title);
                utils.getImageUrl(url)
                  .then((formattedUrl) => self.companyThumbnailUrl(formattedUrl));

                // contact us and about us URLs
                self.aboutUrl(topLevelItem.aboutUrl);
                self.contactUrl(topLevelItem.contactUrl);

                self.loading(false);
              })
              .catch((error) => {
                self.error(true);
                console.error(error);
              });
          })
          .catch((error) => {
            self.error(true);
            console.error(error);
          });
      })
      .catch((error) => {
        self.error(true);
        console.error(error);
      }); // Error parsing server configuration JSON file

    // On click method to take the user the list of articles for the selected topic
    this.topicSelectedOnClick = function (event) {
      if (event.detail.value != null && event.detail.value.length > 0) {
        let topic = self.topics.find(o => o.id === event.detail.value[0]);
        router.go('articles/' + topic.id);
      }
    };
  }

  return TopicsListViewModel;
});
