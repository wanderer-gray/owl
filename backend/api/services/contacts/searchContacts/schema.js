module.exports = {
  querystring: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        maxLength: 255,
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 100,
      },
    },
    required: ['email'],
    additionalProperties: false,
  },
  body: {
    type: 'object',
    properties: {
      noContactIds: {
        type: 'array',
        items: {
          type: 'integer',
        },
        maxItems: 256,
        default: [],
      },
    },
    additionalProperties: false,
  },
};
