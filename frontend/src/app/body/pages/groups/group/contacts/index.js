import { makeAutoObservable } from 'mobx';

class ContactsStore {
  contacts = [];
  count = 0;
  datetime = 0;

  get noContactIds() {
    return this.GroupStore.contactIds;
  }

  constructor({ GroupStore }) {
    makeAutoObservable(this);
    
    this.GroupStore = GroupStore;
  }

  setResult = ({ contacts, count }, datetime) => {
    if (this.datetime > datetime) {
      return;
    }

    this.contacts = contacts;
    this.count = count;
    this.datetime = datetime;
  }

  searchContacts = async(email = '', datetime = Date.now()) => {
    const { noContactIds } = this;

    try {
      const result = await api('contacts/searchContacts')
        .method('post')
        .query({ email })
        .body({ noContactIds });
      
      this.setResult(result, datetime);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось выполнить поиск контактов'
      });
    }
  }
}

export default ContactsStore;
