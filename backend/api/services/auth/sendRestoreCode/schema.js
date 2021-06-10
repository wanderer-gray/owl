module.exports = {
  querystring: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        minLength: 1,
        maxLength: 255,
      },
    },
    required: ['email'],
    additionalProperties: false,
  },
};
