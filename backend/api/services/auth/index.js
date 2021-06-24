const init = require('./init');

const login = require('./login');

const signup = require('./signup');
const sendSignUpCode = require('./sendSignUpCode');

const restore = require('./restore');
const sendRestoreCode = require('./sendRestoreCode');

const logout = require('./logout');

module.exports = (fastify) => fastify.service({
  auth: false,
  operations: [
    init,

    login,

    signup,
    sendSignUpCode,

    restore,
    sendRestoreCode,

    logout,
  ],
});
