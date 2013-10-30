var common = require('./common');

module.exports = function() {
    common.replacePathEnvironment();

    if (process.env.NVMW_DEFAULT) {
        process.env.NVMW = process.env.NVMW_DEFAULT;
        process.env.PATH = common.getNodeDir(process.env.NVMW_DEFAULT) + ";" + process.env.PATH;
    }

    common.createEnvironmentTmp();
};