module.exports = {
  body: {
    type: 'object',
    properties: {
      link: {
        type: 'string',
        format: 'uuid',
      },
    },
    required: [
      'link',
    ],
    additionalProperties: false,
  },
};
