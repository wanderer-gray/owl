module.exports = {
  querystring: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
    },
    required: ['name'],
    additionalProperties: false,
  },
  response: {
    200: {
      type: 'array',
      maxItems: 10,
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
      },
    },
  },
};
