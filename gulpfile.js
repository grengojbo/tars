var gulp = require('gulp'), // Сообственно Gulp JS
    jade = require('gulp-jade'), // Плагин для Jade
    sass = require('gulp-sass'), // Плагин для scss
    uglify = require('gulp-uglifyjs'), // Минификация JS
    csso = require('gulp-csso'), // Минификация css
    concat = require('gulp-concat'), // Склейка файлов
    spritesmith = require('gulp.spritesmith'), // Склейка спрайтов
    clean = require('gulp-clean'), // Удаление файлов
    path = require('path'), // Управление путями
    rename = require('gulp-rename'); // Переименовывание файлов

// Пути, для копирования файлов из dev в build
// @TODO: Избавиться от этого треша!!!
var filesToMove = [
        './public/*.*',
        './public/**/*.*',
        './public/**/**/*.*',
        './public/**/**/**/*.*',
        './public/**/**/**/**/*.*'
    ]; 

// Собираем спрайт
gulp.task('sprite', function () {
  var spriteData = gulp.src('./images/for-sprite/*.png')
    .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss'
  }));
  spriteData.img.pipe(gulp.dest('./public/img/'));
  spriteData.css.pipe(gulp.dest('./markup/scss/'));
});

// Собираем Scss для всех браузеров
gulp.task('scss', function() {
    gulp.src('./markup/*.scss')
        .pipe(sass())
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(gulp.dest('./public/css/'));
});

// Собираем Jade
gulp.task('jade', function() {
    return gulp.src('./markup/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(gulp.dest('./public/'));
});

// Собираем JS доп. библиотек и плагинов, которые должны быть в отдельных файлах
gulp.task('vendors-js', function() {
    return gulp.src('./js/vendors/*.js')
        .pipe(gulp.dest('./public/js/vendors'));
});

// Собираем JS модулей и плагинов
gulp.task('plugins-and-modules-js', function() {
    return gulp.src(['./js/plugins/*.js', './markup/modules/**/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./public/js'));
});

// Переносим картинки из assets модулей
gulp.task('move-assets', function(){
    return gulp.src('./markup/modules/**/assets/*.*')
        .pipe(rename(function(path) {
            path.dirname = path.dirname.replace(new RegExp("[a-zA-Z0-9]+\/assets",'g'), '');
        }))
        .pipe(gulp.dest('./public/img/assets'));
}); 

// Переносим картинки из папки content
gulp.task('move-content-img', function(){
    return gulp.src('./images/content/*.*')
        .pipe(gulp.dest('./public/img/content'));
});

// Переносим картинки из папки for-plugins
gulp.task('move-plugins-img', function(){
    return gulp.src(['./images/for-plugins/*.*', './images/for-plugins/**/*.*'])
        .pipe(gulp.dest('./public/img/for-plugins'));
});

// Сжимаем весь main.js на продакшене, кроме vendors
gulp.task('compress-main-js', function() {
    return gulp.src('./build/js/main.js')
        .pipe(uglify('main.min.js', {
            mangle: false
        }))
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('compress-css', function() {
    return gulp.src('./build/css/main.css')
        .pipe(csso('main.min.css'))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('./build/css/'));
})

// Переносим файлы из рабзработки в продакшн
gulp.task('pre-build', ['clean-build'], function(){
    return gulp.src(filesToMove, { base: './public/' })
        .pipe(gulp.dest('./build'));
});

// Чистим директорию для продакшена 
gulp.task('clean-build', function() {
    return gulp.src('./build/', {read: false})
        .pipe(clean());
});

// Чистим директорию для разработки 
gulp.task('clean-dev', function() {
    return gulp.src('./public/', {read: false})
        .pipe(clean());
});

// Чистим и продакшн и разработку
gulp.task('clean-all', ['clean-dev', 'clean-build'], function() {
});

gulp.task('build-dev', ['clean-dev'], function() {
    gulp.start('sprite');
    gulp.start('scss');    
    gulp.start('vendors-js');
    gulp.start('plugins-and-modules-js');
    gulp.start('jade');
    gulp.start('move-assets');
    gulp.start('move-content-img');
    gulp.start('move-plugins-img');
});

// Запуск gulp dev
gulp.task('dev', function() {
    // Предварительная сборка проекта
    gulp.start('build-dev');

    gulp.watch('./images/for-sprite/*.png', function() {
        gulp.start('sprite');
    });    
    gulp.watch(['./markup/**/**/*.scss', './markup/*.scss'], function() {
        gulp.start('scss');
    });
    gulp.watch(['./markup/*.jade', './markup/**/**/*.jade'], function() {
        gulp.start('jade');
    });
    gulp.watch('./markup/modules/**/*.js', function() {
        gulp.start('plugins-and-modules-js');
    });
    gulp.watch('./markup/modules/**/assets/*.*', function() {
        gulp.start('move-assets');
    });
    gulp.watch('./images/content/*.*', function() {
        gulp.start('move-content-img');
    });
    gulp.watch(['./images/for-plugins/*.*', './images/for-plugins/**/*.*'], function() {
        gulp.start('move-plugins-img');
    });
});

// Сборка всей верстки на выкладку
gulp.task('build', ['pre-build'], function() {
    gulp.start('compress-main-js');
    gulp.start('compress-css'); 
});