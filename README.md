# tars markup builder with custom features
[origin repository](https://github.com/2gis/tars)

## features

* upload build version to s3
* custom integration with bower
TODO:
* ES6


## upload build version to s3
uploads all files from build directory to amazon s3 bucket

bucket should be configured as static web site hosting


```shell
gulp upload-s3
```

## bower integration

- init bower

```shell
bower init
```

- install needed packages

- gather bower static files to tars markup, this also creates file with all bower dependecies(output of 'bower list --json' command); Module bower-ordered works with json data with such format, module gathers all dependencies and output files needed in order

```shell
gulp bower-libs
```

- now files are stored in markup static, js files are concatinated before all other tars files, so you can use them in all your js files

- you can list files that will not be compiled by tars, ignored js files acts like files in separate-js folder


## HINTS
 - flatten used on fonts
 - all bower packages git ignored
