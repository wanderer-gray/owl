const SYSTEM = 0;
const PERMISSIONS = 1;
const ROLES = 2;
const USERS = 3;
const GROUPS = 4;
const TESTS = 5;

const getTitle = (object) => {
  switch (object) {
    case SYSTEM:
      return 'SYSTEM';
    
    case PERMISSIONS:
      return 'PERMISSIONS';
    
    case ROLES:
      return 'ROLES';
    
    case USERS:
      return 'USERS';
    
    case GROUPS:
      return 'GROUPS';
    
    case TESTS:
      return 'TESTS';

    default:
      return null;
  }
};

export {
  SYSTEM,
  PERMISSIONS,
  ROLES,
  USERS,
  GROUPS,
  TESTS,
  getTitle,
};
