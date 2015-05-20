var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var tarsConfig = require('../../tars-config');
var notifier = require('../helpers/notifier');
var browserSync = require('browser-sync');
var _ = require('underscore');



var TarsBowerDeps = require('../helpers/tars-bower-deps.js');


var cssPaths = [];

/**
 * Concat JS for modules, libs and plugins in common file. Also lint modules' js
 * @param  {objects} buildOptions
 */
module.exports = function(buildOptions) {
    tars_bower_deps = TarsBowerDeps.getTarsBowerDeps();

    bower_deps_paths = [];
    _.each( tars_bower_deps.depsCssFiles(), function( element, index ){
        bower_deps_paths.push('./markup/' + tarsConfig.fs.staticFolderName + '/scss/'+tarsConfig.bower_css_folder+'/'+element);

    });

    cssPaths= _.union(bower_deps_paths,cssPaths);

    return gulp.task('css:bower-concat', [], function() {
        return gulp.src(cssPaths)
            .pipe(concat('vendor' + buildOptions.hash + '.css'))
            // .pipe(gulpif(tarsConfig.es6_transpile, babel()))
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while concating bower js-files.\nLook in the console for details.\n' + error;
            }))
            .pipe(gulp.dest('./dev/' + tarsConfig.fs.staticFolderName + '/css'))
            .pipe(
                notifier('Bower Css\'ve been concatinated')
            );
    });
};
