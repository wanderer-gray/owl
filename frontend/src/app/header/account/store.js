import { makeAutoObservable } from 'mobx';

class AccountStore {
  anchorEl = null;

  get isAuth() {
    return this.AuthStore.isAuth;
  }

  constructor({ AuthStore, BodyStore }) {
    this.AuthStore = AuthStore;
    this.BodyStore = BodyStore;

    makeAutoObservable(this);
  }

  onOpen = (event) => {
    this.anchorEl = event.currentTarget;
  }

  onClose = () => {
    this.anchorEl = null;
  }

  onProfile = () => {
    const { onProfile } = this.BodyStore || {};

    onProfile && onProfile();
  }

  onLogIn = () => {
    this.AuthStore.onLogIn();
  }

  onLogOut = () => {
    this.AuthStore.onLogOut();
  }
}

export default AccountStore;
