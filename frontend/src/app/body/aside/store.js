import { makeAutoObservable } from 'mobx';

class AsideStore {
  get permissions() {
    return (this.AuthStore || {}).permissions || [];
  }

  constructor({ AuthStore, BodyStore }) {
    this.AuthStore = AuthStore;
    this.BodyStore = BodyStore;

    makeAutoObservable(this);
  }

  onProfile = () => {
    const { onProfile } = this.BodyStore || {};

    onProfile && onProfile();
  }
}

export default AsideStore;
