module.exports = {
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
    required: [
      'title',
      'contactIds',
    ],
    additionalProperties: false,
  },
};
