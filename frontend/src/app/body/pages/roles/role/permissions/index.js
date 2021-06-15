import { makeAutoObservable } from 'mobx';

class ContactsStore {
  _permissions = [];

  get permissions() {
    return this._permissions.filter((id) => !this.noPermissionIds.includes(id));
  }

  get noPermissionIds() {
    return this.RoleStore.permissionIds;
  }

  constructor({ RoleStore }) {
    makeAutoObservable(this);
    
    this.RoleStore = RoleStore;

    this.getPermissions();
  }

  setPermissions = (permissions) => {
    this._permissions = permissions;
  }

  getPermissions = async() => {
    try {
      const permissions = await api('permissions/getPermissions');
      
      this.setPermissions(permissions);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить список разрешений'
      });
    }
  }
}

export default ContactsStore;
