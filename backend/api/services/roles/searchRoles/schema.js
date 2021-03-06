module.exports = {
  querystring: {
    type: 'object',
    properties: {
      name: {
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
    required: ['name'],
    additionalProperties: false,
  },
  body: {
    type: 'object',
    properties: {
      noRoleIds: {
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
