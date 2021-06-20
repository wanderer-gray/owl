module.exports = {
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
                  'checked',
                  'title',
                ],
                additionalProperties: false,
              },
              minItems: 1,
              maxItems: 10,
            },
          },
          required: [
            'title',
            'points',
            'type',
            'required',
            'options',
          ],
          additionalProperties: false,
        },
        minItems: 1,
        maxItems: 100,
      },
    },
    required: [
      'title',
      'availableAll',
      'questions',
    ],
    additionalProperties: false,
  },
};
