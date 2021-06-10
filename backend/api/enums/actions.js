/* eslint-disable no-bitwise */

const CREATE = 1 << 0;
const UPDATE = 1 << 1;
const DELETE = 1 << 2;
const SELECT = 1 << 3;

module.exports = {
  CREATE,
  UPDATE,
  DELETE,
  SELECT,
};
