/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Module representing a Topic displayed in a list of topics.
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
  function TopicListItemContentViewModel(params) {
    const self = this;

    // get the topicID that was passed into this module in the HTML
    var passedInTopic = params.topic.data;
    var topicId = passedInTopic.id;

    // create observables which are referenced in the HTML and will have thier
    // value set when the data is obtained from the server
    self.title = ko.observable();
    self.url = ko.observable();
    self.description = ko.observable();

    // Get the data from the server
    serverConfigUtils.getClient
      .then((client) => {
        // get the top level item which contains the following information
        // - aboutURL / contactURL / thumbnailURL / company title
        // - array of topic ids : These are passed to TopicsList
        services.fetchTopic(client, topicId)
          .then((topic) => {
            self.title(topic.name);
            self.description(topic.description);

            services.getMediumRenditionURL(client, topic.fields.thumbnail.id)
              .then((thumbnailUrl) => {
                utils.getImageUrl(thumbnailUrl)
                  .then((formattedUrl) => self.url(formattedUrl));
              })
              .catch((error) => console.error(error));
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error)); // Error parsing server configuration JSON file
  }

  return TopicListItemContentViewModel;
});
