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
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
        nullable: true,
      },
      availableAll: {
        type: 'boolean',
      },
      questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
            },
            description: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              nullable: true,
            },
            type: {
              type: 'string',
              enum: [
                'RADIO_BUTS',
                'CHECK_BOXS',
              ],
            },
            points: {
              type: 'integer',
              minimum: 0,
              maximum: 100,
            },
            required: {
              type: 'boolean',
            },
            options: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                  },
                  checked: {
                    type: 'boolean',
                  },
                  title: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 255,
                  },
                },
                required: [
                  'id',
                ],
                minProperties: 2,
                additionalProperties: false,
              },
              minItems: 1,
              maxItems: 10,
            },
          },
          required: [
            'id',
          ],
          minProperties: 2,
          additionalProperties: false,
        },
        minItems: 1,
        maxItems: 100,
      },
    },
    minProperties: 1,
    additionalProperties: false,
  },
};
