var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    colors = require('colors'),
    AdmZip = require('adm-zip'),
    request = require('request'),
    common = require('./common');

function getNodeCachePath(version) {
    return path.join(common.getNvmCacheDir(), version, 'node.exe');
}

function getNpmCachePath(version) {
    return path.join(common.getNvmCacheDir(), version, 'npm.zip');
}

function downloadNode(version, callback) {
    var url;

    console.log('Downloading Node %s... '.green, version);
    if (fs.existsSync(getNodeCachePath(version))) {
        return callback(null, true);
    }

    url = 'http://nodejs.org/dist/' + version;
    if (os.arch().toLowerCase() === 'x64') {
        url += '/x64/node.exe';
    } else {
        url += '/node.exe';
    }
    request.get(url, function(error, response, data) {
        var status = true;

        if (error !== null || response.statusCode !== 200) {
            status = false;
            fs.unlinkSync(getNodeCachePath(version));
            console.log('Node %s downloaded failed', version);
        }
        callback(null, status);
    }).pipe(fs.createWriteStream(getNodeCachePath(version)));
}

function searchNpmVersion(version, callback) {
    if (/^v0.[0-6].[0-2]$/.test(version)) {
        return callback(null, true, null);
    }

    console.log('Searching NPM version for Node %s...'.green, version);
    request.get(
        'https://raw.github.com/joyent/node/' + version + '/deps/npm/package.json',
        function(error, response, data) {
            var status = false,
                npmVersion = null;

            if (error === null && response.statusCode === 200) {
                status = true;
                npmVersion = JSON.parse(data.toString()).version;
            } else {
                console.log('NPM version for Node %s searched failed', version);
            }

            callback(null, status, npmVersion);
        }
    );
}

function downloadNpm(version, npmVersion, callback) {
    if (npmVersion === null) {
        console.log('Node %s is not include npm'.yellow, version);
        return callback(true);
    }

    console.log('Downloading NPM v%s...'.green, npmVersion);
    if (fs.existsSync(getNpmCachePath(version))) {
        return callback(true);
    }

    request.get(
        'http://nodejs.org/dist/npm/npm-' + npmVersion + '.zip',
        function(error, response, data) {
            var status = true;

            if (error !== null || response.statusCode !== 200) {
                status = false;
                fs.unlinkSync(getNpmCachePath(version));
                console.log('NPM v%s downloaded failed', npmVersion);
            }

            callback(status);
        }
    ).pipe(fs.createWriteStream(getNpmCachePath(version)));
}

module.exports = function(version) {
    var nodeDir;

    version = (/^v/i.test(version) ? version.toLowerCase() : 'v' + version);
    nodeDir = path.join(common.getNvmDir(), version);
    if (fs.existsSync(nodeDir)) {
        console.log('%s version is already installed', version);
        process.exit(1);
    }

    mkdirp.sync(path.join(common.getNvmCacheDir(), version));
    async.waterfall(
        [
            function(callback) {
                downloadNode(version, callback);
            },
            function(status, callback) {
                if (status === false) {
                    return callback(null, false, null);
                }

                searchNpmVersion(version, callback);
            },
            function(status, npmVersion, callback) {
                if (status === false) {
                    return callback(false);
                }

                downloadNpm(version, npmVersion, callback);
            }
        ],
        function(status) {
            var zip,
                npmCachePath,
                nodeCachePath;

            if (status === false) {
                return console.log('\nNode %s installed failed', version);
            }

            mkdirp.sync(nodeDir);
            npmCachePath = getNpmCachePath(version);
            nodeCachePath = getNodeCachePath(version);
            console.log('Installing Node %s...'.green, version);
            fs.createReadStream(nodeCachePath).pipe(
                fs.createWriteStream(path.join(nodeDir, 'node.exe'))
            );

            if (fs.existsSync(npmCachePath)) {
                console.log('Install Npm for Node %s...'.green, version);
                zip = new AdmZip(npmCachePath);
                zip.extractAllTo(nodeDir, true);
            }

            console.log(
                '\nNode %s installed successfully, just run `nvmw use %s` switch to this version',
                version, version
            );
        }
    );
};