const searchUsers = require('./searchUsers');
const createUser = require('./createUser');
const updateUser = require('./updateUser');
const deleteUser = require('./deleteUser');

module.exports = (fastify) => fastify.service({
  operations: [
    searchUsers,
    createUser,
    updateUser,
    deleteUser,
  ],
});
