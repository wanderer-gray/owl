const {
  objects: { SYSTEM },
  actions: { UPDATE },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

const checkIsArrayAndNotEmpty = (value) => Array.isArray(value) && !!value.length;

const createAccounts = async (addAccounts, { knex }) => {
  if (!checkIsArrayAndNotEmpty(addAccounts)) {
    return;
  }

  await knex('emailAccounts')
    .insert(addAccounts);
};

const updateAccounts = async (updAccounts, { knex }) => {
  if (!checkIsArrayAndNotEmpty(updAccounts)) {
    return;
  }

  const promises = updAccounts.map(({ id, ...data }) => knex('emailAccounts')
    .where({ id })
    .update(data));

  await Promise.all(promises);
};

const deleteAccounts = async (delAccounts, { knex }) => {
  if (!checkIsArrayAndNotEmpty(delAccounts)) {
    return;
  }

  await knex('emailAccounts')
    .whereIn('id', delAccounts)
    .del();
};

const createСonditions = async (addConditions, { knex }) => {
  if (!checkIsArrayAndNotEmpty(addConditions)) {
    return;
  }

  await knex('emailСonditions')
    .insert(addConditions);
};

const updateСonditions = async (updConditions, { knex }) => {
  if (!checkIsArrayAndNotEmpty(updConditions)) {
    return;
  }

  const promises = updConditions.map(({ id, ...data }) => knex('emailСonditions')
    .where({ id })
    .update(data));

  await Promise.all(promises);
};

const deleteСonditions = async (delConditions, { knex }) => {
  if (!checkIsArrayAndNotEmpty(delConditions)) {
    return;
  }

  await knex('emailСonditions')
    .whereIn('id', delConditions)
    .del();
};

module.exports = async function operation({ userId, body }, {
  log, knex, mailer, httpErrors,
}) {
  log.trace('setConfig');
  log.debug(userId);
  log.debug(body);

  const {
    addAccounts,
    updAccounts,
    delAccounts,
    addConditions,
    updConditions,
    delConditions,
  } = body;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, UPDATE)) {
    log.warn('no permission to update a system config');

    throw httpErrors.forbidden();
  }

  await Promise.all([
    createAccounts(addAccounts, { knex }),
    updateAccounts(updAccounts, { knex }),
    deleteAccounts(delAccounts, { knex }),
    createСonditions(addConditions, { knex }),
    updateСonditions(updConditions, { knex }),
    deleteСonditions(delConditions, { knex }),
  ]);

  await mailer.updateAccounts({ log, knex });
};
