import { makeAutoObservable } from 'mobx';

class GroupsStore {
  groups = [];
  count = 0;
  datetime = 0;

  get title() {
    return this.SearchStore.value;
  }

  constructor({ SearchStore }) {
    makeAutoObservable(this);

    this.SearchStore = SearchStore;

    this.searchGroups();
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
    try {
      const result = await api('groups/searchGroups')
        .query({ title });
      
      this.setResult(result, datetime);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось выполнить поиск групп'
      });
    }
  }

  refresh = () => {
    this.searchGroups(this.title);
  }

  deleteGroup = async(id) => {
    try {
      await api('groups/deleteGroup')
        .method('delete')
        .query({ id });
      
      this.refresh();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось удалить группу'
      });
    }
  }
}

export default GroupsStore;
