/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Module representing Article details.
 */
define([
  'knockout',
  'ojs/ojrouter',
  'contentsdk',
  'js/scripts/server-config-utils.js',
  'js/scripts/services.js',
  'js/scripts/utils.js',
  'ojs/ojhtmlutils',
  'ojs/ojbinddom',
  'ojs/ojprogress',
  'xss'
], function (ko, Router, contentSDK, serverConfigUtils, services, utils, HtmlUtils) {
  /**
   * The view model for the main content view template
   */
  function ArticleDetailsContentViewModel() {
    const articleDetailsXssOptions = {
      stripIgnoreTag: true, // filter out all HTML not in the whitelist
      stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
      // to filter out its content
    };

    // set the browser tab title
    document.title = 'Article';

    const self = this;
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
    const articleId = stateParams.articleId();
    self.topicId = stateParams.topicId();
    self.topicName = stateParams.topicName();

    // create observables which are referenced in the HTML and will have thier
    // value set when the data is obtained from the server
    self.articleName = ko.observable();
    self.authorName = ko.observable();
    self.formattedDate = ko.observable();
    self.articleImageCaption = ko.observable();
    self.articleImageUrl = ko.observable();
    self.authorAvatarUrl = ko.observable();
    self.articleContentConfig = ko.observable({
      view: '',
      data: {},
    });
    self.loading = ko.observable(true);
    self.error = ko.observable(false);

    // Get the server configuration from the "oce.json" file
    serverConfigUtils.parseServerConfig
      .then((serverconfig) => {
        // get the client to connect to CEC
        const deliveryClient = contentSDK.createDeliveryClient(serverconfig);

        // Get the article details
        services.fetchArticle(deliveryClient, articleId)
          .then((article) => {
            self.articleName(article.name);
            self.authorName(article.fields.author.name);
            self.formattedDate(`Posted on ${utils.dateToMDY(article.fields.published_date.value)}`);
            self.articleImageCaption(article.fields.image_caption);

            let content = article.fields.article_content;
            self.articleContentConfig({
              // ensure there is no script injection attack in the article content
              // eslint-disable-next-line no-undef
              view: HtmlUtils.stringToNodeArray(filterXSS(content, articleDetailsXssOptions)),
              data: {},
            });

            // get the article image URL
            services.getRenditionURL(deliveryClient, article.fields.image.id)
              .then((renditionUrl) => {
                self.articleImageUrl(renditionUrl);

                // Get the authors avatar image
                services.getMediumRenditionURL(
                  deliveryClient, article.fields.author.fields.avatar.id
                )
                  .then((thumbnailUrl) => {
                    self.authorAvatarUrl(thumbnailUrl);
                    self.loading(false);
                  });
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


    // On click method to take the user back to the main home page
    this.homeSelectedOnClick = () => {
      router.go('topics');
    };

    // On click method to take the user back to the list of articles for the topic
    this.topicSelectedOnClick = () => {
      router.go(`articles/${self.topicId}/${self.topicName}`);
    };
  }

  return ArticleDetailsContentViewModel;
});
