/* Объекты */

const SYSTEM = 1;
const PERMISSIONS = 2;
const ROLES = 3;
const USERS = 4;
const CONTACTS = 5;
const GROUPS = 6;
const TESTS = 7;
const ANSWERS = 8;

const getTitle = (value) => {
  switch (value) {
    case SYSTEM:
      return 'SYSTEM';

    case PERMISSIONS:
      return 'PERMISSIONS';

    case ROLES:
      return 'ROLES';

    case USERS:
      return 'USERS';

    case CONTACTS:
      return 'CONTACTS';

    case GROUPS:
      return 'GROUPS';

    case TESTS:
      return 'TESTS';

    case ANSWERS:
      return 'ANSWERS';

    default:
      return null;
  }
};

module.exports = {
  SYSTEM,
  PERMISSIONS,
  ROLES,
  USERS,
  CONTACTS,
  GROUPS,
  TESTS,
  ANSWERS,

  getTitle,
};
