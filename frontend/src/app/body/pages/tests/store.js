import { makeAutoObservable } from 'mobx';

class TestsStore {
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

export default TestsStore;
