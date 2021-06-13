module.exports = {
  body: {
    type: 'object',
    properties: {
      link: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
    },
    required: [
      'link',
    ],
    additionalProperties: false,
  },
};
