
var _ = require('underscore'),
BowerOrderedDependencies;

BowerOrderedDependencies = function (package, opts) {
    this.defaults = {
        exclude_files: [],
        package_files_overrides: {}
        // exclude_deps: [],
    };
    this.options = _.extend(this.defaults, opts);
    this.deps_list = [];
    this.search_deps(package.dependencies);

};

BowerOrderedDependencies.prototype = {

    addDependency: function (dependency) {
        var dep_name = dependency.endpoint.name;
        var dep_exists = _.find(this.deps_list, function (el) {
            return el.name === dep_name;
        });

        if (!dep_exists){
            if (_.has(this.options.package_files_overrides, dep_name)) {
                dependency.pkgMeta.main = this.options.package_files_overrides[dep_name];
            }
            if (!!dependency.pkgMeta.main) {
                var dependency_files = _.flatten(new Array(dependency.pkgMeta.main));
            }else {
                var dependency_files = [];
            }

            // remove paths from file names
            dependency_files = _.map(dependency_files, function (item) {
                return item.split("/").pop();

            });

            // remove * like file names
            dependency_files = _.filter(dependency_files, function (el) {
                return el.indexOf('*') == -1;
            });
            var number_of_deps = _.keys(dependency.pkgMeta.dependencies).length || 0;
            this.deps_list.push({
                name: dep_name,
                files: dependency_files,
                deps_number: number_of_deps
                // _.values(dependency.dependencies).length
            });

            this.search_deps(dependency.dependencies);
        }

    },

    search_deps: function (deps) {

        var deps_list = _.values(deps);
        for (var i = 0; i < deps_list.length; i++) {
            this.addDependency(deps_list[i]);
        }
    },
    deps: function () {
        var sorted_deps = _.sortBy(this.deps_list, 'deps_number');
        if (_.isEmpty(this.options.exclude_deps)){
            return sorted_deps;
        }else {
            var exclude_deps = this.options.exclude_deps;
            return _.filter(sorted_deps, function (item) {
                return exclude_deps.indexOf(item.name) == -1;
            });
        }

    },
    depsList: function () {
        return _.pluck(this.deps(), 'name');
    },

    // containes - string files should
    depsFiles: function (files_opts) {
        files_opts = files_opts || {};
        var contains = files_opts.contains||false;
        var excluded = files_opts.excluded||false;
        var file_names = _.flatten(_.pluck(this.deps(), 'files'));

        if (!_.isEmpty(this.options.exclude_files)){
            if (excluded){
                file_names = _.intersection(file_names, this.options.exclude_files);
            }else {
                file_names = _.difference(file_names, this.options.exclude_files);
            }

        }else {
            if (excluded) {
                return [];
            }
        }
        if (contains){
            return _.filter(file_names, function (el) {
                return el.indexOf(contains) != -1;
            });
        }else {
            return file_names;
        }

    },

    depsJsFiles: function (options) {
        return this.depsFiles({ contains: '.js',excluded: false });
    },

    depsJsFilesExcluded: function (options) {
        return this.depsFiles({ contains: '.js',excluded: true });
    },

    depsCssFiles: function () {
        return this.depsFiles({ contains: '.css',excluded: false });
    }

};

module.exports = BowerOrderedDependencies;
