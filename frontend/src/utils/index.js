import { actions } from '../enums';

const checkPermissions = (permissions, object, action = actions.SELECT) => {
  return permissions.some(
    (permission) => permission.object === object && permission.action === action
  );
};

export {
  checkPermissions,
};
