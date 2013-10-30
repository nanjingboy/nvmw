var fs = require('fs'),
    path = require('path'),
    common = require('./common');

module.exports = function(version, ignoreTmp) {
    var version = common.replaceVersion(version),
        nodeDir = common.getNodeDir(version);

    if (fs.existsSync(nodeDir) === false) {
        console.log('%s version is not installed yet', version);
        process.exit(1);
    }

    process.env.PATH = nodeDir + ";" + common.replacePathEnvironment(version);
    process.env.NVMW = version;
    if (ignoreTmp !== true) {
        common.createEnvironmentTmp();
    }
};