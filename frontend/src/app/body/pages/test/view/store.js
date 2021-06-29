import { makeAutoObservable, transaction } from 'mobx';
import { types } from '../../../../../enums/questions';

class TestStore {
  testId = 0;

  info = null;
  test = null;
  payload = null;
  question = null;
  result = null;

  get type() {
    return (this.test || {}).type;
  }

  get questions() {
    return (this.test || {}).questions || [];
  }

  get questionIndex() {
    return this.questions.findIndex((q) => q === this.question);
  }

  constructor(testId) {
    this.testId = testId;

    makeAutoObservable(this);

    this.getInfo();
  }

  setInfo = (info) => {
    this.info = info;
  }

  setTest = (test) => {
    test.questions.forEach(({ options }) => {
      options.forEach((option) => {
        option.checked = false;
      });
    });

    this.test = test;
  }

  setPayload = (payload) => {
    this.payload = payload;
  }

  setQuestion = (question) => {
    this.question = question;
  }

  setResult = (result) => {
    this.result = result;
  }

  setOption = (optionId, value) => {
    this.test.questions.forEach(({ type, options }) => {
      options.forEach((option) => {
        if (option.id !== optionId) {
          return;
        }

        option.checked = value;

        if (type !== types.RADIO_BUTS) {
          return;
        }
        
        options.forEach((option) => {
          if (option.id === optionId) {
            return;
          }

          option.checked = false;
        });
      });
    });
  }

  pastQuestion = () => {
    this.setQuestion(this.test.questions[this.questionIndex - 1]); 
  }

  nextQuestion = () => {
    this.setQuestion(this.test.questions[this.questionIndex + 1]); 
  }

  getInfo = async() => {
    const { testId } = this;

    try {
      const info = await api('answers/getInfo')
        .query({ id: testId });
      
      this.setInfo(info);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить информацию о тесте'
      });
    }
  }

  getTest = async() => {
    const { testId } = this;

    try {
      const {
        test,
        payload,
      } = await api('answers/getTest')
        .query({ id: testId });
      
      transaction(() => {
        this.setTest(test);
        this.setPayload(payload);
        this.setQuestion(this.questions[0]);
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить тест'
      });
    }
  }

  setAnswer = async(optionId, value) => {
    try {
      await api('answers/setAnswer')
        .method('put')
        .query(this.payload)
        .body({
          optionId,
          value,
        });
      
      this.setOption(optionId, value);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось изменить значение'
      });
    }
  }

  getResult = async() => {
    try {
      const result = await api('answers/getResult')
        .query(this.payload);
      
      this.setResult(result);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить результат'
      });
    }
  }
}

export default TestStore;
