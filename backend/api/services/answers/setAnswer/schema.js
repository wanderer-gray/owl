module.exports = {
  querystring: {
    type: 'object',
    properties: {
      testId: {
        type: 'integer',
      },
      userId: {
        type: 'integer',
      },
      begin: {
        type: 'string',
        format: 'date-time',
      },
      end: {
        type: 'string',
        format: 'date-time',
      },
      sign: {
        type: 'string',
        minLength: 64,
        maxLength: 64,
      },
    },
    required: [
      'testId',
      'userId',
      'begin',
      'end',
      'sign',
    ],
    additionalProperties: false,
  },
  body: {
    type: 'object',
    properties: {
      optionId: {
        type: 'integer',
      },
      value: {
        type: 'boolean',
      },
    },
    required: [
      'optionId',
      'value',
    ],
    additionalProperties: false,
  },
};
