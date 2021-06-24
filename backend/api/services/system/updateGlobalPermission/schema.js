module.exports = {
  querystring: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
    },
    required: ['id'],
    additionalProperties: false,
  },
  body: {
    type: 'object',
    properties: {
      permit: {
        type: 'boolean',
      },
    },
    required: ['permit'],
    additionalProperties: false,
  },
};
