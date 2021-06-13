const getProfile = require('./getProfile');
const updateLink = require('./updateLink');
const updatePassword = require('./updatePassword');
const deleteAccount = require('./deleteAccount');

module.exports = async (fastify) => fastify.service({
  operations: [
    getProfile,
    updateLink,
    updatePassword,
    deleteAccount,
  ],
});
