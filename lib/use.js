var os = require('os'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    common = require('./common');

module.exports = {
    _createTmp: function() {
        fs.writeFileSync(path.join(os.tmpdir(), 'NVMW'), process.env.NVMW);
        fs.writeFileSync(path.join(os.tmpdir(), 'PATH'), process.env.PATH);
    },

    _deactivate: function() {
        if (process.env.NVMW) {
            process.env.PATH = process.env.PATH.replace(
                path.join(common.getNvmDir(), process.env.NVMW) + ';', ''
            );
            process.env.NVMW = '';
        }
    },

    use: function(version) {
        var nodeDir;

        version = (/^v/i.test(version) ? version : 'v' + version);
        nodeDir = path.join(common.getNvmDir(), version.toLowerCase());
        if (fs.existsSync(nodeDir) === false) {
            console.log('%s version is not installed yet', version);
            process.exit(1);
        }

        this._deactivate();
        process.env.NVMW = version;
        process.env.PATH = nodeDir + ";" + process.env.PATH;
        this._createTmp();
    },

    deactivate: function() {
        this._deactivate();
        this._createTmp();
    }
};