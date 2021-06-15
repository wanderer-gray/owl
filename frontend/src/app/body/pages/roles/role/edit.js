import { makeObservable, observable, action, toJS } from 'mobx';
import PermissionsStore from './permissions';
import RoleViewStore from './view';

class RoleEditStore extends RoleViewStore {
  open = false;

  constructor({ RolesStore }) {
    super({ RolesStore });

    makeObservable(this, {
      open: observable,
      setOpen: action,
    });

    this.onOpen = this.onOpen.bind(this);

    this.PermissionsStore = new PermissionsStore({ RoleStore: this });
  }

  setOpen = (open) => {
    this.open = open;
  }

  onOpen(role) {
    this.setOpen(true);
    this.setRole(role);
  }

  onClose = () => {
    this.setOpen(false);
    this.setRole({});
  }

  addPermission = ({ id }) => {
    const permissionIds = toJS(this.permissionIds);

    permissionIds.push(id);

    this.setPermissionIds(permissionIds);
  }

  removePermission = (permissionId) => {
    let permissionIds = toJS(this.permissionIds);

    permissionIds = permissionIds.filter(
      (id) => id !== permissionId
    );

    this.setPermissionIds(permissionIds);
  }

  onSave = async() => {
    const {
      role: {
        id,
        name,
      },
      permissionIds,
    } = this;

    try {
      await api('roles/updateRole')
        .method('put')
        .query({ id })
        .body({ 
          name,
          permissionIds,
        });
      
      this.refresh();
      this.onClose();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось изменить роль'
      });
    }
  }

  refresh = () => {
    this.RolesStore.refresh();
  }
}

export default RoleEditStore;