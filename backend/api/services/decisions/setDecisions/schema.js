module.exports = {
  querystring: {
    type: 'object',
    properties: {
      testId: {
        type: 'integer',
      },
    },
    required: ['testId'],
    additionalProperties: false,
  },
  body: {
    type: 'object',
    properties: {
      decisions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
            },
            description: {
              type: 'string',
              maxLength: 255,
              nullable: true,
            },
            from: {
              type: 'integer',
              minimum: 0,
            },
            to: {
              type: 'integer',
              minimum: 0,
            },
          },
          required: [
            'title',
            'from',
            'to',
          ],
          additionalProperties: false,
        },
        maxItems: 10,
      },
    },
    required: ['decisions'],
    additionalProperties: false,
  },
};
