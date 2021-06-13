module.exports = {
  body: {
    type: 'object',
    properties: {
      oldPassword: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      newPassword: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
    },
    required: [
      'oldPassword',
      'newPassword',
    ],
    additionalProperties: false,
  },
};
