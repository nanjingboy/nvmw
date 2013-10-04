var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    colors = require('colors'),
    common = require('./common'),
    request = require('request');

function install(version) {
    var nodeDir = path.join(common.getNvmDir(), version),
        nodePath = path.join(nodeDir, 'node.exe'),
        npmCachePath = path.join(common.getNvmCacheDir(), version, 'npm.zip'),
        nodeCachePath = path.join(common.getNvmCacheDir(), version, 'node.exe');

    console.log(('Installing Node ' + version + '...').green);
    fs.mkdirSync(nodeDir);
    fs.createReadStream(nodeCachePath).pipe(fs.createWriteStream(nodePath));
    console.log('Installing NPM...'.green);
}

function downloadNpm(version) {
    var npmPath = path.join(common.getNvmCacheDir(), version, 'npm.zip');

    if (fs.existsSync(npmPath) === false) {
        console.log('Downloading NPM...'.green);
        request.get(
            'https://raw.github.com/joyent/node/' + version + '/deps/npm/package.json',
            function(error, response, body) {
                if (error === null && response.statusCode === 200) {
                    body = JSON.parse(body.toString());
                    request.get(
                        'http://nodejs.org/dist/npm/' + 'npm-' + body.version + '.zip',
                        function(error, response, body) {
                            if (error === null && response.statusCode === 200) {
                                install(version);
                            } else {
                                console.log('NPM for Node %s downloaded failed', version);
                                process.exit(1);
                            }
                        }
                    ).pipe(fs.createWriteStream(npmPath));
                } else {
                    fs.unlinkSync(npmPath);
                    console.log('NPM for Node %s downloaded failed', version);
                    process.exit(1);
                }
            }
        );
    } else {
        install(version);
    }
}

function downloadNode(version) {
    var nodeDir = path.join(common.getNvmCacheDir(), version),
        nodePath = path.join(nodeDir, 'node.exe'),
        url = 'http://nodejs.org/dist/' + version;

    if (fs.existsSync(nodeDir) === false) {
        fs.mkdirSync(nodeDir);
    }

    if (fs.existsSync(nodePath) === false) {
        if (os.arch().toLowerCase() === 'x64') {
            url += '/x64/node.exe';
        } else {
            url += '/node.exe';
        }

        console.log('Downloading Node...'.green);
        request.get(url, function(error, response, body) {
            if (error === null && response.statusCode === 200) {
                downloadNpm(version);
            } else {
                fs.unlinkSync(nodePath);
                console.log('Node %s downloaded failed', version);
                process.exit(1);
            }
        }).pipe(fs.createWriteStream(nodePath));
    } else {
        downloadNpm(version);
    }
}

function mkdir() {
    var dirPath = common.getBaseDir();

    if (fs.existsSync(dirPath) === false) {
        fs.mkdirSync(dirPath);
    }

    dirPath = common.getNvmCacheDir();
    if (fs.existsSync(dirPath) === false) {
        fs.mkdirSync(dirPath);
    }

    dirPath = common.getNvmDir();
    if (fs.existsSync(dirPath) === false) {
        fs.mkdirSync(dirPath);
    }
}

module.exports = function(version) {
    var nodeDir,
        nodeCacheDir;

    version = (/^v/i.test(version) ? version.toLowerCase() : 'v' + version);
    nodeDir = path.join(common.getNvmDir(), version);
    if (fs.existsSync(nodeDir)) {
        console.log('%s version is already installed', version);
        process.exit(1);
    }

    mkdir();
    downloadNode(version);
};