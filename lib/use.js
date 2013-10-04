var fs = require('fs'),
    path = require('path'),
    common = require('./common');

module.exports = function(version) {
    var nodeDir;

    version = (/^v/i.test(version) ? version.toLowerCase() : 'v' + version);
    nodeDir = path.join(common.getNvmDir(), version);
    if (fs.existsSync(nodeDir) === false) {
        console.log('%s version is not installed yet', version);
        process.exit(1);
    }
    common.resetEnv();
    process.env.NVMW = version;
    process.env.PATH = nodeDir + ";" + process.env.PATH;
    common.createEnvTmp();
};