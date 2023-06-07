# About Oracle JET Blog Sample

This repository holds the sample source code for an Oracle JET implementation of a blog site powered by Oracle Content Management.

Please see the complete [tutorial](https://www.oracle.com/pls/topic/lookup?ctx=cloud&id=oce-jet-blog-sample) and the live [demo](https://headless.mycontentdemo.com/samples/oce-jet-blog-sample).

## Installation

Run the following to install the dependencies needed by this sample:

```shell
npm install
```

Then, configure the exchange-url as a reference, and install the custom Oracle JET components (for US instances):

``` shell
ojet configure --exchange-url=https://devinstance4wd8us2-wd4devcs8us2.uscom-central-1.oraclecloud.com/profile/devinstance4wd8us2-wd4devcs8us2/s/devinstance4wd8us2-wd4devcs8us2_compcatalog_3461/compcatalog/0.2.0
ojet add component oj-sp-welcome-page oj-sp-image-card oj-sp-item-overview-page oj-sp-item-overview --username=comp.catalog --password=bXwphh6RMFjn#g
```

See the documentation [here](https://docs.oracle.com/en-us/iaas/visual-builder/doc/administrative-tasks.html#GUID-2B02DA1E-82EA-4FD1-88EC-F1C113A8969E) for more information about connecting to the component exchange url.

The above commands use the Oracle JET CLI, which is a dependency for this project. More information about the Oracle JET CLI can be found [here](https://docs.oracle.com/en/learn/jet-install-cli/index.html).

## Running the project

> **NOTE:** If you need to use a proxy to reach the internet then define an `oce_https_proxy` environment variable:  

```shell
export oce_https_proxy=<scheme>://<proxyhost>:<port>
```

### Development

During development the dev script should be used:

```shell
npm run dev
```

This script builds and starts the application in a local server. Webpack will watch for code changes and recreate the application as required.

### Production

The build script should be used to build the application. Run it using:

```shell
npm run build
```

When the script completes, the application can be started using:

```shell
npm run start
```

## Images

Sample images may be downloaded from [https://www.oracle.com/middleware/technologies/content-experience-downloads.html](https://www.oracle.com/middleware/technologies/content-experience-downloads.html) under a separate license.  These images are provided for reference purposes only and may not be hosted or redistributed by you.

## Contributing

This project welcomes contributions from the community. Before submitting a pull
request, please [review our contribution guide](./CONTRIBUTING.md).

## Security

Please consult the [security guide](./SECURITY.md) for our responsible security
vulnerability disclosure process.

## License

Copyright (c) 2022, 2023, Oracle and/or its affiliates.

Released under the Universal Permissive License v1.0 as shown at
<https://oss.oracle.com/licenses/upl/>.
