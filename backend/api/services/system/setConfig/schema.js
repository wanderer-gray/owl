module.exports = {
  body: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        value: {
          type: 'object',
        },
      },
      additionalProperties: false,
    },
  },
};
