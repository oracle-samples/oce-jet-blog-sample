# About Oracle JET Blog Sample
This repository holds the sample source code for an [Oracle's JavaScript Extension Framework (JET)](https://www.oracle.com/webfolder/technetwork/jet/index.html) implementation of a blog site powered by Oracle Content Management.

Please see the complete [tutorial](https://www.oracle.com/pls/topic/lookup?ctx=cloud&id=oce-jet-blog-sample) and the live [demo](https://headless.mycontentdemo.com/samples/oce-jet-blog-sample).

## Running the project

To build this project:

```shell
npm install  
npm run build
```

To run this project when no authorization is required:

```shell
npm run start
```

To run this project when authorization is required (previewing content,
viewing content from a secure channel) use this command to start the server component:

```shell
npm run start-server
```

and then start the client:

```shell
npm run start
```

and then open [http://localhost:8080](http://localhost:8080)

## Images

Sample images may be downloaded from [https://www.oracle.com/middleware/technologies/content-experience-downloads.html](https://www.oracle.com/middleware/technologies/content-experience-downloads.html) under a separate license.  These images are provided for reference purposes only and may not be hosted or redistributed by you.

## Contributing

This project welcomes contributions from the community. Before submitting a pull
request, please [review our contribution guide](./CONTRIBUTING.md).

## Security

Please consult the [security guide](./SECURITY.md) for our responsible security
vulnerability disclosure process.

## License

Copyright (c) 2020, 2021 Oracle and/or its affiliates and released under the
[Universal Permissive License (UPL)](https://oss.oracle.com/licenses/upl/), Version 1.0
