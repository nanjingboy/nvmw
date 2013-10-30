var fs = require('fs'),
    path = require('path'),
    common = require('./common'),
    Winreg = require('winreg'),
    regKey = new Winreg({
        hive: Winreg.HKCU,
        key: '\\Software\\Microsoft\\Command Processor'
    });

module.exports = function() {
    regKey.remove('AutoRun', function(error, result) {
        var cmdAutoRun;

        if (error === null) {
            fs.unlinkSync(path.join(common.getHomeDir(), 'cmd_auto_run.bat'));
            common.replacePathEnvironment();
            process.env.NVMW = '';
            process.env.NVMW_DEFAULT = '';
            common.createEnvironmentTmp();
        } else {
            console.log('command switch-deactivate run failed');
            process.exit(1);
        }
    });
};