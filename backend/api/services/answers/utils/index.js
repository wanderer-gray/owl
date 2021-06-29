const crypto = require('crypto');

const SECRET = crypto.randomBytes(16).toString('hex');

const getSign = async ({
  testId, userId, begin, end,
}) => new Promise((resolve, reject) => {
  const payload = `${testId}:${userId}:${begin}:${end}`;

  crypto.pbkdf2(payload, SECRET, 1000, 32, 'sha256', (error, hash) => {
    if (error) {
      reject(error);
    }
    resolve(hash.toString('hex'));
  });
});

const checkSign = async ({ sign, ...payload }) => {
  const currSign = await getSign(payload);

  return currSign === sign;
};

module.exports = {
  getSign,
  checkSign,
};
