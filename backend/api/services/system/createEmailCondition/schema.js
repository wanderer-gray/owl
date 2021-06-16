module.exports = {
  body: {
    type: 'object',
    properties: {
      condition: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      type: {
        type: 'string',
        enum: [
          'white',
          'black',
        ],
      },
    },
    required: [
      'condition',
      'type',
    ],
    additionalProperties: false,
  },
};
