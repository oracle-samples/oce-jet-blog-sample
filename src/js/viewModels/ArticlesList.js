/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Module representing a list of Articles with a breadcrumb bar at the top.
 */
define([
  'knockout',
  'ojs/ojrouter',
  'js/scripts/server-config-utils.js',
  'js/scripts/services.js',
  'ojs/ojarraydataprovider',
  'ojs/ojmodule-element-utils',
  'ojs/ojmodule-element',
  'ojs/ojprogress',
  'ojs/ojlistview'
],
function (
  ko, Router, serverConfigUtils, services, ArrayDataProvider, ModuleElementUtils
) {
  /**
   * The view model for the main content view template
   */
  function ArticlesListContentViewModel() {
    // set the browser tab title
    document.title = 'Articles';

    const self = this;
    self.ModuleElementUtils = ModuleElementUtils;

    const router = Router.rootInstance;

    // Progress spinner displayed whilst data is loading
    self.progressValue = ko.observable(0);
    window.setInterval(function () {
      if (self.progressValue() !== -1) {
        self.progressValue(self.progressValue() + 1);
      }
    }, 30);

    // Retrieve the state parameters from the router parameters
    // (i.e. the values passed to this module via the router)
    const stateParams = router.observableModuleConfig().params.ojRouter.parameters;
    self.topicId = stateParams.topicId();

    // create observables which are referenced in the HTML and will have thier
    // value set when the data is obtained from the server
    self.loading = ko.observable(true);
    self.error = ko.observable(false);
    self.topicName = ko.observableArray();

    // Get the data from the server
    serverConfigUtils.getClient
      .then((client) => {
        // get the topic name to display in the breadcrumbs
        // the topic's list, which handles the navigation to the articles list,
        // does not contain the topic name, therefore we have to get it here
        services.fetchTopic(client, self.topicId)
          .then((topic) => {
            self.topicName(topic.name);
          });

        // fetch the articles for the topic
        services.fetchArticles(client, self.topicId)
          .then((retrievedArticles) => {
            self.articles = retrievedArticles;
            this.dataProvider = new ArrayDataProvider(retrievedArticles, { keyAttributes: 'id' });
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
      }); // Error parsing server configuration JSON file

    // On click method to take the user back to the main home page
    this.homeSelectedOnClick = function () {
      router.go('topics');
    };

    // On click method to take the user the article details for the selected article
    this.articleSelectedOnClick = function (event) {
      if (event.detail.value != null && event.detail.value.length > 0) {
        let article = self.articles.find(o => o.id === event.detail.value[0]);
        router.go('article/' + article.id + '/' + self.topicId + '/' + self.topicName());
      }
    };
  }

  return ArticlesListContentViewModel;
});
