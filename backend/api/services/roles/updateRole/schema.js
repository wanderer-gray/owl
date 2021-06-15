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
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      permissionIds: {
        type: 'array',
        items: {
          type: 'integer',
        },
        uniqueItems: true,
      },
    },
    additionalProperties: false,
  },
};
