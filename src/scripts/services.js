/**
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

/**
 * This file contains a number of utility methods used to obtain data
 * from the server using the Oracle Content SDK JavaScript Library.
 */

import getClient from './server-config-utils';
import { getImageUrl } from './utils';

/**
 * Utility method to log an error.
 */
function logError(message, error) {
  if (error && error.statusMessage) {
    console.log(`${message} : `, error.statusMessage);
  } else if (error.error && error.error.code && error.error.code === 'ETIMEDOUT') {
    console.log(`${message} : `, error);
  } else if (error.error && error.error.code) {
    console.log(`${message} : `, error.error.code);
  } else if (error) {
    console.error(message, error);
  }
}

/**
 * Flattens an array of arrays into a single array.
 *
 * Note:  ES6's array.flat() is not supported in Node pre version 11 so flatten manually.
 *
 * @param {Array} inArray - the array of arrays to flatten
 * @param {Array} result - the flattened array
 */
function flattenArray(inArray, result = []) {
  for (let i = 0, { length } = inArray; i < length; i += 1) {
    const arrayElement = inArray[i];
    if (Array.isArray(arrayElement)) {
      flattenArray(arrayElement, result);
    } else {
      result.push(arrayElement);
    }
  }
  return result;
}

/**
 * Private method for adding the specified format rendition to the rendition string
 *
 * @param {Object} url - the url which contains the rendition strings
 * @param {Object} rendition - the rendition field of the content sdk json object
 * @param {String} formatstr - the format string type - either webp or jpg
 */
function addRendition(urls, rendition, formatstr) {
  // Get the webp format field
  const format = rendition.formats.filter((item) => item.format === `${formatstr}`)[0];
  if (format !== undefined) {
    const self = format.links.filter((item) => item.rel === 'self')[0];
    const url = getImageUrl(self.href);
    const { width } = format.metadata;

    // Also save the jpg format so that it can be used as a default value for images
    if (formatstr === 'jpg') {
      urls[rendition.name.toLowerCase()] = url;
      urls.jpgSrcset += `${url} ${width}w,`;
    } else {
      urls.srcset += `${url} ${width}w,`;
    }
  }
}

/**
 * Retrieve the sourceset for an asset that is constructed from the rendition
 *
 * @param {asset} client - the asset whose fields contain the various renditions
 * @returns {Object} - An Object containing the the sourceset as well as individual rendition
 * url that can be used as default src
 */
function getSourceSet(asset) {
  const urls = {};
  urls.srcset = '';
  urls.jpgSrcset = '';
  if (asset.fields && asset.fields.renditions) {
    asset.fields.renditions.forEach((rendition) => {
      addRendition(urls, rendition, 'jpg');
      addRendition(urls, rendition, 'png');
      addRendition(urls, rendition, 'webp');
    });
  }
  // add the native rendition to the srcset as well
  urls.srcset += `${asset.fields.native.links[0].href} ${asset.fields.metadata.width}w`;
  urls.native = asset.fields.native.links[0].href;
  urls.width = asset.fields.metadata.width;
  urls.height = asset.fields.metadata.height;
  return urls;
}

/**
 * Return the rendition URLs for the specified item.
 *
 * @param {DeliveryClient} client - the delivery client to get data from Oracle content
 * @param {string} identifier - the item id whose medium rendition URL is to be obtained
 * @returns {Promise({Object})} - A Promise containing the data
 */
function getRenditionURLs(client, identifier) {
  return client.getItem({
    id: identifier,
    expand: 'fields.renditions',
  }).then((asset) => getSourceSet(asset))
    .catch((error) => logError('Fetching Rendition URLs failed', error));
}

/* ----------------------------------------------------
 * APIs to get the data for the Topics List Page
 * ---------------------------------------------------- */

/**
 * Fetch details about the specific topic.
 *
 * @param {DeliveryClient} client - the delivery client to get data from Oracle content
 * @param {string} topicId - the id of the topic whose details are to be obtained
 * @returns {Promise({Object})} - A Promise containing the data
 */
function fetchTopic(client, topicId) {
  return client.getItem({
    id: topicId,
    expand: 'fields.thumbnail',
  }).then((topic) => {
    topic.renditionUrls = getSourceSet(topic.fields.thumbnail);
    return topic;
  }).catch((error) => logError('Fetching topic failed', error));
}

/**
 * Fetches most of the data for the topics list page.
 *
 * The data returned contains
 *    the company title,
 *    the about Url,
 *    the contact Url,
 *    the list of topics
 *
 * The only data not returned is the company logo URL, this needs to be obtained
 * using getRenditionURL specifying the logoId.
 *
 * @param {DeliveryClient} client - the delivery client to get data from Oracle content
 * @returns {Promise({Object})} - A Promise containing the data
 */
