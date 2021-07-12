/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Returns a Delivery Client or a Preview Client to be used to access
 * content from Oracle Content Management server.
 */
define(['jquery', 'contentsdk'], function ($, contentSDK) {
  const getClient = new Promise(((resolve, reject) => {
    $.getJSON('config/content.json', (jsonContents) => {
      // When authorization is needed for getting content from Oracle Content we need to proxy
      // all requests through an Express server in order to add all the authorization
      // headers to the requests. This is so that the browser will never show the
      // authorization values.
      //
      // See the following files where proxying is setup/done
      // - 'src/js/scripts/utils.getImageUrl' for the code proxying requests for image binaries
      // - 'server.js' for the Express server proxying.
      const port = jsonContents.expressServerPort ? jsonContents.expressServerPort : 8080;
      const serverURL = (jsonContents.auth || jsonContents.clientId)
        ? `${window.location.protocol}//${window.location.hostname}:${port}`
        : jsonContents.serverUrl;

      // create connection to the content server
      const serverConfig = {
        contentServer: serverURL,
        contentVersion: jsonContents.apiVersion,
        channelToken: jsonContents.channelToken,
      };

      // Add the following if you want logging from the Oracle Content SDK shown in the console
      // serverconfig.logger = console;

      // create and return the relevant client
      const client = (jsonContents.preview)
        ? contentSDK.createPreviewClient(serverConfig)
        : contentSDK.createDeliveryClient(serverConfig);

      resolve(client);
    })
      .fail(() => {
        reject(Error('Creating client for CEC Failed'));
      });
  }),
  );

  const promises = { getClient };
  return promises;
});
