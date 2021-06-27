module.exports = {
  querystring: {
    type: 'object',
    properties: {
      testId: {
        type: 'integer',
      },
    },
    required: ['testId'],
    additionalProperties: false,
  },
  body: {
    type: 'object',
    properties: {
      availableAll: {
        type: 'boolean',
      },
    },
    required: ['availableAll'],
    additionalProperties: false,
  },
};
