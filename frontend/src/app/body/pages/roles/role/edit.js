import { makeObservable, observable, action, toJS } from 'mobx';
import PermissionsStore from './permissions';
import RoleViewStore from './view';
import { httpErrors } from '../../../../../enums';

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
  }

  addPermission = ({ id }) => {
    const exists = this.permissionIds.includes(id);

    if (exists) {
      return;
    }

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
      id,
      name,
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

      notify({
        variant: 'success',
        message: 'Роль изменена'
      });
    } catch (error) {
      const { status } = error || {};

      if (status === httpErrors.NOTFOUND) {
        this.refresh();

        notify({
          variant: 'warning',
          message: 'Роль не найдена'
        });

        return;
      }

      notify({
        variant: 'error',
        message: 'Не удалось изменить роль'
      });
    }
  }

  refresh = () => {
    this.RolesStore.refresh();
    this.onClose();
  }
}

export default RoleEditStore;
