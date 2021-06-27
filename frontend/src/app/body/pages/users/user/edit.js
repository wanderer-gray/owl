import { makeObservable, observable, computed, action, toJS } from 'mobx';
import RolesStore from './roles';
import UserViewStore from './view';

class UserEditStore extends UserViewStore {
  open = false;

  disabledFields = {
    email: true,
  };

  get roleIds() {
    return this.roles.map(({ id }) => id);
  }
  
  constructor({ UsersStore, AuthStore }) {
    super({ UsersStore });
    
    makeObservable(this, {
      open: observable,
      roleIds: computed,
      setOpen: action,
    });

    this.onOpen = this.onOpen.bind(this);

    this.RolesStore = new RolesStore({ UserStore: this, AuthStore });
  }

  setOpen = (open) => {
    this.open = open;
  }

  onOpen(user) {
    this.setOpen(true);
    this.setUser(user);
  }

  onClose = () => {
    this.setOpen(false);
  }

  addRole = (role) => {
    const exists = this.roles.some(({ id }) => id === role.id);

    if (exists) {
      return;
    }

    const roles = toJS(this.roles);

    roles.push(role);

    this.setRoles(roles);
  }

  removeRole = (roleId) => {
    let roles = toJS(this.roles);

    roles = roles.filter(
      ({ id }) => id !== roleId
    );

    this.setRoles(roles);
  }

  onSave = async() => {
    const {
      id,
      roleIds
    } = this;

    try {
      await api('users/updateUser')
        .method('put')
        .query({ id })
        .body({ roleIds });
      
      this.refresh();

      notify({
        variant: 'success',
        message: 'Пользователь изменён'
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось изменить пользователя'
      });
    }
  }

  refresh = () => {
    this.UsersStore.refresh();
    this.onClose();
  }

  dispose = () => {
    this.RolesStore.dispose();
  }
}

export default UserEditStore;
