import { makeAutoObservable, toJS, autorun } from 'mobx';
import { tests } from '../../../../../../../../enums';

const defaultOption = {
  checked: false,
  title: 'Пункт'
};

class QuestionStore {
  open = false;
  question = {};

  get index() {
    return this.QuestionsStore.questions.findIndex((value) => value === this.question);
  }

  get title() {
    return this.question.title || '';
  }

  get description() {
    return this.question.description || '';
  }

  get type() {
    return this.question.type || tests.types.RADIO_BUTS;
  }

  get points() {
    return this.question.points || 0;
  }

  get options() {
    return this.question.options || [];
  }

  constructor({ QuestionsStore }) {
    makeAutoObservable(this);

    this.QuestionsStore = QuestionsStore;

    this.disposer = autorun(() => {
      if (this.index < 0) {
        this.onClose();
      }
    });
  }

  setOpen = (open) => {
    this.open = open;
  }

  setQuestion = (question) => {
    this.question = question;
  }

  setTitle = (title) => {
    this.question.title = toJS(title);
  }

  setDescription = (description) => {
    this.question.description = toJS(description);
  }

  setType = (type) => {
    this.question.type = toJS(type);

    if (this.type === tests.types.RADIO_BUTS) {
      this.question.options.forEach((option) => {
        option.checked = false;
      });
    }
  }

  setPoints = (points) => {
    const value = Number(points);

    if (value && (!Number.isInteger(value) || value < 0 || value > 100)) {
      return;
    }

    this.question.points = value;
  }

  setOptions = (options) => {
    this.question.options = toJS(options);
  }

  addOption = () => {
    let options = toJS(this.options);

    options.push(defaultOption);

    this.setOptions(options);
  }

  removeOption = (index) => {
    let options = toJS(this.options);

    options.splice(index, 1);

    this.setOptions(options);
  }

  setOptionChecked = (index, value) => {
    if (this.type === tests.types.RADIO_BUTS) {
      this.question.options.forEach((option, idx) => {
        option.checked = idx === index ? value : false;
      });

      return;
    }
    this.question.options[index].checked = value;
  }

  setOptionTitle = (index, value) => {
    this.question.options[index].title = value;
  }

  onOpen = (question) => {
    this.setOpen(true);
    this.setQuestion(question);
  }

  onClose = () => {
    this.setOpen(false);
  }

  dispose = () => {
    this.disposer();
  }
}

export default QuestionStore;
