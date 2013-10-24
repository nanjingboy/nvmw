var fs = require('fs'),
    os = require('os'),
    path = require('path');

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