var path = require('path'),
    _ = require('underscore');

module.exports = {
    getHomeDir: function() {
        return path.join(process.env.HOMEDRIVE,  process.env.HOMEPATH);
    },

    getNvmCacheDir: function() {
        return path.join(this.getHomeDir(), 'nvmw', 'cache');
    },

    getNvmDir: function() {
        return path.join(this.getHomeDir(), 'nvmw', 'nodejs');
    },

    getCurrentVersion: function() {
        return (_.isUndefined(process.env.NVMW) ? process.version : process.env.NVMW);
    }
};