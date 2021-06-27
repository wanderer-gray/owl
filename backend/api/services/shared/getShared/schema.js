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
};
