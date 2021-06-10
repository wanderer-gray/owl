const login = require('./login');
const logout = require('./logout');
const signup = require('./signup');
const sendSignUpCode = require('./sendSignUpCode');
const restore = require('./restore');
const sendRestoreCode = require('./sendRestoreCode');

module.exports = async (fastify) => fastify.service({
  auth: false,
  operations: [
    login,
    logout,
    signup,
    sendSignUpCode,
    restore,
    sendRestoreCode,
  ],
});
