module.exports = {
  querystring: {
    type: 'object',
    properties: {
      type: {
        type: 'integer',
        enum: [
          1, // Все
          2, // Мои
          3, // Доступные
          4, // Результаты
        ],
      },
      title: {
        type: 'string',
        maxLength: 255,
      },
      offset: {
        type: 'integer',
        minimum: 0,
        default: 0,
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 10,
      },
    },
    required: [
      'type',
      'title',
    ],
    additionalProperties: false,
  },
};
