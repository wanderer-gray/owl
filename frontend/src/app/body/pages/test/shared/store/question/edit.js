import { makeObservable, computed } from 'mobx';
import { types } from '../../../../../../../enums/questions';
import QuestionViewStore from './view';

class QuestionEditStore extends QuestionViewStore {
  get open() {
    return this.index >= 0;
  }

  get index() {
    return this.TestStore.questions.findIndex((q) => q === this.question);
  }

  constructor({ TestStore }) {
    super({ TestStore });

    makeObservable(this, {
      open: computed,
      index: computed,
    });
  }
  
  onOpen = (question) => {
    this.setQuestion(question);
  }

  onClose = () => {
    this.setQuestion({});
  }

  onType = (type) => {
    this.setType(type);

    if (this.type === types.RADIO_BUTS) {
      let exists = false;

      this.options.forEach(({ checked, setChecked }) => {
        if (checked) {
          if (exists) {
            setChecked(false);
          } else {
            exists = true;
          }
        }
      });
    }
  }
}

export default QuestionEditStore;
