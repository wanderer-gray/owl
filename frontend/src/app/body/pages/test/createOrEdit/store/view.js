import { makeObservable, observable, computed, action, toJS } from 'mobx';

class TestViewStore {
  test = {};

  get id() {
    return this.test.id || null;
  }

  get title() {
    return this.test.title || '';
  }

  get description() {
    return this.test.description || '';
  }

  get availableAll() {
    return this.test.availableAll || false;
  }

  constructor() {
    makeObservable(this, {
      test: observable,
      title: computed,
      description: computed,
      availableAll: computed,
      setTitle: action,
      setDescription: action,
      setAvailableAll: action,
    });
  }

  setTitle = (title) => {
    this.test.title = toJS(title);
  }

  setDescription = (description) => {
    this.test.description = toJS(description);
  }

  setAvailableAll = (availableAll) => {
    this.test.availableAll = toJS(availableAll);
  }
}

export default TestViewStore;
