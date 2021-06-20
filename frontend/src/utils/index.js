import { actions } from '../enums';

const fmtDateTime = (value) => {
  const hh = value.getHours().toString().padStart(2, '0');
  const mm = value.getMinutes().toString().padStart(2, '0');
  const dd = value.getDate().toString().padStart(2, '0');
  const MM = (value.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = value.getFullYear().toString();

  return `${hh}:${mm} ${dd}.${MM}.${yyyy}`;
};

const checkPermissions = (permissions, object, action = actions.SELECT) => permissions.some(
  (permission) => permission.object === object && permission.action === action
);

export {
  fmtDateTime,
  checkPermissions,
};
