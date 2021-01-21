/* eslint-disable no-param-reassign */

/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

define(['knockout', 'ojs/ojmodule-element-utils', 'ojs/ojrouter', 'ojs/ojarraydataprovider',
  'ojs/ojknockouttemplateutils', 'ojs/ojmodule-element', 'ojs/ojknockout'],
function (ko, moduleUtils, Router) {
  function ControllerViewModel() {
    var self = this;

    // Router setup
    self.router = Router.rootInstance;
    self.router.configure({
      topics:
        { label: 'topics', value: 'TopicsList', isDefault: true },
      'articles/{topicId}':
        { label: 'article', value: 'ArticlesList' },
      'article/{articleId}/{topicId}/{topicName}':
        { label: 'article', value: 'ArticleDetails' },
    });
    // eslint-disable-next-line no-param-reassign, new-cap
    Router.defaults.urlAdapter = new Router.urlParamAdapter();
    Router.defaults.baseUrl = '/web/samples/oce-jet-blog-sample';

    self.loadModule = function () {
      self.moduleConfig = ko.pureComputed(function () {
        var name = self.router.moduleConfig.name();
        var viewPath = 'views/' + name + '.html';
        var modelPath = 'viewModels/' + name;
        return moduleUtils.createConfig({ viewPath: viewPath,
          viewModelPath: modelPath,
          params: { parentRouter: self.router } });
      });
    };
  }

  return new ControllerViewModel();
});
