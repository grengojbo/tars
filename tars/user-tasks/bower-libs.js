// This is example of task function
var fs = require('fs');
var gulp = require('gulp');
var notify = require('gulp-notify');
var notifier = require('../helpers/notifier');
var tarsConfig = require('../../tars-config');
var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var minifycss = require('gulp-minify-css');
var flatten = require('gulp-flatten');
var TarsBowerDeps = require('../helpers/tars-bower-deps.js');

TarsBowerDeps.setTarsBowerDeps();




// Include browserSync, if you need to reload browser
// var browserSync = require('browser-sync');

// require('./ path to task file, which have to be done before current task');
// require('./required-task-name');

/**
 * Task description
 * @param  {object} buildOptions
 */

var dest_path = './markup/static';
module.exports = function(buildOptions) {
    var jsFilter = gulpFilter('*.js');
    var jsFrameworkFilter = gulpFilter(['jquery.js']);
    var cssFilter = gulpFilter('*.css');
    var fontFilter = gulpFilter(['*.eot', '*.woff2', '*.woff', '*.svg', '*.ttf']);
    TarsBowerDeps.setTarsBowerDeps();
    // console.log(eval('var readyModulesData = {' + fs.readFileSync('./test.json', "utf8") + '}'));
    // bower_deps = JSON.parse(fs.readFileSync('./bower_deps_order.json', "utf8"));



    return gulp.task('bower-libs', [], function(cb) {
        return gulp.src(mainBowerFiles())
            .on('error', notify.onError(function(error) {
                return '\nAn error occurred while something.\nLook in the console for details.\n' + error;
            }))
            // grab vendor js files from bower_components, minify and push in /public
            // .pipe(jsFrameworkFilter)
            // // .pipe(gulp.dest(dest_path + '/js/vendor'))
            // // .pipe(uglify())
            // // .pipe(rename({
            // //     suffix: ".min"
            // // }))
            // .pipe(gulp.dest(dest_path + '/js/framework'))
            // .pipe(jsFrameworkFilter.restore())

        .pipe(jsFilter)
            // .pipe(gulp.dest(dest_path + '/js/vendor'))
            // .pipe(uglify())
            // .pipe(rename({
            //     suffix: ".min"
            // }))
            .pipe(gulp.dest(dest_path + '/js/vendor'))
            .pipe(jsFilter.restore())

        // .pipe(jsFilter)
        // // .pipe(gulp.dest(dest_path + '/js/vendor'))
        // // .pipe(uglify())
        // // .pipe(rename({
        // //     suffix: ".min"
        // // }))
        // .pipe(gulp.dest(dest_path + '/js/libraries'))
        // .pipe(jsFilter.restore())

        // grab vendor css files from bower_components, minify and push in /public
        .pipe(cssFilter)
            // .pipe(gulp.dest(dest_path + '/css/vendor'))
            // .pipe(minifycss())
            .pipe(rename({
                // suffix: ".min",
                extname: ".css"
            }))
            .pipe(gulp.dest(dest_path + '/scss/vendor'))
            .pipe(cssFilter.restore())

        // grab vendor font files from bower_components and push in /public
        .pipe(fontFilter)
            .pipe(flatten())
            .pipe(gulp.dest(dest_path + '/fonts/vendor'))
            .pipe(
                // You can change text of success message
                notifier('Bower libs task is finished')
                // if you need notify after each file will be processed, you have to use
                // notifier('Example task is finished', false)
            );

        // You can return callback, if you can't return pipe
        // cb(null);
    });
};
