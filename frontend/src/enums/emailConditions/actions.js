/* Действие для условия */

const LOGIN = 1;
const SIGNUP = 2;
const RESTORE = 3;

const getTitle = (value) => {
  switch (value) {
    case LOGIN:
      return 'LOGIN';

    case SIGNUP:
      return 'SIGNUP';

    case RESTORE:
      return 'RESTORE';

    default:
      return null;
  }
};

export {
  LOGIN,
  SIGNUP,
  RESTORE,

  getTitle,
};
