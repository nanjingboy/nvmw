var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    async = require('async'),
    _ = require('underscore'),
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
    var nodeCachePath = getNodeCachePath(version);

    if (fs.existsSync(nodeCachePath)) {
        return callback(null, true);
    }

    console.log('Downloading Node %s... '.green, version);
    async.waterfall(
        [
            function(nodeCallback) {
                var nodeMirrorUrl =  process.env.NVM_NODEJS_ORG_MIRROR || 'http://nodejs.org/dist/';
                nodeMirrorUrl = nodeMirrorUrl.endsWith('/') ? nodeMirrorUrl : nodeMirrorUrl + '/';
                var url = nodeMirrorUrl + version;
                if (os.arch().toLowerCase() !== 'x64') {
                    return nodeCallback(true, url +'/node.exe');
                }

                request.head(url + '/win-x64/node.exe', function(error, response) {
                    if (error === null) {
                        if (response.statusCode === 404) {
                            return nodeCallback(true, url + '/node.exe');
                        }

                        if (response.statusCode === 200) {
                            return nodeCallback(true, url + '/win-x64/node.exe');
                        }
                    }
                    nodeCallback(false, null);
                });
            }
        ],
        function(status, url) {
            if (status === false) {
               console.log('Node %s downloaded failed', version);
               return callback(null, false);
            }

            request.get(url, function(error, response, data) {
                var status = true;

                if (error !== null || response.statusCode !== 200) {
                    status = false;
                    fs.unlinkSync(nodeCachePath);
                    console.log('Node %s downloaded failed', version);
                }
                callback(null, status);
            }).pipe(fs.createWriteStream(nodeCachePath));
        }
    );
}

function downloadNpm(version, callback) {
    var npmCachePath = getNpmCachePath(version);

    if (fs.existsSync(npmCachePath)) {
        return callback(true);
    }

    console.log('Downloading Npm for Node %s...'.green, version);
    async.waterfall(
        [
            function(npmCallback) {
                if (/^v0.[0-6].[0-2]$/.test(version)) {
                    console.log('Node %s is not include npm'.yellow, version);
                    return npmCallback(true, null);
                }

                request.get(
                    'https://raw.github.com/joyent/node/' + version + '/deps/npm/package.json',
                    function(error, response, data) {
                        var status = false,
                            npmVersion = null;

                        if (error === null && response.statusCode === 200) {
                            status = true;
                            npmVersion = JSON.parse(data.toString()).version;
                        }
                        npmCallback(status, npmVersion);
                    }
                );
            }
        ],
        function(status, npmVersion) {
            var npmVersionParts;

            if (status === false) {
                console.log('Npm for Node %s downloaded failed', version);
                return callback(false);
            }

            if (npmVersion === null) {
                return callback(true);
            }

            npmVersionParts = _.map(npmVersion.split('.'), function(index) {
                return parseInt(index);
            });
            if (npmVersionParts[0] > 1) {
                npmVersion = '1.4.12';
            } else if (npmVersionParts[0] == 1 && (npmVersionParts[1] > 4 || npmVersionParts[2] > 12)) {
                npmVersion = '1.4.12';
            }
            request.get(
                'http://nodejs.org/dist/npm/npm-' + npmVersion + '.zip',
                function(error, response, data) {
                    var status = true;

                    if (error !== null || response.statusCode !== 200) {
                        status = false;
                        fs.unlinkSync(getNpmCachePath(version));
                        console.log('Npm for Node %s downloaded failed', version);
                    }

                    callback(status);
                }
            ).pipe(fs.createWriteStream(npmCachePath));
        }
    );
}

function install(nodeDir, version) {
    var npmCachePath = getNpmCachePath(version),
        nodeCachePath = getNodeCachePath(version),
        zip;

    mkdirp.sync(nodeDir);
    console.log('Installing Node %s...'.green, version);
    fs.createReadStream(nodeCachePath).pipe(
        fs.createWriteStream(path.join(nodeDir, 'node.exe'))
    );

    if (fs.existsSync(npmCachePath)) {
        console.log('Installing Npm for Node %s...'.green, version);
        zip = new AdmZip(npmCachePath);
        zip.extractAllTo(nodeDir, true);
    }

    console.log(
        '\nNode %s installed successfully, just run `nvmw use %s` switch to this version',
        version, version
    );
}

module.exports = function(version) {
    var nodeDir;

    version = common.replaceVersion(version);
    if (/^(v0.[0-4].[0-9]+)|(v0.5.0)$/i.test(version)) {
        console.log('Sorry but nvmw can not install the Node which version below v0.5.1');
        process.exit(1);
    }

    nodeDir = common.getNodeDir(version);
    if (fs.existsSync(path.join(nodeDir, 'node.exe'))) {
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
                    return callback(false);
                }

                downloadNpm(version, callback);
            }
        ],
        function(status) {
            if (status === true) {
                install(nodeDir, version);
            }
        }
    );
};