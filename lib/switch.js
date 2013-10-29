var fs = require('fs'),
    path = require('path'),
    use = require('./use'),
    common = require('./common'),
    Winreg = require('winreg'),
    regKey = new Winreg({
        hive: Winreg.HKCU,
        key: '\\Software\\Microsoft\\Command Processor'
    });

module.exports = function(version) {
    var cmdAutoRun = path.join(common.getHomeDir(), 'cmd_auto_run.bat');
    use(version);

    /**
     * set current user reg table of cmd AutoRun
     */
    fs.writeFileSync(
        cmdAutoRun,
        '@echo off \nset "NVMW=' + process.env.NVMW + '" \nset "PATH=' + process.env.PATH + '"'
    );
    regKey.set('AutoRun', Winreg.REG_SZ, cmdAutoRun, function(error, result) {
        if (error !== null) {
            console.log('command switch run failed');
        }
    });
};