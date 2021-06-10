module.exports = {
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
        minItems: 1,
        uniqueItems: true,
      },
    },
    required: [
      'name',
      'permissionIds',
    ],
    additionalProperties: false,
  },
};
