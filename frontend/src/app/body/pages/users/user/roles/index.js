import { makeAutoObservable } from 'mobx';

class RolesStore {
  roles = [];
  count = 0;
  datetime = 0;

  get noRoleIds() {
    return this.UserStore.roleIds;
  }

  constructor({ UserStore }) {
    makeAutoObservable(this);

    this.UserStore = UserStore;
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
    const { noRoleIds } = this;

    try {
      const result = await api('roles/searchRoles')
        .method('post')
        .query({ name })
        .body({ noRoleIds });
      
      this.setResult(result, datetime);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось выполнить поиск ролей'
      });
    }
  }
}

export default RolesStore;
