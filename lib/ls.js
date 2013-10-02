var fs = require('fs'),
    _ = require('underscore'),
    colors = require('colors'),
    common = require('./common'),
    request = require('request');

module.exports = {
    sort: function(versions) {
        function sort(left, right, index) {
            if (Number(left[index]) === Number(right[index])) {
                return (index === 2 ? 0 : sort(left, right, index + 1));
            }
            return (Number(left[index]) > Number(right[index]) ? 1 : -1);
        }

        if (_.size(versions) <= 0 || _.isArray(versions) === false) {
            return versions;
        }

        return versions.sort(function(left, right) {
            return sort(
                left.substr(1).split('.'),
                right.substr(1).split('.'),
                0
            );
        });
    },

    local: function() {
        var nvmDir = common.getNvmDir(),
            currentVersion = common.getCurrentVersion(),
            systemVersion = 'system(' + process.version + ')',
            versions = [];

        if (fs.existsSync(nvmDir) && fs.lstatSync(nvmDir).isDirectory()) {
            versions = this.sort(fs.readdirSync(nvmDir));
        }

        if (_.isUndefined(process.env.NVMW)) {
            console.log('* %s', systemVersion.green);
        } else {
            console.log(systemVersion);
        }
        _.each(versions, function(version) {
            if (currentVersion === version) {
                console.log('* %s', version.green);
            } else {
                console.log(version);
            }
        });
    },

    remote: function() {
        var that = this;

        request.get('http://nodejs.org/dist/', function(error, response, body) {
            var versions = [];
            if (error === null && response.statusCode === 200) {
                versions = that.sort(
                    _.uniq(body.match(/v[0-9]+\.[0-9]+\.[0-9]+/gi))
                );
            }

            if (versions.length <= 0) {
                console.log('N/A');
            } else {
                _.each(versions, function(version) {
                    console.log(version);
                });
            }
        });
    }
};