import { makeAutoObservable } from 'mobx';
import { searchTypes } from '../../../../enums/tests';

class TestsStore {
  tabIndex = 0;

  tests = [];
  count = 0;
  datetime = 0;

  get type() {
    switch (this.tabIndex) {
      case 0:
        return searchTypes.ALL;
      
      case 1:
        return searchTypes.MY;
      
      case 2:
        return searchTypes.ASSIGNED;
      
      case 3:
        return searchTypes.COMPLETED;
      
      default:
        return null;
    }
  }

  get title() {
    return this.SearchStore.value;
  }

  offset = 0;

  limit = 10;

  testId = null;

  constructor({ SearchStore }) {
    makeAutoObservable(this);

    this.SearchStore = SearchStore;

    this.searchTests();
  }

  setTabIndex = (tabIndex) => {
    this.tabIndex = tabIndex;
  }

  setOffset = (offset) => {
    this.offset = offset;
  }

  setTestId = (testId) => {
    this.testId = testId;
  }

  setResult = ({ tests, count }, datetime) => {
    if (this.datetime > datetime) {
      return;
    }

    this.tests = tests;
    this.count = count;
    this.datetime = datetime;
  }

  searchTests = async(title = '', datetime = Date.now()) => {
    const {
      type,
      offset,
    } = this;

    try {
      const result = await api('tests/searchTests')
        .method('get')
        .query({
          type,
          title,
          offset,
        });
      
      this.setResult(result, datetime);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось выполнить поиск тестов'
      });
    }
  }

  refresh = () => {
    this.searchTests(this.title);
  }

  onTabIndexChange = (_, tabIndex) => {
    this.setTabIndex(tabIndex);

    this.refresh();
  }

  onOffset = (offset) => {
    this.setOffset(offset);

    this.refresh();
  }
}

export default TestsStore;
