import { makeAutoObservable, autorun } from 'mobx';
import { objects, actions } from '../../../../../../../enums/permissions';
import { checkPermissions } from '../../../../../../../utils';

class GroupsStore {
  groups = [];
  count = 0;
  datetime = 0;

  get noGroupIds() {
    return this.SharedStore.groups.map(({ id }) => id);
  }

  constructor({ SharedStore, AuthStore }) {
    makeAutoObservable(this);
    
    this.SharedStore = SharedStore;
    this.AuthStore = AuthStore;

    this.disposer = autorun(() => {
      this.searchGroups();
    });
  }

  setResult = ({ groups, count }, datetime) => {
    if (this.datetime > datetime) {
      return;
    }

    this.groups = groups;
    this.count = count;
    this.datetime = datetime;
  }

  searchGroups = async(title = '', datetime = Date.now()) => {
    if (!checkPermissions(this.AuthStore || {}, objects.GROUPS, actions.SELECT)) {
      return;
    }

    const { noGroupIds } = this;

    try {
      const result = await api('groups/searchGroups')
        .method('post')
        .query({ title })
        .body({ noGroupIds });
      
      this.setResult(result, datetime);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось выполнить поиск групп'
      });
    }
  }

  dispose = () => {
    this.disposer();
  }
}

export default GroupsStore;
