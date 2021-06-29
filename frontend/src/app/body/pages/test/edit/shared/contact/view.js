import { makeObservable, observable, computed, action, toJS } from 'mobx';

class ContactViewStore {
  contact = {};

  get id() {
    return this.contact.id || null;
  }

  get email() {
    return this.contact.email || null;
  }

  get begin() {
    const t = this.contact.begin;

    return t ? new Date(t) : null;
  }

  get end() {
    const t = this.contact.end;

    return t ? new Date(t) : null;
  }

  get limit() {
    return this.contact.limit || 0;
  }

  constructor({ SharedStore }) {
    makeObservable(this, {
      contact: observable,
      email: computed,
      begin: computed,
      end: computed,
      limit: computed,
      setContact: action,
      setBegin: action,
      setEnd: action,
      setLimit: action,
      onContact: action,
    });

    this.SharedStore = SharedStore;
  }

  setContact = (contact) => {
    this.contact = toJS(contact);
  }

  setBegin = (begin) => {
    this.contact.begin = toJS(begin);
  }

  setEnd = (end) => {
    this.contact.end = toJS(end);
  }

  setLimit = (limit) => {
    let value = Number(limit);

    if (value) {
      if (!Number.isInteger(value)) {
        return;
      }

      if (value < 0) {
        value = 0;
      }

      if (value > 10) {
        value = 10;
      }
    }

    this.contact.limit = toJS(value);
  }

  onContact = ({ id, email }) => {
    this.contact.id = id;
    this.contact.email = toJS(email);
  }
}

export default ContactViewStore;
