import { actions } from '../enums/permissions';

const fmtDateTime = (value) => {
  const hh = value.getHours().toString().padStart(2, '0');
  const mm = value.getMinutes().toString().padStart(2, '0');
  const dd = value.getDate().toString().padStart(2, '0');
  const MM = (value.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = value.getFullYear().toString();

  return `${hh}:${mm} ${dd}.${MM}.${yyyy}`;
};

const checkPermissions = ({ isAuth, permissions, globalPermissions }, object, action = actions.SELECT) => {
  if (!isAuth) {
    return false;
  }

  const check = (array) => {
    return array.some(
      (permission) => permission.object === object && permission.action === action
    );
  };

  return check(permissions) || check(globalPermissions);
};

const getCheckPermissions = (AuthStore) => {
  return (object, action) => checkPermissions(AuthStore, object, action);
}

export {
  fmtDateTime,
  checkPermissions,
  getCheckPermissions,
};
