import { makeObservable, observable, computed, action, toJS } from 'mobx';

class GroupViewStore {
  group = {};

  get id() {
    return this.group.id || null;
  }

  get title() {
    return this.group.title || null;
  }

  get begin() {
    const t = this.group.begin;

    return t ? new Date(t) : null;
  }

  get end() {
    if (this.begin) {
      return this.begin;
    }

    const t = this.group.end;

    return t ? new Date(t) : null;
  }

  get limit() {
    return this.group.limit || 0;
  }

  constructor({ SharedStore }) {
    makeObservable(this, {
      group: observable,
      title: computed,
      begin: computed,
      end: computed,
      limit: computed,
      setGroup: action,
      setBegin: action,
      setEnd: action,
      setLimit: action,
      onGroup: action,
    });

    this.SharedStore = SharedStore;
  }

  setGroup = (group) => {
    this.group = toJS(group);
  }

  setBegin = (begin) => {
    this.group.begin = toJS(begin);
  }

  setEnd = (end) => {
    this.group.end = toJS(end);
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

    this.group.limit = toJS(value);
  }

  onGroup = ({ id, title }) => {
    this.group.id = id;
    this.group.title = toJS(title);
  }
}

export default GroupViewStore;
