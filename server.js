/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
/* eslint-disable camelcase */
/**
 * Simple Express Server used to proxy requests when authentication is needed.
 */
const cors = require('cors');
const express = require('express');
const http = require('http');
const https = require('https');
const data = require('./src/config/content.json');
const fetch = require('node-fetch');

// ---- Authorization Support ----

/*
 * Time added to an access-token's expiry to ensure the token is refreshed before it
 * actually expires.
 */
const FIVE_SECONDS_MS = 5000;

/**
 * Module global variable containing the authentication header value
 * for any server requests.
 * for any server requests and the authExpiry if using OAuth
 */
let globalAuthValue = '';
let globalAuthExpiry = null;

/**
 * Indicates if authorization is needed on the requests to Oracle Content.
 */
function isAuthNeeded() {
  if (data.auth || data.clientId) {
    return true;
  }
  return false;
}

/**
 * Gets the Bearer authorization needed when using preview content or
 * content published to a secure channel.
 *
 * This will create a NEW access_token with a new expiry
 */
async function getBearerAuth() {
  // base64 encode clientId:clientSecret
  const authString = `${data.clientId}:${data.clientSecret}`;
  const authValue = (Buffer.from(authString)).toString('base64');

  // URL encode the CLIENT_SCOPE_URL
  const encodedScopeUrl = encodeURIComponent(data.clientScopeURL);

  // build the full REST end point URL for getting the access token
  const restURL = new URL('/oauth2/v1/token', data.idcsURL);

  // make a request to the server to get the access token
  const response = await fetch(restURL.toString(), {
    body: `grant_type=client_credentials&scope=${encodedScopeUrl}`,
    headers: {
      Authorization: `Basic ${authValue}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });
  const responseJSON = await response.json();

  // get the access token and expiry from the response
  // and return an object containing the values
  const { access_token } = responseJSON;
  const expiry = responseJSON.expires_in;

  return {
    authHeaderValue: `Bearer ${access_token}`,
    expiry,
  };
}

/**
 * Returns the auth value for any requests
 */
async function getAuthValue() {
  if (data.auth) {
    // if Auth has been specified set it as the global value
    globalAuthValue = data.auth;
  } else if (data.clientId) {
    // Client ID specified which means the OAuth token needs to be generated if
    // token has not already been created, or it has expired
    const currentDate = new Date();
    // if the auth token has expired, refresh it, otherwise existing value will be returned
    // add a 5 second buffer to the expiry time
    if (!globalAuthValue || !globalAuthExpiry
      || (globalAuthExpiry.getTime() - FIVE_SECONDS_MS) > currentDate.getTime()) {
      globalAuthValue = '';
      const authDetails = await getBearerAuth();
      globalAuthValue = authDetails.authHeaderValue;
      // Auth Expiry
      // calculate expiry, get the current date (in ms), add the expiry ms, then
      // create a new Date object, using the adjusted milliseconds time
      let currDateMS = Date.now();
      currDateMS += authDetails.expiry;
      globalAuthExpiry = new Date(currDateMS);
    }
  } else {
    // no auth needed
    globalAuthValue = null;
    globalAuthExpiry = null;
  }
  return globalAuthValue;
}

// ---- Express Server ----

/*
 * Create an instance of an Express server
 */
const server = express();
server.use(cors());

/*
 * Execute the proxied request.
 */
function executeRequest(req, res, oceUrl, options) {
  // define a function that writes the proxied content to the response
  const writeProxyContent = (proxyResponse) => {
    res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    proxyResponse.pipe(res, {
      end: true,
    });
  };

  // based on whether the Content server is HTTP or HTTPS make the request to it
  const proxy = (oceUrl.startsWith('https'))
    ? https.request(oceUrl, options, (proxyResponse) => writeProxyContent(proxyResponse))
    : http.request(oceUrl, options, (proxyResponse) => writeProxyContent(proxyResponse));

  // write the proxied response to this request's response
  req.pipe(proxy, {
    end: true,
  });
}

/*
 * Handle proxied Oracle Content calls to '/content/'.
 *
 * When authorization is needed for the calls to Oracle Content
 * - all requests for data from Oracle Content will be proxied through here
 * - this server will pass on the call to Oracle Content adding on the authorization headers and
 *   returning the Oracle Content response.
 * This ensures the browser will never have the authorization header visible in its requests.
 *
 * See the following files where proxying is setup
 * - 'src/scripts/server-config-utils.getClient' for the code proxying requests for content
 * - 'src/scripts/utils.getImageUrl' for the code proxying requests for image binaries
 */
server.use('/content/', (req, res) => {
  // only proxy GET requests, ignore all other requests
  if (req.method !== 'GET') {
    return;
  }

  // build the URL to the real server
  let content = data.serverUrl.charAt(data.serverUrl.length - 1) === '/'
    ? 'content' : '/content';
  if (req.url.charAt(0) !== '/') {
    content = `${content}/`;
  }
  const oceUrl = `${data.serverUrl}${content}${req.url}`;

  // if authorization is needed, get the auth value and add the Authorization header to the
  // request options, before executing the request
  const options = {};
  if (isAuthNeeded()) {
    getAuthValue().then((authValue) => {
      options.headers = { Authorization: authValue };
      executeRequest(req, res, oceUrl, options);
    });
  } else {
    executeRequest(req, res, oceUrl, options);
  }

});

/*
 * Set the port the Express server is listening on
 */
const port = data.expressServerPort || 8080;
server.listen(port, () => {
  console.log(`Server running on : http://localhost:${port}`);
});
