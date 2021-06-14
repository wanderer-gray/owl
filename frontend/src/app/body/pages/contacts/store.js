import { makeAutoObservable } from 'mobx';

class ContactsStore {
  contacts = [];
  count = 0;
  datetime = 0;

  link = '';

  get email() {
    return this.SearchStore.value;
  }

  constructor({ SearchStore }) {
    makeAutoObservable(this);

    this.SearchStore = SearchStore;

    this.searchContacts();
  }
  
  setResult = ({ contacts, count }, datetime) => {
    if (this.datetime > datetime) {
      return;
    }

    this.contacts = contacts;
    this.count = count;
    this.datetime = datetime;
  }

  setLink = (link) => {
    this.link = link;
  }

  searchContacts = async(email = '', datetime = Date.now()) => {
    try {
      const result = await api('contacts/searchContacts')
        .method('post')
        .query({ email });
      
      this.setResult(result, datetime);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось выполнить поиск контактов'
      });
    }
  }

  updateContacts = () => {
    this.searchContacts(this.email);
  }

  createContact = async() => {
    const { link } = this;

    try {
      await api('contacts/createContact')
        .method('post')
        .body({ link });
      
      this.updateContacts();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось добавить контакт'
      });
    }
  }

  deleteContact = async(id) => {
    try {
      await api('contacts/deleteContact')
        .method('delete')
        .query({ id });
      
      this.updateContacts();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось удалить контакт'
      });
    }
  }
}

export default ContactsStore;
