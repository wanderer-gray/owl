const { emailСonditions: { actions } } = require('../../../enums');

module.exports = {
  querystring: {
    type: 'object',
    properties: {
      action: {
        type: 'integer',
        enum: [
          actions.LOGIN,
          actions.SIGNUP,
          actions.RESTORE,
        ],
      },
    },
    required: ['action'],
    additionalProperties: false,
  },
};
