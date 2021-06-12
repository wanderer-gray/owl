import { makeAutoObservable } from 'mobx';

class AccountStore {
  anchorEl = null;

  get isAuth() {
    return (this.AuthStore || {}).isAuth || false;
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
    const { onLogIn } = this.AuthStore || {};

    onLogIn && onLogIn();
  }

  onLogOut = () => {
    const { onLogOut } = this.AuthStore || {};

    onLogOut && onLogOut();
  }
}

export default AccountStore;
