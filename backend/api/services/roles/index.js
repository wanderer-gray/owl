const searchRoles = require('./searchRoles');
const createRole = require('./createRole');
const updateRole = require('./updateRole');
const deleteRole = require('./deleteRole');

module.exports = (fastify) => fastify.service({
  operations: [
    searchRoles,
    createRole,
    updateRole,
    deleteRole,
  ],
});
