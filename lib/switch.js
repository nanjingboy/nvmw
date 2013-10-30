var path = require('path'),
    use = require('./use'),
    common = require('./common'),
    Winreg = require('winreg'),
    regKey = new Winreg({
        hive: Winreg.HKCU,
        key: '\\Software\\Microsoft\\Command Processor'
    });

module.exports = function(version) {
    var cmdAutoRun = path.join(common.getHomeDir(), 'cmd_auto_run.bat');
    use(version, true);

    /**
     * set current user reg table of cmd AutoRun
     */
    process.env.NVMW_DEFAULT = process.env.NVMW;
    common.createEnvironmentTmp(cmdAutoRun);
    regKey.set('AutoRun', Winreg.REG_SZ, cmdAutoRun, function(error, result) {
        if (error !== null) {
            console.log('command switch run failed');
            process.exit(1);
        }
    });
};