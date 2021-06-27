/* Тип */

const TEST = 1;
const SURVEY = 2;

const getTitle = (value) => {
  switch (value) {
    case TEST:
      return 'Тест';
    
    case SURVEY:
      return 'Опрос';

    default:
      return null;
  }
}

export {
  TEST,
  SURVEY,

  getTitle,
};
