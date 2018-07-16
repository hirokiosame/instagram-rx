const crypto = require('crypto');

const md5 = (str => crypto.createHash('md5').update(str, 'utf8').digest('hex'));

module.exports = md5;
