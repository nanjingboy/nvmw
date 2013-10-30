var fs = require('fs'),
    program = require('commander');

packageConfig = JSON.parse(
    fs.readFileSync(__dirname + '/../package.json').toString()
);

program.version(packageConfig.version);

program
    .command('install <version>')
    .description('install the given version of Node')
    .action(function(version) {
        require('../lib/install')(version);
    });
program
    .command('uninstall <version>')
    .description('uninstall the given version of Node')
    .action(function(version) {
        require('../lib/uninstall')(version);
    });
program
    .command('use <version>')
    .description('use the given version of Node in current shell')
    .action(function(version) {
        require('../lib/use')(version);
    });
program
    .command('deactivate')
    .description('undo effects of nvmw in current shell')
    .action(function() {
        require('../lib/deactivate')();
    });
program
    .command('switch <version>')
    .description('permanently use the given version of Node as default')
    .action(function(version) {
        require('../lib/switch')(version);
    });
program
    .command('switch-deactivate')
    .description('permanently undo effects of nvmw')
    .action(function(version) {
        require('../lib/switch_deactivate')();
    });
program
    .command('ls')
    .description('list the installed all Nodes')
    .action(function() {
        require('../lib/ls').local();
    });
program
    .command('ls-remote')
    .description('list remote versions available for install')
    .action(function() {
        require('../lib/ls').remote();
    });
program
    .command('cleanup')
    .description('remove stale local caches')
    .action(function() {
        require('../lib/cleanup')();
    });

program.on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    nvmw install v0.10.20');
  console.log('    nvmw uninstall v0.10.20');
  console.log('    nvmw use v0.10.20');
  console.log('');
});

process.argv[1] = 'nvmw';
program.parse(process.argv);