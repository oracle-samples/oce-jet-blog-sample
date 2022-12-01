/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import './app';

declare module 'preact/src/jsx' {
    namespace JSXInternal {

        // We're extending the IntrinsicElements interface which holds a kv-list of
        // available html-tags.
        interface IntrinsicElements {
            'oj-sp-image-card': unknown;
            'oj-sp-item-overview': unknown;
            'oj-sp-item-overview-page': unknown;
            'oj-sp-welcome-page': unknown;
        }
    }
}
