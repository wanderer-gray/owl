import { makeObservable, observable, computed, action, toJS } from 'mobx';
import ContactsStore from './contacts';
import GroupViewStore from './view';
import { httpErrors } from '../../../../../enums';

class GroupEditStore extends GroupViewStore {
  open = false;

  get contactIds() {
    return this.contacts.map(({ id }) => id);
  }

  constructor({ GroupsStore, AuthStore }) {
    super({ GroupsStore });

    makeObservable(this, {
      open: observable,
      contactIds: computed,
      setOpen: action,
    });

    this.onOpen = this.onOpen.bind(this);

    this.ContactsStore = new ContactsStore({ GroupStore: this, AuthStore });
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
  }

  addContact = (contact) => {    
    const exists = this.contacts.some(({ id }) => id === contact.id);

    if (exists) {
      return;
    }

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
      id,
      title,
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

      notify({
        variant: 'success',
        message: 'Группа изменена'
      });
    } catch (error) {
      const { status } = error || {};

      if (status === httpErrors.NOT_FOUND) {
        this.refresh();

        notify({
          variant: 'warning',
          message: 'Группа не найдена'
        });

        return;
      }

      notify({
        variant: 'error',
        message: 'Не удалось изменить группу'
      });
    }
  }

  refresh = () => {
    this.GroupsStore.refresh();
    this.onClose();
  }

  dispose = () => {
    this.ContactsStore.dispose();
  }
}

export default GroupEditStore;
