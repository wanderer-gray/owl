const searchGroups = require('./searchGroups');
const createGroup = require('./createGroup');
const updateGroup = require('./updateGroup');
const deleteGroup = require('./deleteGroup');

module.exports = (fastify) => fastify.service({
  operations: [
    searchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  ],
});
