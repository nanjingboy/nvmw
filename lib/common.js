var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    _ = require('underscore');

module.exports = {
    getHomeDir: function() {
        return path.join(process.env.HOMEDRIVE,  process.env.HOMEPATH);
    },

    getBaseDir: function() {
        return path.join(this.getHomeDir(), 'nvmw');
    },

    getNvmCacheDir: function() {
        return path.join(this.getBaseDir(), 'cache');
    },

    getNvmDir: function() {
        return path.join(this.getBaseDir(), 'nodejs');
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
    },

    resetEnv: function() {
        if (process.env.NVMW) {
            process.env.PATH = process.env.PATH.replace(
                path.join(this.getNvmDir(), process.env.NVMW) + ';', ''
            );
            process.env.NVMW = '';
        }
    },

    createEnvTmp: function() {
        fs.writeFileSync(path.join(os.tmpdir(), 'NVMW'), process.env.NVMW);
        fs.writeFileSync(path.join(os.tmpdir(), 'PATH'), process.env.PATH);
    }
};