import { makeObservable, observable, action, toJS } from 'mobx';
import ContactViewStore from './view';

class ContactEditStore extends ContactViewStore {
  open = false;

  contacts = [];

  constructor({ SharedStore }) {
    super({ SharedStore });

    makeObservable(this, {
      open: observable,
      setOpen: action,
    });

    this.onOpen = this.onOpen.bind(this);
  }

  setOpen = (open) => {
    this.open = open;
  }

  onOpen(contact) {
    this.setOpen(true);
    this.setContact(contact);

    this.contacts = this.SharedStore.contacts.filter((c) => c !== contact);
  }

  onClose = () => {
    this.setOpen(false);
  }

  onSave = () => {
    const {
      id,
      email,
      begin,
      end,
      limit,
    } = this;

    if (!id) {
      return;
    }

    const contacts = toJS(this.contacts);

    contacts.push({
      id,
      email,
      begin,
      end,
      limit,
    })

    this.SharedStore.setContacts(contacts);

    this.onClose();
  }
}

export default ContactEditStore;
