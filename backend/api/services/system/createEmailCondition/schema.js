const {
  emailСonditions: {
    types,
    actions,
  },
} = require('../../../enums');

module.exports = {
  body: {
    type: 'object',
    properties: {
      type: {
        type: 'integer',
        enum: [
          types.WHITE,
          types.BLACK,
        ],
      },
      action: {
        type: 'integer',
        enum: [
          actions.LOGIN,
          actions.SIGNUP,
          actions.RESTORE,
        ],
      },
      condition: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
    },
    required: [
      'type',
      'action',
      'condition',
    ],
    additionalProperties: false,
  },
};
