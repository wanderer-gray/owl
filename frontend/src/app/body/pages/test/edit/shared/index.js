import { makeAutoObservable, toJS } from 'mobx';
import ContactsStore from './contacts';
import GroupsStore from './groups';

class SharedStore {
  open = false;
  shared = {};

  get testId() {
    return this.TestStore.id;
  }

  get availableAll() {
    return this.shared.availableAll || false;
  }

  get contacts() {
    return this.shared.contacts || [];
  }

  get groups() {
    return this.shared.groups || [];
  }

  constructor({ TestStore }) {
    makeAutoObservable(this);

    this.TestStore = TestStore;

    this.ContactsStore = new ContactsStore({ SharedStore: this });
    this.GroupsStore = new GroupsStore({ SharedStore: this });
  }

  setOpen = (open) => {
    this.open = open;
  }

  setShared = (shared) => {
    this.shared = shared;
  }

  setAvailableAll = (availableAll) => {
    this.shared.availableAll = toJS(availableAll);
  }

  setContacts = (contacts) => {
    this.shared.contacts = toJS(contacts);
  }

  deleteContact = (index) => {
    const contacts = this.contacts;

    contacts.splice(index, 1);

    this.setContacts(contacts);
  }

  setGroups = (groups) => {
    this.shared.groups = toJS(groups);
  }

  deleteGroup = (index) => {
    const groups = this.groups;

    groups.splice(index, 1);

    this.setGroups(groups);
  }

  getShared = async() => {
    const { testId } = this;

    try {
      const shared = await api('shared/getShared')
        .query({ testId });
      
      this.setShared(shared);
    } catch {
      notify({
        variant: 'error',
        message: `Не удалось получить данные "Поделиться"`
      });
    }
  }

  onOpen = () => {
    this.setOpen(true);
    this.getShared();
  }

  onClose = () => {
    this.setOpen(false);
  }

  onSave = async() => {
    const {
      testId,
      availableAll,
      contacts,
      groups,
    } = this;

    try {
      await Promise.all([
        api('shared/setAvailableAll')
          .method('put')
          .query({ testId })
          .body({ availableAll }),
        api('shared/setContacts')
          .method('put')
          .query({ testId })
          .body({ contacts }),
        api('shared/setGroups')
          .method('put')
          .query({ testId })
          .body({ groups }),
      ]);

      notify({
        variant: 'success',
        message: 'Данных сохранены'
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось сохранить данные'
      });
    }
  }

  dispose = () => {
    this.ContactsStore.dispose();
    this.GroupsStore.dispose();
  }
}

export default SharedStore;
