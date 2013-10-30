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

    replacePathEnvironment: function(version) {
        var nvmDir = this.getNvmDir();
        function replace(nvmDir, version) {
            var reg;

            if (version) {
                reg = new RegExp(path.join(nvmDir, version).replace(/\\/g, '\\\\') + ';', 'gi');
                process.env.PATH = process.env.PATH.replace(reg, '');
            }
        }

        replace(nvmDir, process.env.NVMW);
        replace(nvmDir, process.env.NVMW_DEFAULT);
        if (version) {
            replace(nvmDir, version);
        }

        return process.env.PATH
    },

    createEnvironmentTmp: function(filePath) {
        filePath = (filePath || path.join(os.tmpdir(), 'nvmw_env.bat'));
        fs.writeFileSync(
            filePath,
            '@echo off \nset "NVMW=' + (process.env.NVMW ? process.env.NVMW : '') +
            '"\nset "NVMW_DEFAULT=' + (process.env.NVMW_DEFAULT ? process.env.NVMW_DEFAULT : '') +
            '"\nset "PATH=' + process.env.PATH + '"'
        );
    }
};