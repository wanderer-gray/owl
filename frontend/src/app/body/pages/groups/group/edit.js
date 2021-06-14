import { makeObservable, observable, computed, action, toJS } from 'mobx';
import ContactsStore from './contacts';
import GroupViewStore from './view';

class GroupEditStore extends GroupViewStore {
  open = false;

  get contactIds() {
    return this.contacts.map(({ id }) => id);
  }

  constructor({ GroupsStore }) {
    super({ GroupsStore });

    makeObservable(this, {
      open: observable,
      contactIds: computed,
      setOpen: action,
    });

    this.onOpen = this.onOpen.bind(this);

    this.ContactsStore = new ContactsStore({ GroupStore: this });
  }

  setOpen = (open) => {
    this.open = open;
  }

  onOpen(group) {
    this.setOpen(true);
    this.setGroup(group);
  }

  onClose = () => {
    this.setOpen(false);
    this.setGroup({});
  }

  addContact = (contact) => {
    const contacts = toJS(this.contacts);

    contacts.push(contact);

    this.setContacts(contacts)
  }

  removeContact = (contactId) => {
    let contacts = toJS(this.contacts);

    contacts = contacts.filter(
      ({ id }) => id !== contactId
    );

    this.setContacts(contacts);
  }

  onSave = async() => {
    const {
      group: {
        id,
        title,
      },
      contactIds,
    } = this;

    try {
      await api('groups/updateGroup')
        .method('put')
        .query({ id })
        .body({ 
          title,
          contactIds,
        });
      
      this.refresh();
      this.onClose();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось изменить группу'
      });
    }
  }

  refresh = () => {
    this.GroupsStore.refresh();
  }
}

export default GroupEditStore;
