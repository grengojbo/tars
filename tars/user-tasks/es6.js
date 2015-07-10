var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var notify = require('gulp-notify');
var tarsConfig = require('../../tars-config');
var notifier = require('../helpers/notifier');
var babel = require("gulp-babel");
var browserSync = require('browser-sync');



/**
 * Compress js-files
 * @param  {object} buildOptions
 */

module.exports = function (buildOptions) {

    return gulp.task('js:es6-transpile', [], function () {
        return gulp.src('./dev/' + tarsConfig.fs.staticFolderName + '/js/main.js')
            .pipe(babel())
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while transpiling ES6 js.\nLook in the console for details.\n' + error;
            }))
            .pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/js'))
            .pipe(browserSync.reload({ stream: true }))
            .pipe(
                notifier('ES6 JS\'ve been transpiled')
            );
    });
};
