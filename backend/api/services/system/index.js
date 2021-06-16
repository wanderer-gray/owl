const getEmailAccounts = require('./getEmailAccounts');
const createEmailAccount = require('./createEmailAccount');
const updateEmailAccount = require('./updateEmailAccount');
const getEmailConditions = require('./getEmailConditions');
const deleteEmailAccount = require('./deleteEmailAccount');
const createEmailCondition = require('./createEmailCondition');
const updateEmailCondition = require('./updateEmailCondition');
const deleteEmailCondition = require('./deleteEmailCondition');

module.exports = (fastify) => fastify.service({
  operations: [
    getEmailAccounts,
    createEmailAccount,
    updateEmailAccount,
    deleteEmailAccount,
    getEmailConditions,
    createEmailCondition,
    updateEmailCondition,
    deleteEmailCondition,
  ],
});
