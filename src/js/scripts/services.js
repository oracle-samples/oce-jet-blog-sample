/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
  * This file contains a number of utility methods used to obtain data
  * from the server using the ContentSDK JavaScript Library.
  */
define(() => ({
  /*
   * Utility method to log an error.
   */
  logError(message, error) {
    if (error && typeof error.statusMessage) {
      console.log(`${message} : `, error.statusMessage);
    } else if (error) {
      console.error(message, error);
    }
  },

  /**
   * Fetch the top level values to be displayed on the home page.
   *
   * @param {DeliveryClient} client - The delivery client which will execute the search
   * @returns {Promise({object})} - A Promise containing the data to display on the top level page
   */
  fetchHomePage(client) {
    return client.queryItems({
      q: '(type eq "OCEGettingStartedHomePage" AND name eq "HomePage")',
      fields: 'all',
    }).then((topLevelItem) => {
      const returnVal = {
        logoID: topLevelItem.items[0].fields.company_logo.id,
        title: topLevelItem.items[0].fields.company_name,
        topics: topLevelItem.items[0].fields.topics,
        aboutUrl: topLevelItem.items[0].fields.about_url,
        contactUrl: topLevelItem.items[0].fields.contact_url,
      };
      return returnVal;
    }).catch((error) => this.logError('Fetching home page data failed', error));
  },

  /**
   * Fetch details about the specific topic
   *
   * @param {DeliveryClient} client - The delivery client which will execute the search
   * @param {String} topicId - the id of the topic
   * @returns {*} - the topic
   */
  fetchTopic(client, topicId) {
    return client.getItem({
      id: topicId,
      fields: 'all',
      expand: 'all',
    }).then((topic) => topic)
      .catch((error) => this.logError('Fetching topic failed', error));
  },

  /**
   * Get all the articles for the specified topic.
   *
   * @param {DeliveryClient} client - The delivery client which will execute the search
   * @param {String} topicId - the id of the topic
   * @returns {*} - the list of articles for the topic
   */
  fetchArticles(client, topicId) {
    return client.queryItems({
      q: `(type eq "OCEGettingStartedArticle" AND fields.topic eq "${topicId}")`,
      fields: 'all',
      orderBy: 'fields.published_date:desc',
    }).then((articles) => articles.items)
      .catch((error) => this.logError('Fetching articles failed', error));
  },

  /**
   * Get details of the specified article.
   *
   * @param {DeliveryClient} client - The delivery client which will execute the search
   * @param {String} articleId - The id of the article
   * @returns {*} - the article
   */
  fetchArticle(client, articleId) {
    return client.getItem({
      id: articleId,
      expand: 'all',
    }).then((article) => article)
      .catch((error) => this.logError('Fetching article failed', error));
  },

  /**
   * Return the thumbnail URL for the specified item.
   *
   * @param {DeliveryClient} client - The delivery client which will execute the search
   * @param {String} identifier - the Id of the item whose thumbnail URL is required
   * @returns {String} - the thumbnail URL
   */
  getMediumRenditionURL(client, identifier) {
    return client.getItem({
      id: identifier,
      fields: 'all',
      expand: 'all',
    }).then((asset) => {
      const object = asset.fields.renditions.filter((item) => item.name === 'Medium')[0];
      const format = object.formats.filter((item) => item.format === 'jpg')[0];
      const self = format.links.filter((item) => item.rel === 'self')[0];
      const url = self.href;
      return url;
    }).catch((error) => this.logError('Fetching medium rendition URL failed', error));
  },

  /**
   * Return the rendition URL for the specified item.
   *
   * @param {DeliveryClient} client - The delivery client which will execute the search
   * @param {String} identifier - the Id of the item whose rendition URL is required
   * @returns {String} - the rendition URL
   */
  getRenditionURL(client, identifier) {
    const url = client.getRenditionURL({
      id: identifier,
    });
    return Promise.resolve(url);
  },

}));
