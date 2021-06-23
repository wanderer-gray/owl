import UserEditStore from './edit';

const defaultUser = {
  email: '',
  password: '',
  roleIds: [],
};

class UserCreateStore extends UserEditStore {
  disabledFields = {};

  constructor({ UsersStore }) {
    super({ UsersStore });

    this.onOpen = this.onOpen.bind(this);
  }

  onOpen() {
    super.onOpen(defaultUser);
  }

  onSave = async() => {
    const {
      email,
      password,
      roleIds,
    } = this;

    try {
      await api('users/createUser')
        .method('post')
        .body({ 
          email,
          password,
          roleIds,
        });
      
      this.refresh();

      notify({
        variant: 'success',
        message: 'Пользователь добавлен'
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось добавить пользователя'
      });
    }
  }
}

export default UserCreateStore;
