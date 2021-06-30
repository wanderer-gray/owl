module.exports = {
  querystring: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
      offset: {
        type: 'integer',
        minimum: 0,
        default: 0,
      },
    },
    required: ['id'],
    additionalProperties: false,
  },
};
