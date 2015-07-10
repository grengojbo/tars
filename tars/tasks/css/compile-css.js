var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var replace = require('gulp-replace-task');
var addsrc = require('gulp-add-src');
var notify = require('gulp-notify');
var tarsConfig = require('../../../tars-config');
var notifier = require('../../helpers/notifier');
var browserSync = require('browser-sync');
var path = require('path');

var useAutoprefixer = false;
var helperStream;
var mainStream;
var ie9Stream;

if (tarsConfig.autoprefixerConfig) {
    useAutoprefixer = true;
}

var scssFilesToConcatinate = [
        path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'normalize.scss'),
        path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'libraries', '**', '*.scss'),
        path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'libraries', '**', '*.css'),
        path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'mixins.scss'),
        path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'sprites-scss', 'sprite_96.scss')
    ];

if (tarsConfig.useSVG) {
    scssFilesToConcatinate.push(
        path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'sprites-scss', 'svg-sprite.scss')
    );
}

scssFilesToConcatinate.push(
    path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'fonts.scss'),
    path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'vars.scss'),
    path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'GUI.scss'),
    path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'common.scss'),
    path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'plugins', '**', '*.scss'),
    path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'plugins', '**', '*.css'),
    path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.componentFolderName, '*', '*.scss')
);

/**
 * Scss compilation
 * @param  {object} buildOptions
 */
module.exports = function (buildOptions) {

    var patterns = [];

    patterns.push(
        {
            match: '%=staticPrefixForCss=%',
            replacement: tarsConfig.staticPrefixForCss()
        }
    );

    return gulp.task('css:compile-css', function () {

        helperStream = gulp.src(scssFilesToConcatinate);
        mainStream = helperStream.pipe(addsrc.append(path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'etc', '**', '*.scss')));
        ie9Stream = helperStream.pipe(
                                addsrc.append([
                                        path.join(tarsConfig.fs.srcFolderName, 'modules', '*', 'ie', 'ie9.scss'),
                                        path.join(tarsConfig.fs.srcFolderName, tarsConfig.fs.staticFolderName, 'scss', 'etc', '**', '*.scss')
                                    ])
                            );

        mainStream
            .pipe(concat('main' + buildOptions.hash + '.css'))
            .pipe(replace({
                patterns: patterns,
                usePrefix: false
            }))
            .pipe(sass({
                    errLogToConsole: false,
                    onError: function (error) {
                        notify().write('\nAn error occurred while compiling css.\nLook in the console for details.\n');
                        return gutil.log(gutil.colors.red(error.message + ' on line ' + error.line + ' in ' + error.file));
                    }
                }))
            .pipe(
                gulpif(useAutoprefixer,
                    autoprefixer(
                        {
                            browsers: tarsConfig.autoprefixerConfig,
                            cascade: true
                        }
                    )
                )
            )
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while autoprefixing css.\nLook in the console for details.\n' + error;
            }))
            .pipe(gulp.dest(path.join(tarsConfig.fs.devFolderName, tarsConfig.fs.staticFolderName, 'css')))
            .pipe(browserSync.reload({ stream: true }))
            .pipe(
                notifier('Scss-files\'ve been compiled')
            );

        return ie9Stream
            .pipe(concat('main_ie9' + buildOptions.hash + '.css'))
            .pipe(replace({
                patterns: patterns,
                usePrefix: false
            }))
            .pipe(sass({
                errLogToConsole: false,
                onError: function (error) {
                    notify().write('\nAn error occurred while compiling css for ie9.\nLook in the console for details.\n');
                    return gutil.log(gutil.colors.red(error.message + ' on line ' + error.line + ' in ' + error.file));
                }
            }))
            .pipe(autoprefixer('ie 9', { cascade: true }))
            .on('error', notify.onError(function (error) {
                return '\nAn error occurred while autoprefixing css.\nLook in the console for details.\n' + error;
            }))
            .pipe(gulp.dest(path.join(tarsConfig.fs.devFolderName, tarsConfig.fs.staticFolderName, 'css')))
            .pipe(browserSync.reload({ stream: true }))
            .pipe(
                notifier('Css-files for ie9 have been compiled')
            );
    });
};