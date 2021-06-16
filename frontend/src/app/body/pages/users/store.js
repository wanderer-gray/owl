import { makeAutoObservable } from 'mobx';

class UsersStore {
  users = [];
  count = 0;
  datetime = 0;

  get email() {
    return this.SearchStore.value;
  }

  constructor({ SearchStore }) {
    makeAutoObservable(this);

    this.SearchStore = SearchStore;
  }

  setResult = ({ users, count }, datetime) => {
    if (this.datetime > datetime) {
      return;
    }

    this.users = users;
    this.count = count;
    this.datetime = datetime;
  }

  searchUsers = async(email = '', datetime = Date.now()) => {
    try {
      const result = await api('users/searchUsers')
        .query({ email });
      
      this.setResult(result, datetime);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось выполнить поиск пользователей'
      });
    }
  }

  refresh = () => {
    this.searchUsers(this.email);
  }

  deleteUser = async(id) => {
    try {
      await api('users/deleteUser')
        .method('delete')
        .query({ id });
      
      this.refresh();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось удалить пользователя'
      });
    }
  }
}

export default UsersStore;
