# tars markup builder with custom features
[origin repository](https://github.com/2gis/tars)

## Features

* upload build version to s3
* custom integration with bower
* ES6

## TODO:
* ES6
    * shims
* Bower
    * uninstall package
    * concat css to `vendor.css`


## Amazon S3
uploads all files from build directory to amazon s3 bucket

- bucket should be configured as static web site hosting

- provide AMAZON credentials in `local_tars_config.js`

### comands

- upload files


```shell
gulp upload-s3
```

## Bower integration

- init bower

```shell
bower init
```

- install needed packages

- gather bower static files to tars markup, this also creates file with all bower dependecies(output of `bower list --json` command); Module bower-ordered works with json data with such format, module gathers all dependencies and output files needed in order

```shell
gulp bower-libs
```

- now files are stored in markup static, js files are concatinated before all other tars files, so you can use them in all your js files

- you can list files that will not be compiled by tars, ignored js files acts like files in separate-js folder

## ES6
Use this option to turn on es6 transpiler
 -  `es6_transpile: true`
    - `markup/modules/**/*.js`
    - `markup/static/js/framework/*.js`
    - `markup/static/js/libraries/*.js`
    - `markup/static/js/plugins/*.js`

-  `es6_separate_transpile: true`
    - `markup/static/js/separate-js/*.js`




## HINTS
 - flatten used on fonts
 - all bower packages git ignored
 - babel transpile for es6
