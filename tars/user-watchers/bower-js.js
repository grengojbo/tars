var gulp = require('gulp');
var gutil = require('gulp-util');
var chokidar = require('chokidar');
var tarsConfig = require('../../tars-config');
var watcherLog = require('../helpers/watcher-log');

/**
 * This is an example of watcher
 * @param  {Object} watchOptions
 */
module.exports = function (watchOptions) {
    return chokidar.watch('./markup/' + tarsConfig.fs.staticFolderName + '/js/'+tarsConfig.bower_js_folder, {
        ignored: '/* String of path pattern or array of strings to ignore. If nothing to igonre — just set it empty string */',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        watcherLog(event, path);
        // You could start many tasks
        gulp.start('js:bower-concat');
    });
};
