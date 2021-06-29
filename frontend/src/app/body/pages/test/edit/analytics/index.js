import { makeAutoObservable, transaction } from 'mobx';

class AnalyticsStore {
  open = false;

  info = [];

  countPoints = [];
  rateQuestions = [];

  get testId() {
    return this.TestStore.id;
  }

  get questions() {
    return this.info || [];
  }

  get dataPoints() {
    return this.countPoints;
  }

  get dataQuestions() {
    return this.rateQuestions.map(({ id, options }) => {
      const question = this.questions.find((question) => question.id === id) || {};

      return {
        id,
        title: question.title || '',
        options: options.map(({ id, count }) => {
          const option = (question.options || []).find((option) => option.id === id) || {};
          
          return {
            id,
            count,
            title: option.title || '',
          };
        }),
      };
    });
  }

  constructor({ TestStore }) {
    makeAutoObservable(this);

    this.TestStore = TestStore;
  }

  setOpen = (open) => {
    this.open = open;
  }

  setInfo = (info) => {
    this.info = info;
  }

  setResult = ({ countPoints, rateQuestions }) => {
    transaction(() => {
      this.countPoints = countPoints;
      this.rateQuestions = rateQuestions;
    });
  }

  getInfo = async() => {
    const { testId } = this;

    try {
      const info = await api('analytics/getInfo')
        .query({ id: testId });
      
      this.setInfo(info);

      this.getAnalytics();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить информацию о тесте'
      });
    }
  }

  getAnalytics = async() => {
    const { testId } = this;

    try {
      const result = await api('analytics/getAnalytics')
        .query({ id: testId });
      
      this.setResult(result);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить аналитику теста'
      });
    }
  }

  onOpen = () => {
    this.setOpen(true);
    this.getInfo();
  }

  onClose = () => {
    this.setOpen(false);
  }
}

export default AnalyticsStore;
