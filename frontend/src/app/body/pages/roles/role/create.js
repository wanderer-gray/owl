import RoleEditStore from './edit';

const defaultGroup = {
  name: '',
  permissionIds: [],
};

class RoleCreateStore extends RoleEditStore {
  constructor({ RolesStore }) {
    super({ RolesStore });

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
      this.onClose();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось добавить роль'
      });
    }
  }
}

export default RoleCreateStore;
