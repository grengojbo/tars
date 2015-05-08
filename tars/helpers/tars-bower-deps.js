var bower = require('bower');
var fs = require('fs');
var tarsConfig = require('../../tars-config');
var bowerOrderedDependencies = require('../helpers/bower-ordered');




module.exports = {
    setTarsBowerDeps: function() {

        bower.commands
            .list([], {
                'offline': true
            }, { /*confs*/ })
            .on('end', function(output) {
                fs.writeFile(tarsConfig.bower_dependencies_path, JSON.stringify(output), function(err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                });

            });
    },

    getTarsBowerDeps: function(){
        var opts = {
            exclude_files: tarsConfig.bower_exclude_files,
        };

        try {
            var bowerDepFile = require("../../"+tarsConfig.bower_dependencies_path);
            var bod = new bowerOrderedDependencies(bowerDepFile, opts);
            return bod;
        }
        catch (e) {
            console.log('no file with bower ependencies');
            var bod = new bowerOrderedDependencies({}, opts);
            return bod;
        }
    }

};
