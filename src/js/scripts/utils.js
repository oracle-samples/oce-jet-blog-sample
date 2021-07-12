/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

define(['jquery'], ($) => ({

  /**
   * Function to take a date and return it as a formatted string.
   *
   * @param {Date} date the date to format into a nice string
   */
  dateToMDY(date) {
    const dateObj = new Date(date);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    return formattedDate;
  },

  /**
   * When authorization is needed for images, change the image URL so that it
   * goes to this application's Express server in order for the authorization
   * headers are added to the request.
   *
   * See the following files where proxying is setup/done
   * - 'server.js' for the Express server proxying.
   *
   * @param String originalUrl the image's original url
   */
  getImageUrl(originalUrl) {
    return new Promise((resolve, reject) => {
      $.getJSON('config/content.json', (jsonContents) => {
        if (jsonContents.auth || jsonContents.clientId) {
          // strip off the server URL from the front of the URL to make a relative URL
          // causing the request to go to this application's Express server
          const returnURL = originalUrl.replace(
            jsonContents.serverUrl,
            `${window.location.protocol}//${window.location.hostname}:${jsonContents.expressServerPort}`,
          );
          resolve(returnURL);
        }

        resolve(originalUrl);
      }).fail(() => {
        reject(Error('Parsing Server Config JSON file Failed'));
      });
    });
  },

}));

