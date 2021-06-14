import { makeAutoObservable } from 'mobx';

class AsideStore {
  get permissions() {
    return this.AuthStore.permissions;
  }

  constructor({ AuthStore }) {
    makeAutoObservable(this);

    this.AuthStore = AuthStore;
  }
}

export default AsideStore;
