import { makeObservable, observable, computed, action, toJS } from 'mobx';
import { types as questionTypes } from '../../../../../../../../enums/questions';

class OptionViewStore {
  option = {};

  get id() {
    return this.option.id || null;
  }

  get checked() {
    return this.option.checked || false;
  }

  get title() {
    return this.option.title || '';
  }

  constructor({ QuestionStore, option = {} }) {
    this.QuestionStore = QuestionStore;

    makeObservable(this, {
      option: observable,
      checked: computed,
      title: computed,
      setOption: action,
      setChecked: action,
      setTitle: action,
    });

    this.setOption(option);
  }

  setOption = (option) => {
    this.option = option;
  }

  setChecked = (checked) => {
    this.option.checked = toJS(checked);
  }

  setTitle = (title) => {
    this.option.title = toJS(title.substring(0, 255));
  }

  onChecked = () => {
    if (this.QuestionStore.type === questionTypes.RADIO_BUTS) {
      this.QuestionStore.options.forEach(({ checked, setChecked }) => {
        if (checked) {
          setChecked(false);
        }
      });
    } 

    this.setChecked(!this.checked);
  }
}

export default OptionViewStore;
