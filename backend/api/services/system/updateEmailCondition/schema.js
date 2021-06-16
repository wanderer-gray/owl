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
    minProperties: 1,
    additionalProperties: false,
  },
};
