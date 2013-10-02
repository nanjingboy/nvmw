var request = require('request'),
    _ = require('underscore');

function sort(left, right, index) {
    if (Number(left[index]) === Number(right[index])) {
        return (index === 2 ? 0 : sort(left, right, index + 1));
    }
    return (Number(left[index]) > Number(right[index]) ? 1 : -1);
}

module.exports = {
    remote: function() {
        request.get('http://nodejs.org/dist/', function(error, response, body) {
            var versions = [];

            if (error === null && response.statusCode === 200) {
                versions = _.uniq(body.match(/v[0-9]+\.[0-9]+\.[0-9]+/gi));
            }

            console.log('');
            if (versions.length <= 0) {
                console.log('N/A');
            } else {
                versions = versions.sort(
                    function(versionLeft, versionRight) {
                        return sort(
                            versionLeft.substr(1).split('.'),
                            versionRight.substr(1).split('.'),
                            0
                        );
                    }
                );
                _.each(versions, function(version) {
                    console.log(version);
                });
            }
        });
    }
};
