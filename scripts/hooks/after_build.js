/**
 * Copyright (c) 2015, 2020 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

'use strict';

module.exports = function () {
  return new Promise((resolve, reject) => {
    console.log('Running after_build hook.');

    // eslint-disable-next-line global-require
    const exec = require('child_process').exec;
    console.log('Running Babel');
    exec('npm run babel', (error) => {
      if (error) {
        reject(error);
      }
      console.log('Babel transpilation finished');
      resolve();
    });
  });
};
