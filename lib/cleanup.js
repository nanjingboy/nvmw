var common = require('./common');

module.exports = function() {
    common.rmdir(common.getNvmCacheDir());
    console.log('stale local caches removed successfully');
};