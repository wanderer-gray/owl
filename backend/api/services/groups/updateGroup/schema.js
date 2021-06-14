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
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      contactIds: {
        type: 'array',
        items: {
          type: 'integer',
        },
        maxItems: 256,
        uniqueItems: true,
      },
    },
    additionalProperties: false,
  },
};
