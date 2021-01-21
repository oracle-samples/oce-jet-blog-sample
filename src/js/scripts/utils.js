/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

define(() => ({

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

}));

