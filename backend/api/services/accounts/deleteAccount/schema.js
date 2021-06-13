module.exports = {
  body: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
    },
    required: [
      'password',
    ],
    additionalProperties: false,
  },
};
