var fs = require('fs')
    , Log = require('log')
    , log = new Log('debug', fs.createWriteStream('my.log'));

module.exports = log;