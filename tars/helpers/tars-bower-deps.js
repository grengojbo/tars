var bower = require('bower');
var fs = require('fs');
var tarsConfig = require('../../tars-config');
var BowerOrderedDependencies = require('../helpers/bower-ordered');

module.exports = {
    setTarsBowerDeps: function () {

        bower.commands
            .list([], {
                'offline': true
            }, { /*confs*/ })
            .on('end', function (output) {
                fs.writeFile(tarsConfig.bower_dependencies_path, JSON.stringify(output), function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                });

            });
    },

    getTarsBowerDeps: function () {
        var opts = {
            exclude_files: tarsConfig.bower_exclude_files,
            package_files_overrides: tarsConfig.package_files_overrides
        };

        try {
            var bowerDepFile = require("../../" + tarsConfig.bower_dependencies_path);
            var bod = new BowerOrderedDependencies(bowerDepFile, opts);
            return bod;
        }
        catch (e) {
            console.log(e);
            console.log('no file with bower dependencies');
            var bod = new BowerOrderedDependencies({}, opts);
            return bod;
        }
    }

};
