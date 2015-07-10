var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var tarsConfig = require('../../tars-config');
var notifier = require('../helpers/notifier');
var browserSync = require('browser-sync');
var _ = require('underscore');

var TarsBowerDeps = require('../helpers/tars-bower-deps.js');

/**
 * Concat JS for modules, libs and plugins in common file. Also lint modules' js
 * @param  {objects} buildOptions
 */
module.exports = function (buildOptions) {

    return gulp.task('js:bower-concat', ['js:bower-separate'], function () {
        var jsPaths = [];
        tars_bower_deps = TarsBowerDeps.getTarsBowerDeps();

        bower_deps_paths = [];

        _.each(tars_bower_deps.depsJsFiles(), function (element, index) {
            bower_deps_paths.push('./markup/' + tarsConfig.fs.staticFolderName + '/js/' + tarsConfig.bower_js_folder + '/' + element);

        });

        jsPaths = _.union(bower_deps_paths, jsPaths);

        return gulp.src(jsPaths)
            .pipe(concat('vendor' + buildOptions.hash + '.js'))
            // .pipe(gulpif(tarsConfig.es6_transpile, babel()))
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while concating bower js-files.\nLook in the console for details.\n' + error;
            }))
            .pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/js'))
            .pipe(browserSync.reload({ stream: true }))
            .pipe(
                notifier('Bower JS\'ve been concatinated')
            );
    });
};
