const CREATE = 1;
const UPDATE = 2;
const DELETE = 3;
const SELECT = 4;

const getTitle = (action) => {
  switch (action) {
    case CREATE:
      return 'CREATE';

    case UPDATE:
      return 'UPDATE';

    case DELETE:
      return 'DELETE';

    case SELECT:
      return 'SELECT';

    default:
      return null;
  }
};

export {
  CREATE,
  UPDATE,
  DELETE,
  SELECT,
  getTitle,
};
