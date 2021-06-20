import { makeObservable, observable, computed, action, toJS } from 'mobx';
import LinksStore from './links';
import QuestionsStore from './questions';
import TestViewStore from './view';

class TestEditStore extends TestViewStore {
  constructor() {
    super();

    this.LinksStore = new LinksStore({ TestStore: this });
    this.QuestionsStore = new QuestionsStore({ TestStore: this });
  }
}

export default TestEditStore;
