/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Module representing a Topic displayed in a list of topics.
 */
define([
  'knockout',
  'contentsdk',
  'js/scripts/server-config-utils.js',
  'js/scripts/services.js',
], function (ko, contentSDK, serverConfigUtils, services) {
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

    // Get the server configuration from the "oce.json" file
    serverConfigUtils.parseServerConfig
      .then((serverconfig) => {
        // get the client to connect to CEC
        const deliveryClient = contentSDK.createDeliveryClient(serverconfig);

        // get the top level item which contains the following information
        // - aboutURL / contactURL / thumbnailURL / company title
        // - array of topic ids : These are passed to TopicsList
        services.fetchTopic(deliveryClient, topicId)
          .then((topic) => {
            self.title(topic.name);
            self.description(topic.description);

            services.getMediumRenditionURL(deliveryClient, topic.fields.thumbnail.id)
              .then((thumbnailUrl) => {
                self.url(thumbnailUrl);
              })
              .catch((error) => console.error(error));
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error)); // Error parsing server configuration JSON file
  }

  return TopicListItemContentViewModel;
});
