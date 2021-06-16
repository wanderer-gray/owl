import { makeObservable, observable, computed, action, toJS } from 'mobx';
import { system } from '../../../../../../enums';

class ConditionViewStore {
  data = {};

  get id() {
    return this.data.id || null;
  }

  get condition() {
    return this.data.condition || '';
  }

  get type() {
    return this.data.type || 'white';
  }

  constructor({ ConditionsStore, data = {} }) {
    this.ConditionsStore = ConditionsStore;
    this.data = toJS(data);

    makeObservable(this, {
      data: observable,
      condition: computed,
      type: computed,
      setData: action,
      setCondition: action,
      setType: action,
    });
  }

  setData = (data) => {
    this.data = toJS(data);
  }

  setCondition = (condition) => {
    this.data.condition = toJS(condition);
  }

  setType = () => {
    if (this.type === system.EMAIL_СONDITION_BLACK) {
      this.data.type = system.EMAIL_СONDITION_WHITE;
    } else {
      this.data.type = system.EMAIL_СONDITION_BLACK;
    }
  }
}

export default ConditionViewStore;
