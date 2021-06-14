const searchContacts = require('./searchContacts');
const createContact = require('./createContact');
const deleteContact = require('./deleteContact');

module.exports = (fastify) => fastify.service({
  operations: [
    searchContacts,
    createContact,
    deleteContact,
  ],
});
