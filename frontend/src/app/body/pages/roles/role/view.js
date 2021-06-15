import { makeObservable, observable, computed, action, toJS } from 'mobx';

class RoleViewStore {
  role = {};

  get id() {
    return this.role.id || null;
  }

  get name() {
    return this.role.name || '';
  }

  get permissionIds() {
    return this.role.permissionIds || [];
  }

  constructor({ RolesStore, role = {} }) {
    this.RolesStore = RolesStore;
    this.role = toJS(role);

    makeObservable(this, {
      role: observable,
      id: computed,
      name: computed,
      permissionIds: computed,
      setRole: action,
      setName: action,
      setPermissionIds: action,
    });
  }

  setRole = (role) => {
    this.role = toJS(role);
  }

  setName = (name) => {
    this.role.name = toJS(name);
  }

  setPermissionIds = (permissionIds) => {
    this.role.permissionIds = toJS(permissionIds);
  }
}

export default RoleViewStore;
