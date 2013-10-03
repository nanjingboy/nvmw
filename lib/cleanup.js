var common = require('./common');

module.exports = function() {
    common.rmdir(common.getNvmCacheDir());
};