import { makeAutoObservable, autorun } from 'mobx';

class MembersStore {
  members = [];
  count = 0;
  datetime = 0;

  get noMembers() {
    return this.LinkStore.members;
  }

  constructor({ LinkStore }) {
    makeAutoObservable(this);

    this.LinkStore = LinkStore;

    this.disposer = autorun(() => {
      this.searchMembers();
    });
  }

  setResult = ({ members, count }, datetime) => {
    if (this.datetime > datetime) {
      return;
    }

    this.members = members;
    this.count = count;
    this.datetime = datetime;
  }

  searchMembers = async(text = '', datetime = Date.now()) => {
    const { noMembers } = this;

    try {
      const result = await api('tests/searchMembers')
        .method('post')
        .query({ text })
        .body({ noMembers });
      
      this.setResult(result, datetime);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось выполнить поиск участников'
      });
    }
  }

  dispose = () => {
    this.disposer();
  }
}

export default MembersStore;
