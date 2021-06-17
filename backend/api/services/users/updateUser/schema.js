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
      roleIds: {
        type: 'array',
        items: {
          type: 'integer',
        },
        uniqueItems: true,
      },
    },
    required: [
      'roleIds',
    ],
    additionalProperties: false,
  },
};
