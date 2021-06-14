import { makeObservable, observable, computed, action, toJS } from 'mobx';

class GroupViewStore {
  group = {};

  get id() {
    return this.group.id || null;
  }

  get title() {
    return this.group.title || '';
  }

  get contacts() {
    return this.group.contacts || [];
  }

  constructor({ GroupsStore, group = {} }) {
    this.GroupsStore = GroupsStore;
    this.group = toJS(group);

    makeObservable(this, {
      group: observable,
      title: computed,
      contacts: computed,
      setGroup: action,
      setTitle: action,
      setContacts: action,
    });
  }

  setGroup = (group) => {
    this.group = toJS(group);
  }

  setTitle = (title) => {
    this.group.title = toJS(title);
  }

  setContacts = (contacts) => {
    this.group.contacts = toJS(contacts);
  }
}

export default GroupViewStore;
