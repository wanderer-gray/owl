const getShared = require('./getShared');
const setAvailableAll = require('./setAvailableAll');
const setContacts = require('./setContacts');
const setGroups = require('./setGroups');

module.exports = (fastify) => fastify.service({
  operations: [
    getShared,
    setAvailableAll,
    setContacts,
    setGroups,
  ],
});
