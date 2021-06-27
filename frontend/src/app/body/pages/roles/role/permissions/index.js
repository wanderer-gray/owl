import { makeAutoObservable } from 'mobx';
import { objects, actions } from '../../../../../../enums/permissions';
import { checkPermissions } from '../../../../../../utils';

class ContactsStore {
  _permissions = [];

  get permissions() {
    return this._permissions.filter((id) => !this.noPermissionIds.includes(id));
  }

  get noPermissionIds() {
    return this.RoleStore.permissionIds;
  }

  constructor({ RoleStore, AuthStore }) {
    makeAutoObservable(this);
    
    this.RoleStore = RoleStore;
    this.AuthStore = AuthStore;

    this.getPermissions();
  }

  setPermissions = (permissions) => {
    this._permissions = permissions;
  }

  getPermissions = async() => {
    if (!checkPermissions(this.AuthStore, objects.PERMISSIONS, actions.SELECT)) {
      return;
    }

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
