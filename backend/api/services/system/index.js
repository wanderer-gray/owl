const getEmailAccounts = require('./getEmailAccounts');
const createEmailAccount = require('./createEmailAccount');
const updateEmailAccount = require('./updateEmailAccount');
const deleteEmailAccount = require('./deleteEmailAccount');

const getEmailConditions = require('./getEmailConditions');
const createEmailCondition = require('./createEmailCondition');
const updateEmailCondition = require('./updateEmailCondition');
const deleteEmailCondition = require('./deleteEmailCondition');

const getGlobalPermissions = require('./getGlobalPermissions');
const updateGlobalPermission = require('./updateGlobalPermission');

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

    getGlobalPermissions,
    updateGlobalPermission,
  ],
});
