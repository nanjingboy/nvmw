var fs = require('fs'),
    path = require('path'),
    common = require('./common');

module.exports = function(version) {
    var nodeDir;

    version = (/^v/i.test(version) ? version : 'v' + version);
    nodeDir = path.join(common.getNvmDir(), version.toLowerCase());
    if (fs.existsSync(nodeDir) === false) {
        console.log('%s version is not installed yet', version);
        process.exit(1);
    }

    if (process.env.NVMW === version) {
        console.log('Cannot uninstall currently-active Node version %s', version);
        process.exit(1);
    }

    common.rmdir(nodeDir);
    console.log('uninstalled Node %s successfully', version);
};