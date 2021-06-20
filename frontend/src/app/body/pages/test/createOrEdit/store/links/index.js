import { makeAutoObservable } from 'mobx';

class LinksStore {
  open = false;
  links = [];
  datetime = 0;

  get testId() {
    return this.TestStore.id || null;
  }

  constructor({ TestStore }) {
    makeAutoObservable(this);

    this.TestStore = TestStore;
  }

  setOpen = (open) => {
    this.open = open;
  }

  setLinks = (links, datetime) => {
    if (this.datetime > datetime) {
      return;
    }
    
    this.links = links;
    this.datetime = datetime;
  }

  onOpen = () => {
    this.setOpen(true);
    this.getLinks();
  }

  onClose = () => {
    this.setOpen(false);
  }

  getLinks = async(datetime = Date.now()) => {
    const { testId } = this;

    if (!testId) {
      return;
    }

    try {
      const links = await api('tests/getLinks')
        .query({ testId });
      
      this.setLinks(links, datetime);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось выполнить поиск групп'
      });
    }
  }

  createLink = async() => {
    try {
      await api('tests/createLink')
        .method('post');
      
      this.refresh();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось добавить ссылку'
      });
    }
  }

  deleteLink = async(id) => {
    try {
      await api('tests/deleteLink')
        .method('delete')
        .query({ id });
      
      this.refresh();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось удалить ссылку'
      });
    }
  }

  refresh = () => {
    this.getLinks();
  }
}

export default LinksStore;
