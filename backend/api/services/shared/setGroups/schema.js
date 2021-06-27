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
      groups: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            begin: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            end: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            limit: {
              type: 'integer',
              minimum: 0,
              maximum: 10,
            },
          },
          required: [
            'id',
            'limit',
          ],
          additionalProperties: false,
        },
        maxItems: 256,
      },
    },
    required: ['groups'],
    additionalProperties: false,
  },
};
