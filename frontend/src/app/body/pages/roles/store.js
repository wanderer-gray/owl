import { makeAutoObservable } from 'mobx';

class RolesStore {
  roles = [];
  count = 0;
  datetime = 0;

  get name() {
    return this.SearchStore.value;
  }

  constructor({ SearchStore }) {
    makeAutoObservable(this);

    this.SearchStore = SearchStore;

    this.searchRoles();
  }
  
  setResult = ({ roles, count }, datetime) => {
    if (this.datetime > datetime) {
      return;
    }

    this.roles = roles;
    this.count = count;
    this.datetime = datetime;
  }

  searchRoles = async(name = '', datetime = Date.now()) => {
    try {
      const result = await api('roles/searchRoles')
        .query({ name });
      
      this.setResult(result, datetime);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось выполнить поиск ролей'
      });
    }
  }

  refresh = () => {
    this.searchRoles(this.name);
  }

  deleteRole = async(id) => {
    try {
      await api('roles/deleteRole')
        .method('delete')
        .query({ id });
      
      this.refresh();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось удалить роль'
      });
    }
  }
}

export default RolesStore;
