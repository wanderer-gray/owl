const crypto = require('crypto');
const config = require('../../../../config');

const SALT = config.api.password.salt;

const getSalt = () => crypto.randomBytes(16).toString('hex');

const getHash = async (password, salt) => new Promise((resolve, reject) => {
  crypto.pbkdf2(password, salt + SALT, 1000, 32, 'sha256', (error, hash) => {
    if (error) {
      reject(error);
    }
    resolve(hash.toString('hex'));
  });
});

const checkPassword = async (password, salt, hash) => {
  const currHash = await getHash(password, salt);

  return currHash === hash;
};

module.exports = {
  getSalt,
  getHash,
  checkPassword,
};
