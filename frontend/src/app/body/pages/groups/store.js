import { makeAutoObservable, toJS } from 'mobx';

const defaultGroup = {
  title: '',
  contacts: [],
};

class GroupsStore {
  groups = [];
  count = 0;
  datetime = 0;

  open = false;
  group = defaultGroup;
  contacts = [];
  contactsDatetime = 0;

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

  setOpen = (open) => {
    this.open = open;
  }

  setGroup = (group) => {
    this.group = group;
  }

  setGroupTitle = (title) => {
    this.group.title = title;
  }

  addGroupContact = (contact) => {
    this.group.contacts.push(toJS(contact));
  };

  delGroupContact = (contactId) => {
    this.group.contacts = toJS(this.group.contacts).filter(({id}) => id !== contactId);
  }

  setContacts = (contacts) => {
    this.contacts = contacts;
  }

  onOpen = (groupId) => {
    this.setOpen(true);

    const group = this.groups.find(({id}) => id === groupId);

    if (group) {
      this.setGroup(toJS(group));
    }
  }

  onClose = () => {
    this.setOpen(false);
    this.setGroup(defaultGroup);
  }

  onOpenContacts = () => {
    this.searchContacts('');
  }

  searchContacts = async(email = '', datetime = Date.now()) => {
    const noContactIds = this.group.contacts.map(({ id }) => id);

    try {
      const { contacts } = await api('contacts/searchContacts')
        .method('post')
        .query({ email })
        .body({ noContactIds });
      
      if (this.contactsDatetime > datetime) {
        return;
      }
      
      this.contactsDatetime = datetime;
      this.setContacts(contacts);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось выполнить поиск контактов'
      });
    }
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

  updateGroups = () => {
    this.searchGroups(this.title);
    this.onClose();
  }

  createGroup = async() => {
    const {
      title,
      contacts,
    } = this.group;

    const contactIds = contacts.map(({ id }) => id);

    try {
      await api('groups/createGroup')
        .method('post')
        .body({ 
          title,
          contactIds,
        });
      
      this.updateGroups();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось добавить группу'
      });
    }
  }

  updateGroup = async() => {
    const {
      id,
      title,
      contacts,
    } = this.group;

    const contactIds = contacts.map(({ id }) => id);

    try {
      await api('groups/updateGroup')
        .method('put')
        .query({ id })
        .body({ 
          title,
          contactIds,
        });
      
      this.updateGroups();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось изменить группу'
      });
    }
  }

  deleteGroup = async(id) => {
    try {
      await api('contacts/deleteGroup')
        .method('delete')
        .query({ id });
      
      this.updateGroups();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось удалить группу'
      });
    }
  }

  onSave = () => {
    const { id } =  this.group;

    if (!id) {
      this.createGroup();
    } else {
      this.updateGroup();
    }
  }
}

export default GroupsStore;
