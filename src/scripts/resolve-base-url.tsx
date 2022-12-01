/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable import/prefer-default-export */

import { route } from 'preact-router';

/**
 * Wrapper around preact-router 'route' method to add BASE_URL option.
 * needed for subdirectories on devx machine.
 */
interface RouteSignatures {
    (url: string, replace?: boolean): boolean;
    (options: { url: string; replace?: boolean }): boolean;
}

export const appRoute: RouteSignatures = (
  input: string | { url: string; replace?: boolean },
  replace?: boolean,
) => {
  let newUrl = typeof input === 'string' ? input : input.url;
  if (!newUrl.startsWith(process.env.BASE_URL)) {
    const forwardSlash = !newUrl.startsWith('/') ? '/' : '';
    newUrl = `${process.env.BASE_URL}${forwardSlash}${newUrl}`;
  }

  if (typeof input === 'string') {
    return route(newUrl, replace);
  }

  return route({
    url: newUrl,
    replace: input.replace,
  });
};
