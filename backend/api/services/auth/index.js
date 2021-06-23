const isAuth = require('./isAuth');
const getPermissions = require('./getPermissions');
const getGlobalPermissions = require('./getGlobalPermissions');
const login = require('./login');
const logout = require('./logout');
const signup = require('./signup');
const sendSignUpCode = require('./sendSignUpCode');
const restore = require('./restore');
const sendRestoreCode = require('./sendRestoreCode');

module.exports = (fastify) => fastify.service({
  auth: false,
  operations: [
    isAuth,
    getPermissions,
    getGlobalPermissions,
    login,
    logout,
    signup,
    sendSignUpCode,
    restore,
    sendRestoreCode,
  ],
});
