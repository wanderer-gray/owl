import { makeAutoObservable } from 'mobx';

class NotifyStore {
  notifications = [];

  constructor() {
    makeAutoObservable(this);

    window.notify = this.push;
  }

  push = (note) => {
    this.notifications.push(note);
  };

  clear = () => {
    this.notifications = [];
  }
}

export default NotifyStore;
