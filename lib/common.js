var fs = require('fs'),
    os = require('os'),
    path = require('path');

module.exports = {
    replaceVersion: function(version) {
        return (/^v/i.test(version) ? version.toLowerCase() : 'v' + version);
    },

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

    getNodeDir: function(version) {
        return path.join(this.getNvmDir(), this.replaceVersion(version));
    },

    getCurrentVersion: function() {
        return (process.env.NVMW ? process.env.NVMW : process.version);
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