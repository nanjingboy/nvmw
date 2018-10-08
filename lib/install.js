var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    async = require('async'),
    _ = require('underscore'),
    mkdirp = require('mkdirp'),
    colors = require('colors'),
    rmdir = require('rmdir'),
    extract = require('extract-zip'),
    request = require('request'),
    common = require('./common');

function getNodeCachePath(version) {
    return path.join(common.getNvmCacheDir(), version, 'node.zip');
}

function downloadNode(version, callback) {
    var nodeCachePath = getNodeCachePath(version);

    if (fs.existsSync(nodeCachePath)) {
        return callback(true);
    }

    console.log('Downloading Node %s... '.green, version);
    async.waterfall(
        [
            function(nodeCallback) {
                var nodeMirrorUrl =  process.env.NVM_NODEJS_ORG_MIRROR || 'http://nodejs.org/dist/';
                nodeMirrorUrl = nodeMirrorUrl.endsWith('/') ? nodeMirrorUrl : nodeMirrorUrl + '/';
                var url = nodeMirrorUrl + version + '/node-' + version + '-win-';
                if (os.arch().toLowerCase() === 'x64') {
                    return nodeCallback(true, url +'x64.zip');
                }
                return nodeCallback(true, url +'x86.zip');
            }
        ],
        function(status, url) {
            if (status === false) {
               console.log('Node %s downloaded failed', version);
               return callback(false);
            }
            request.get(url, function(error, response, data) {
                var status = true;

                if (error !== null || response.statusCode !== 200) {
                    status = false;
                    fs.unlinkSync(nodeCachePath);
                    console.log('Node %s downloaded failed', version);
                }
                callback(status);
            }).pipe(fs.createWriteStream(nodeCachePath));
        }
    );
}

function install(targetPath, version) {
    var nodeFileName,
        nodeCachePath = getNodeCachePath(version);
    mkdirp.sync(targetPath);
    if (os.arch().toLowerCase() === 'x64') {
        nodeFileName = 'node-' + version + '-win-x64';
    } else {
        nodeFileName = 'node-' + version + '-win-x86';
    }
    console.log('Installing Node %s...'.green, version);
    if (fs.existsSync(nodeCachePath)) {
        extract(nodeCachePath, { dir: targetPath }, function(error) {
            if (error) {
                rmdir(path.join(targetPath, nodeFileName), function(err, dirs, files) {
                    fs.unlinkSync(nodeCachePath);
                    console.log('Node %s installed failed', version);
                });
            } else {
                fs.renameSync(path.join(targetPath, nodeFileName), path.join(targetPath, version));
                console.log(
                    '\nNode %s installed successfully, just run `nvmw use %s` switch to this version',
                    version, version
                );
            }
        })
    }
}

module.exports = function(version) {
    var nodeDir,
        versionParts;

    version = common.replaceVersion(version);
    versionParts = _.map(version.split('.'), function(index) {
        return parseInt(index.replace('v', ''));
    });
    if (versionParts[0] < 4 || (versionParts[0] === 4 && versionParts[1] < 5)) {
        console.log('Sorry but nvmw can not install the Node which version below v4.5.0');
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
            }
        ],
        function(status) {
            if (status === true) {
                install(path.join(nodeDir, '..'), version);
            }
        }
    );
};