function fetchHomePage(client) {
  return client.queryItems({
    q: '(type eq "OCEGettingStartedHomePage" AND name eq "HomePage_JET")',
  }).then((data) => {
    const logoID = data.items[0].fields.company_logo.id;
    const title = data.items[0].fields.company_name;
    const aboutUrl = data.items[0].fields.about_url;
    const contactUrl = data.items[0].fields.contact_url;

    const { topics } = data.items[0].fields;
    const promises = [];

    topics.forEach((origTopic) => {
      // add a promise to the total list of promises to get the full topic details
      promises.push(
        fetchTopic(client, origTopic.id)
          .then((topic) => topic),
      );
    });

    // execute all the promises returning a single dimension array of all
    // of the topics and the other home page data
    return Promise.all(promises)
      .then((allTopics) => (
        {
          logoID,
          companyTitle: title,
          aboutUrl,
          contactUrl,
          topics: flattenArray(allTopics),
        }
      )).catch((error) => logError('Fetching topics failed', error));
  }).catch((error) => logError('Fetching home page data failed', error));
}

/**
 * Fetches all the data required for the topics list page.
 *
 * The data returned contains
 *    the company title,
 *    the company logo Url,
 *    the about Url,
 *    the contact Url,
 *    the list of topics
 *
 * @returns {Promise({object})} - A Promise containing the data
 */
export function getTopicsListPageData() {
  const client = getClient();

  return fetchHomePage(client)
    .then((data) => (
      getRenditionURLs(client, data.logoID)
        .then((renditionUrls) => {
          data.companyThumbnailRenditionUrls = renditionUrls;
          return data;
        })
    ));
}

/* ----------------------------------------------------
 * APIs to get the data for the Articles List Page
 * ---------------------------------------------------- */

/**
 * Gets all the data required to render the articles list page.
 *
 * Get all the articles for the specified topic with its rendition URL populated.
 *
 * The data returned contains
 *   the topic id,
 *   the topic name,
 *   the list of articles
 *
 * @param {string} topicId - the id of the topic
 * @returns {Promise({object})} - A Promise containing the data
 */
export function fetchTopicArticles(topicId) {
  const client = getClient();
  return client.queryItems({
    q: `(type eq "OCEGettingStartedArticle" AND fields.topic eq "${topicId}")`,
    orderBy: 'fields.published_date:desc',
  }).then((data) => {
    const promises = [];
    const articles = data.items;

    articles.forEach((article) => {
      // add a promise to the total list of promises to get the article url
      promises.push(
        getRenditionURLs(client, article.fields.image_16x9.id)
          .then((renditionUrls) => {
            article.renditionUrls = renditionUrls;
            // Note: the spread operator is used here so that we return a top level
            // object, rather than a value which contains the object
            // i.e we return
            //   {
            //     field1: 'value', field2 : "value", etc
            //   },
            // rather than
            //   {
            //     name: {
            //             field1: 'value', field2 : "value", etc
            //           }
            //    }
            return {
              ...article,
            };
          }),
      );
    });

    // execute all the promises and return all the data
    return Promise.all(promises)
      .then((allArticles) => ({
        topicId,
        articles: flattenArray(allArticles),
      }));
  }).catch((error) => logError('Fetching topic articles failed', error));
}

/* ----------------------------------------------------
 * APIs to get the data for the Articles Details Page
 * ---------------------------------------------------- */

/**
 * Get all the data required for rendering the article details page.
 *
 * Gets the details of the specified article with the image URL and author avatar URL
 * obtained.
 *
 * The data returned contains
 *   the article id,
 *   the article name,
 *   the name of the author,
 *   the url of the avatar image for the author,
 *   the article image URL,
 *   the caption for the article image,
 *   the article content,
 *   the date the article was posted
 *
 * @param {string} articleId - The id of the article
 * @returns {Promise({object})} - A Promise containing the data
 */
export function fetchArticleDetails(articleId) {
  const client = getClient();
  return client.getItem({
    id: articleId,
    expand: 'fields.author,fields.image',
  }).then((article) => {
    const title = article.fields.author.name;
    const date = article.fields.published_date;
    const content = article.fields.article_content;
    const imageCaption = article.fields.image_caption;
    const { name } = article;
    const renditionUrls = getSourceSet(article.fields.image);
    const avatarID = article.fields.author.fields.avatar.id;
    // Get the author's avatar image
    return getRenditionURLs(client, avatarID)
      .then((authorRenditionUrls) => (
        // return an object with just the data needed
        {
          id: articleId,
          name,
          title,
          date,
          content,
          imageCaption,
          renditionUrls,
          authorRenditionUrls,
        }
      ));
  }).catch((error) => logError('Fetching article details failed', error));
}
