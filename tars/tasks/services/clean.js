var gulp = require('gulp');
var del = require('del');
var path = require('path');
var tarsConfig = require('../../../tars-config');

var pathsToDel = [
        path.join(tarsConfig.fs.distFolderName, tarsConfig.fs.tmpFolderName),
        path.join(tarsConfig.fs.distFolderName, tarsConfig.fs.staticFolderName),
        path.join(tarsConfig.fs.distFolderName, 'html'),
        tarsConfig.buildPath,
        './dev/',
        './.tmpTemplater/',
        './.tmpPreproc/'
    ];

/**
 * Clean dev directory and cache
 * @param  {object} buildOptions
 */
module.exports = function (buildOptions) {

    if (!tarsConfig.useBuildVersioning) {
        pathsToDel.push(buildOptions.buildPath);
    }

    return gulp.task('service:clean', function (cb) {
        del(pathsToDel, cb);
    });
};