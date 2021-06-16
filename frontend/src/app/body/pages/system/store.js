import { makeAutoObservable } from 'mobx';

class SystemStore {
  tabIndex = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setTabIndex = (tabIndex) => {
    this.tabIndex = tabIndex;
  }

  onTabIndexChange = (_, tabIndex) => {
    this.setTabIndex(tabIndex);
  }
}

export default SystemStore;
