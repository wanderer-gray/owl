const {
  system: {
    EMAIL_СONDITION_WHITE,
    EMAIL_СONDITION_BLACK,
  },
} = require('../../../enums');

const checkEmail = async (email, knex) => {
  const queryWhiteList = knex('emailСonditions')
    .where('type', EMAIL_СONDITION_WHITE)
    .whereRaw('? like condition', [email]);
  const queryBlackList = knex('emailСonditions')
    .where('type', EMAIL_СONDITION_BLACK)
    .whereRaw('? like condition', [email]);

  const { white, black } = await knex.first(
    knex.raw('exists ? as white', queryWhiteList),
    knex.raw('exists ? as black', queryBlackList),
  );

  return white || !black;
};

module.exports = {
  checkEmail,
};
