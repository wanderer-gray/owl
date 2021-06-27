module.exports = {
  querystring: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        maxLength: 255,
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 10,
      },
    },
    required: ['title'],
    additionalProperties: false,
  },
  body: {
    type: 'object',
    properties: {
      noGroupIds: {
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
