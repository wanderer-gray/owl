const {
  emailСonditions: {
    types: {
      WHITE,
      BLACK,
    },
  },
} = require('../../../enums');

const checkEmail = async (email, action, { knex }) => {
  const queryWhiteList = knex('emailСonditions')
    .where({
      type: WHITE,
      action,
    })
    .whereRaw('? like condition', [email]);
  const queryBlackList = knex('emailСonditions')
    .where({
      type: BLACK,
      action,
    })
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
