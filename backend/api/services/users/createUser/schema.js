module.exports = {
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        minLength: 1,
        maxLength: 255,
      },
      password: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      roleIds: {
        type: 'array',
        items: {
          type: 'integer',
        },
        uniqueItems: true,
      },
    },
    required: [
      'email',
      'password',
      'roleIds',
    ],
    additionalProperties: false,
  },
};
