/* Тип поиска */

const ALL = 1;
const MY = 2;
const ASSIGNED = 3;
const COMPLETED = 4;

const getTitle = (value) => {
  switch (value) {
    case ALL:
      return 'Все';

    case MY:
      return 'Мои';

    case ASSIGNED:
      return 'Назначенные';

    case COMPLETED:
      return 'Пройденные';

    default:
      return null;
  }
};

export {
  ALL,
  MY,
  ASSIGNED,
  COMPLETED,

  getTitle,
};
