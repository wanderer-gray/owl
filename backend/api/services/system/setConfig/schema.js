module.exports = {
  body: {
    type: 'object',
    properties: {
      addAccounts: {
        type: 'array',
        items: {
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
      },
      updAccounts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
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
            'id',
          ],
          minProperties: 2,
          additionalProperties: false,
        },
      },
      delAccounts: {
        type: 'array',
        items: {
          type: 'integer',
        },
        uniqueItems: true,
      },
      addConditions: {
        type: 'array',
        items: {
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
      },
      updConditions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
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
            'id',
          ],
          minProperties: 2,
          additionalProperties: false,
        },
      },
      delConditions: {
        type: 'array',
        items: {
          type: 'integer',
        },
        uniqueItems: true,
      },
    },
    additionalProperties: false,
  },
};
