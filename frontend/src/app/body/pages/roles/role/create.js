import RoleEditStore from './edit';

const defaultGroup = {
  name: '',
  permissionIds: [],
};

class RoleCreateStore extends RoleEditStore {
  constructor({ RolesStore, AuthStore }) {
    super({ RolesStore, AuthStore });

    this.onOpen = this.onOpen.bind(this);
  }

  onOpen() {
    super.onOpen(defaultGroup);
  }

  onSave = async() => {
    const {
      name,
      permissionIds,
    } = this;

    try {
      await api('roles/createRole')
        .method('post')
        .body({ 
          name,
          permissionIds,
        });
      
      this.refresh();

      notify({
        variant: 'success',
        message: 'Роль добавлена'
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось добавить роль'
      });
    }
  }
}

export default RoleCreateStore;
