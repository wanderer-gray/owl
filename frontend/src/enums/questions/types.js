/* Тип вопроса */

const RADIO_BUTS = 1;
const CHECK_BOXS = 2;

const getTitle = (value) => {
  switch (value) {
    case RADIO_BUTS:
      return 'Один вариант ответа';

    case CHECK_BOXS:
      return 'Один и более вариантов ответа';

    default:
      return null;
  }
};

export {
  RADIO_BUTS,
  CHECK_BOXS,

  getTitle,
};
