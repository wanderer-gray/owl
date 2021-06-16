module.exports = {
  body: {
    type: 'object',
    properties: {
      host: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      port: {
        type: 'integer',
        minimum: 0,
        maximum: 65535,
      },
      secure: {
        type: 'boolean',
      },
      user: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      pass: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
    },
    required: [
      'host',
      'port',
      'secure',
      'user',
      'pass',
    ],
    additionalProperties: false,
  },
};
