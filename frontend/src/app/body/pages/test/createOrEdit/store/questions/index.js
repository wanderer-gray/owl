import { makeAutoObservable, toJS } from 'mobx';
import QuestionStore from './question';
import { tests } from '../../../../../../../enums';

const defaultQuestion = {
  title: 'Название',
  description: null,
  type: tests.types.RADIO_BUTS,
  points: 5,
  required: false,
  options: [{
    checked: true,
    title: 'Опция'
  }]
};

class QuestionsStore {
  questions = [];

  constructor({ TestStore }) {
    makeAutoObservable(this);

    this.QuestionStore = new QuestionStore({ QuestionsStore: this });

    this.TestStore = TestStore;
  }

  setQuestions = (questions) => {
    this.questions = toJS(questions);
  }

  addQuestion = () => {
    this.questions.push(defaultQuestion);
  }

  removeQuestion = (index) => {
    const questions = toJS(this.questions);

    questions.splice(index, 1);

    this.setQuestions(questions);
  }
  
  dispose = () => {
    this.QuestionStore.dispose();
  }
}

export default QuestionsStore;
