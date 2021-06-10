const crypto = require('crypto');

const getCode = () => crypto.randomInt(100000, 999999);

module.exports = {
  getCode,
};
