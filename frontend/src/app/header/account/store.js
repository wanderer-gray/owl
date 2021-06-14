import { makeAutoObservable } from 'mobx';

class AccountStore {
  anchorEl = null;

  get isAuth() {
    return this.AuthStore.isAuth;
  }

  constructor({ AuthStore }) {
    this.AuthStore = AuthStore;

    makeAutoObservable(this);
  }

  onOpen = (event) => {
    this.anchorEl = event.currentTarget;
  }

  onClose = () => {
    this.anchorEl = null;
  }

  onLogIn = () => {
    this.AuthStore.onLogIn();
  }

  onLogOut = () => {
    this.AuthStore.onLogOut();
  }
}

export default AccountStore;
