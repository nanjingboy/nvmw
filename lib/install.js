var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    colors = require('colors'),
    AdmZip = require('adm-zip'),
    common = require('./common'),
    request = require('request');

function errorCallback(filePath, errorMessage) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    console.log(errorMessage);
    process.exit(1);
}

function downloadNpm(version, callback) {
    var cachePath;

    if (/^v0.[0-6].[0-2]$/.test(version)) {
        console.log('Node %s is not include npm', version);
        return callback(null);
    }

    cachePath = path.join(common.getNvmCacheDir(), version, 'npm.zip');
    if (fs.existsSync(cachePath)) {
        return callback(cachePath);
    }

    console.log('Downloading NPM...'.green);
    request.get(
        'https://raw.github.com/joyent/node/' + version + '/deps/npm/package.json',
        function(error, response, body) {
            var errorMessage = 'NPM for Node ' + version + ' downloaded failed';
            if (error === null && response.statusCode === 200) {
                body = JSON.parse(body.toString());
                request.get(
                    'http://nodejs.org/dist/npm/npm-' + body.version + '.zip',
                    function(error, response, body) {
                        if (error === null && response.statusCode === 200) {
                            callback(cachePath);
                        } else {
                            errorCallback(cachePath, errorMessage);
                        }
                    }
                ).pipe(fs.createWriteStream(cachePath));
            } else {
                errorCallback(cachePath, errorMessage);
            }
        }
    );
}

function downloadNode(version, callback) {
    var cachePath = path.join(common.getNvmCacheDir(), version, 'node.exe'),
        url;

    if (fs.existsSync(cachePath)) {
        return callback(cachePath);
    }

    url = 'http://nodejs.org/dist/' + version;
    if (os.arch().toLowerCase() === 'x64') {
        url += '/x64/node.exe';
    } else {
        url += '/node.exe';
    }
    console.log('Downloading Node %s... '.green, version);
    request.get(url, function(error, response, body) {
        if (error === null && response.statusCode === 200) {
            callback(cachePath);
        } else {
            errorCallback(cachePath, 'Node ' + version + 'downloaded failed');
        }
    }).pipe(fs.createWriteStream(cachePath));
}

module.exports = function(version) {
    var nodeDir;

    version = (/^v/i.test(version) ? version.toLowerCase() : 'v' + version);
    nodeDir = path.join(common.getNvmDir(), version);
    if (fs.existsSync(nodeDir)) {
        console.log('%s version is already installed', version);
        process.exit(1);
    }

    if (fs.existsSync(common.getBaseDir()) === false) {
        fs.mkdirSync(common.getBaseDir());
    }

    if (fs.existsSync(common.getNvmDir()) === false) {
        fs.mkdirSync(common.getNvmDir());
    }

    if (fs.existsSync(common.getNvmCacheDir()) === false) {
        fs.mkdirSync(common.getNvmCacheDir());
    }

    if (fs.existsSync(path.join(common.getNvmCacheDir(), version)) === false) {
        fs.mkdirSync(path.join(common.getNvmCacheDir(), version));
    }

    downloadNode(version, function(nodeCachePath) {
        downloadNpm(version, function(npmCachePath) {
            var zip;

            fs.mkdirSync(nodeDir);
            console.log('Installing Node %s...'.green, version);
            fs.createReadStream(nodeCachePath).pipe(
                fs.createWriteStream(path.join(nodeDir, 'node.exe'))
            );

            if (npmCachePath !== null) {
                console.log('Install Npm for Node %s...'.green, version);
                zip = new AdmZip(npmCachePath);
                zip.extractAllTo(nodeDir, true);
            }

            console.log(
                '\nNode %s installed successfully, just run `nvmw use %s` switch to this version',
                version, version
            );
        });
    });
};
