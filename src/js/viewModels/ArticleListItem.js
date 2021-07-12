/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * ArticleListItem module
 */
define([
  'knockout',
  'js/scripts/server-config-utils.js',
  'js/scripts/services.js',
  'js/scripts/utils.js',
], function (ko, serverConfigUtils, services, utils) {
  /**
   * The view model for the main content view template
   */
  function ArticleListItemContentViewModel(params) {
    const self = this;

    // get the data passed into this module in the HTML
    const article = params.article.data; // article is an object, therefore need ".data"
    self.topicId = params.topicId;
    self.topicName = params.topicName;
    self.articleId = article.id;
    self.articleName = article.name;
    self.formattedDate = `Posted on ${utils.dateToMDY(article.fields.published_date.value)}`;
    self.description = article.description;

    // create observables which are referenced in the HTML and will have thier
    // value set when the data is obtained from the server
    self.articleUrl = ko.observable();

    // Get the data from the server
    serverConfigUtils.getClient
      .then((client) => {
        services.getMediumRenditionURL(client, article.fields.image.id)
          .then((url) => {
            utils.getImageUrl(url)
              .then((formattedUrl) => self.articleUrl(formattedUrl));
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error)); // Error parsing server configuration JSON file
  }

  return ArticleListItemContentViewModel;
});
