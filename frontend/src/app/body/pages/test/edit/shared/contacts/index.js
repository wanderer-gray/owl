import { makeAutoObservable, autorun } from 'mobx';
import { objects, actions } from '../../../../../../../enums/permissions';
import { checkPermissions } from '../../../../../../../utils';

class ContactsStore {
  contacts = [];
  count = 0;
  datetime = 0;

  get noContactIds() {
    return this.SharedStore.contacts.map(({ id }) => id);
  }

  constructor({ SharedStore, AuthStore }) {
    makeAutoObservable(this);
    
    this.SharedStore = SharedStore;
    this.AuthStore = AuthStore;

    this.disposer = autorun(() => {
      this.searchContacts();
    });
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
    if (!checkPermissions(this.AuthStore || {}, objects.CONTACTS, actions.SELECT)) {
      return;
    }

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

  dispose = () => {
    this.disposer();
  }
}

export default ContactsStore;
