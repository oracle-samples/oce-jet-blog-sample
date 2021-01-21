/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/*
 * Javascript which parses the "oce.json" file so that the
 * server is not hard-coded in a javascript file.
 */
define(['jquery'], function ($) {
  const parseServerConfig = new Promise(
    ((resolve, reject) => {
      $.getJSON('config/oce.json', (jsonContents) => {
        let serverURL;
        let serverVersion;
        let serverToken;

        $.each(jsonContents, (key, value) => {
          if (key === 'serverUrl') {
            serverURL = value;
          } else if (key === 'apiVersion') {
            serverVersion = value;
          } else if (key === 'channelToken') {
            serverToken = value;
          }
        });

        // create connection to the content server
        const serverConfig = {
          contentServer: serverURL,
          contentVersion: serverVersion,
          channelToken: serverToken,
        };

        resolve(serverConfig);
      })
        .fail(() => {
          reject(Error('Parsing Server Config JSON file Failed'));
        });
    }),
  );

  const promises = { parseServerConfig };
  return promises;
});
