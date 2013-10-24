var fs = require('fs'),
    path = require('path'),
    rmdir = require('rmdir'),
    common = require('./common');

module.exports = function(version) {
    var nodeDir;

    version = (/^v/i.test(version) ? version.toLowerCase() : 'v' + version);
    nodeDir = path.join(common.getNvmDir(), version);
    if (fs.existsSync(nodeDir) === false) {
        console.log('%s version is not installed yet', version);
        process.exit(1);
    }

    if (process.env.NVMW === version) {
        console.log('Cannot uninstall currently-active Node version %s', version);
        process.exit(1);
    }

    rmdir(nodeDir, function(err, dirs, files) {
        console.log(
            'uninstalled Node %s %s',version, (err ? 'failed' : 'successfully')
        );
    });
};