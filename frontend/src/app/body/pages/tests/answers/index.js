import { makeAutoObservable, transaction } from 'mobx';

class AnswersStore {
  open = false;

  test = {};
  offset = 0;

  info = {};
  count = 0;

  get testId() {
    return this.test.id;
  }

  get title() {
    return this.test.title;
  }

  get id() {
    return this.info.id;
  }

  get points() {
    return this.info.points || 0;
  }

  get maxPoints() {
    return this.info.maxPoints || 0;
  }

  get questions() {
    return this.info.questions || [];
  }

  get decisions() {
    return this.info.decisions || [];
  }

  constructor({ TestsStore }) {
    makeAutoObservable(this);

    this.TestsStore = TestsStore;
  }

  setOpen = (open) => {
    this.open = open;
  }

  setTest = (test) => {
    this.test = test;
  }

  setOffset = (offset) => {
    this.offset = offset;
  }

  setInfo = (info) => {
    this.info = info;
  }

  setCount = (count) => {
    this.count = count;
  }

  getAnswers = async() => {
    const {
      testId,
      offset,
    } = this;

    try {
      const {
        info,
        count,
      } = await api('tests/getAnswers')
        .query({
          id: testId,
          offset,
        });
      
      if (!count) {
        this.onClose();
        this.refreshList();

        return;
      }
      
      transaction(() => {
        this.setInfo(info);
        this.setCount(count);
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить информацию о тесте'
      });
    }
  }

  refresh = () => {
    this.getAnswers();
  }

  refreshList = () => {
    this.TestsStore.refresh();
  }

  onOpen = (test) => {
    this.setOpen(true);
    this.setTest(test);

    this.refresh();
  }

  onClose = () => {
    this.setOpen(false);
    this.setOffset(0);
    this.setInfo({});
    this.setCount(0);
  }

  onOffset = (offset) => {
    this.setOffset(offset);
    this.refresh();
  }

  deleteAnswer = async(id) => {
    try {
      await api('answers/deleteAnswers')
        .method('delete')
        .query({ id });

      notify({
        variant: 'success',
        message: 'Ответ удалён'
      });

      this.onOffset(Math.max(this.offset - 1, 0));
    } catch {
      notify({
        variant: 'error',
        message: `Не удалось удалить ответы`
      });
    }
  }
}

export default AnswersStore;
