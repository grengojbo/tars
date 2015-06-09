var gulp = require('gulp');
var cache = require('gulp-cached');
var notify = require('gulp-notify');
var tarsConfig = require('../../tars-config');
var notifier = require('../helpers/notifier');
var _ = require('underscore');
var TarsBowerDeps = require('../helpers/tars-bower-deps.js');

/**
 * Copy separate Js-files to dev directory
 * @param  {object} buildOptions
 */

var jsPaths = [];

module.exports = function (buildOptions) {

    return gulp.task('js:bower-separate', function (cb) {

        tars_bower_deps = TarsBowerDeps.getTarsBowerDeps();

        bower_deps_paths = [];

        _.each(tars_bower_deps.depsJsFilesExcluded(), function (element, index) {
            bower_deps_paths.push('./markup/' + tarsConfig.fs.staticFolderName + '/js/' + tarsConfig.bower_js_folder + '/' + element);

        });
        console.log(bower_deps_paths);

        jsPaths = _.union(bower_deps_paths, jsPaths);

        return gulp.src(jsPaths)
            .pipe(cache('separate-js'))
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while moving separate bower js-files.\'s data.\nLook in the console for details.\n' + error;
            }))
            .pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/js/separate-js'))
            .pipe(
                notifier('Separate bower js files\'s been copied')
            );

        cb(null);
    });
};
