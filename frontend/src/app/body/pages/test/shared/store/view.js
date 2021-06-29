import { makeObservable, observable, computed, action, toJS } from 'mobx';
import { types as testTypes } from '../../../../../../enums/tests';
import { types as questionTypes } from '../../../../../../enums/questions';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class TestViewStore {
  test = {};

  get id() {
    return this.test.id || null;
  }

  get type() {
    return this.test.type || testTypes.TEST;
  }

  get title() {
    return this.test.title || '';
  }

  get description() {
    return this.test.description || '';
  }

  get time() {
    const t = this.test.time;

    return t ? new Date(t) : new Date(0, 0, 0, 1);
  }
  
  get availableAll() {
    return this.test.availableAll || false;
  }

  get questions() {
    return this.test.questions || [];
  }

  constructor() {
    makeObservable(this, {
      test: observable,
      type: computed,
      title: computed,
      description: computed,
      availableAll: computed,
      questions: computed,
      setTest: action,
      setType: action,
      setTitle: action,
      setDescription: action,
      setAvailableAll: action,
      setQuestions: action,
    });
  }

  setTest = (test) => {
    this.test = toJS(test);
  }

  setType = (type) => {
    this.test.type = toJS(type);
  }

  setTitle = (title) => {
    this.test.title = toJS(title.substring(0, 255));
  }
  
  setDescription = (description) => {
    this.test.description = toJS(description.substring(0, 255));
  }

  setTime = (time) => {
    this.test.time = new Date(0, 0, 0, time.getHours(), time.getMinutes());
  }

  setAvailableAll = (availableAll) => {
    this.test.availableAll = toJS(availableAll);
  }

  setQuestions = (questions) => {
    this.test.questions = questions;
  }

  onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const questions = reorder(
      this.questions,
      result.source.index,
      result.destination.index
    );

    this.setQuestions(questions);
  }

  addQuestion = () => {
    const questions = this.questions;

    questions.push({
      title: 'Заголовок вопроса',
      description: '',
      type: questionTypes.RADIO_BUTS,
      points: 0,
      options: []
    });

    this.setQuestions(questions);
  }

  removeQuestion = (index) => {
    const questions = this.questions;

    questions.splice(index, 1);

    this.setQuestions(questions);
  }

  checkFieldsAndNotify = () => {
    const title = this.title.trim();

    if (!title) {
      notify({
        variant: 'warning',
        message: 'Поле "Название" не должно быть пустым'
      });

      return false;
    }

    const {
      type,
      questions,
    } = this;

    if (!questions.length) {
      notify({
        variant: 'warning',
        message: 'Список вопросов не должен быть пустым'
      });

      return false;
    }

    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];
      const { options } = question;
      const title = question.title.trim();

      if (!title) {
        notify({
          variant: 'warning',
          message: `Поле "Заголовок" вопроса ${index + 1} не должно быть пустым`
        });
  
        return false;
      }

      if (!options.length) {
        notify({
          variant: 'warning',
          message: `Список вариантов вопроса ${index + 1} не должен быть пустым`
        });
  
        return false;
      }

      const existsChecked = options.some(({ checked }) => checked);

      if (type === testTypes.TEST && !existsChecked) {
        notify({
          variant: 'warning',
          message: `Необходимо указать правильный ответ вопроса ${index + 1}`
        });
  
        return false;
      }

      for (const option of options) {
        const title = option.title.trim();

        if (!title) {
          notify({
            variant: 'warning',
            message: `Поле варианта вопроса ${index + 1} не должно быть пустым`
          });
    
          return false;
        }
      }
    }

    return true;
  }

  getForSave = () => {
    const testData = {};

    testData.type = this.type;
    testData.title = this.title.trim();
    testData.description = this.description.trim() || null;
    testData.time = this.time.getTime();
    testData.availableAll = this.availableAll;

    const questions = this.questions.map((question) => {
      const questionData = {};

      if (question.id) {
        questionData.id = question.id;
      }

      questionData.title = question.title.trim();
      questionData.description = (question.description || '').trim() || null;
      questionData.type = question.type;
      questionData.points = question.points;

      const options = question.options.map((option) => {
        const optionData = {};

        if (option.id) {
          optionData.id = option.id;
        }

        optionData.checked = option.checked;
        optionData.title = option.title.trim();

        return optionData;
      });

      questionData.options = options;

      return questionData;
    });

    testData.questions = questions;

    return testData;
  }
}

export default TestViewStore;
