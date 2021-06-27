import { makeObservable, observable, computed, action, toJS } from 'mobx';
import { types } from '../../../../../../../enums/questions';
import OptionViewStore from './option/view';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class QuestionViewStore {
  question = {};

  get id() {
    return this.question.id || null;
  }

  get title() {
    return this.question.title || '';
  }

  get description() {
    return this.question.description || '';
  }

  get type() {
    return this.question.type || types.RADIO_BUTS;
  }

  get points() {
    return this.question.points || 0;
  }

  get options() {
    return (this.question.options || []).map(
      (option) => new OptionViewStore({ QuestionStore: this, option })
    );
  }

  constructor({ TestStore }) {
    this.TestStore = TestStore;

    makeObservable(this, {
      question: observable,
      title: computed,
      description: computed,
      type: computed,
      points: computed,
      options: computed,
      setQuestion: action,
      setTitle: action,
      setDescription: action,
      setType: action,
      setPoints: action,
      setOptions: action,
    });
  }

  setQuestion = (question) => {
    this.question = question;
  }

  setTitle = (title) => {
    this.question.title = toJS(title.substring(0, 255));
  }

  setDescription = (description) => {
    this.question.description = toJS(description.substring(0, 255));
  }

  setType = (type) => {
    this.question.type = toJS(type);
  }

  setPoints = (points) => {
    let value = Number(points);

    if (value) {
      if (!Number.isInteger(value)) {
        return;
      }

      if (value < 0) {
        value = 0;
      }

      if (value > 100) {
        value = 100;
      }
    }

    this.question.points = toJS(value);
  }

  setOptions = (options) => {
    this.question.options = options;
  }

  onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const options = reorder(
      this.question.options,
      result.source.index,
      result.destination.index
    );

    this.setOptions(options);
  }

  addOption = () => {
    const options = this.question.options;

    options.push({
      checked: false,
      title: '',
    });

    this.setOptions(options);
  }

  removeOption = (index) => {
    const options = this.options;

    options.splice(index, 1);

    this.setOptions(options);
  }
}

export default QuestionViewStore;
