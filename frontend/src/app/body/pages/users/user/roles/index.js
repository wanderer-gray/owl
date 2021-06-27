import { makeAutoObservable, autorun } from 'mobx';
import { objects, actions } from '../../../../../../enums/permissions';
import { checkPermissions } from '../../../../../../utils';

class RolesStore {
  roles = [];
  count = 0;
  datetime = 0;

  get noRoleIds() {
    return this.UserStore.roleIds;
  }

  constructor({ UserStore, AuthStore }) {
    makeAutoObservable(this);

    this.UserStore = UserStore;
    this.AuthStore = AuthStore;

    this.disposer = autorun(() => {
      this.searchRoles();
    });
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
    if (!checkPermissions(this.AuthStore, objects.ROLES, actions.SELECT)) {
      return;
    }

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

  dispose = () => {
    this.disposer();
  }
}

export default RolesStore;
