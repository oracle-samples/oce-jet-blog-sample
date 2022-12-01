/**
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import data from '../config/content.json';

/**
 * Function to take a date and return it as a formatted string.
 *
 * @param {Date} date the date to format into a nice string
 */
export function dateToMDY(date) {
  const dateObj = new Date(date);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = dateObj.toLocaleDateString('en-US', options);
  return formattedDate;
}

/**
 * When authorization is needed for images, change the image URL so that it
 * goes to this application's Express server in order for the authorization
 * headers are added to the request.
 *
 * See the following files where proxying is setup/done
 * - 'src/scripts/server-config-utils.getClient' for the code proxying requests for content
 * - 'src/server/server' for the Express server proxying.
 *
 * @param String originalUrl the image's original url
 */
export function getImageUrl(originalUrl) {
  if (data.AUTH || data.AUTH_PARAMS) {
    // strip off the server URL from the front of the URL to make a relative URL
    // causing the request to go to this application's Express server
    const url = new URL(originalUrl);
    return url.pathname + url.search;
  }
  return originalUrl;
}
