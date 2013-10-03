var fs = require('fs'),
    path = require('path'),
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
        return (process.env.NVMW ? process.version : process.env.NVMW);
    },

    rmdir: function(dirPath) {
        var that = this;

        if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
            _.each(fs.readdirSync(dirPath), function(filePath) {
                filePath = path.join(dirPath, filePath);
                if (fs.lstatSync(filePath).isDirectory()) {
                    that.rmdir(filePath);
                } else {
                    fs.unlinkSync(filePath);
                }
            });

            fs.rmdirSync(dirPath);
        }
    }
};