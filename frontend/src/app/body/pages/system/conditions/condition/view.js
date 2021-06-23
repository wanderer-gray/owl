import { makeObservable, observable, computed, action, toJS } from 'mobx';
import { types, actions } from '../../../../../../enums/emailConditions';

class ConditionViewStore {
  data = {};

  get id() {
    return this.data.id || null;
  }

  get type() {
    return this.data.type || types.WHITE;
  }

  get action() {
    return this.ConditionsStore.action || actions.LOGIN;
  }

  get condition() {
    return this.data.condition || '';
  }

  constructor({ ConditionsStore, data = {} }) {
    this.ConditionsStore = ConditionsStore;
    this.data = toJS(data);

    makeObservable(this, {
      data: observable,
      type: computed,
      condition: computed,
      setData: action,
      setType: action,
      setCondition: action,
    });
  }

  setData = (data) => {
    this.data = toJS(data);
  }

  setType = () => {
    this.data.type = toJS(types.getNext(this.type));
  }

  setCondition = (condition) => {
    this.data.condition = toJS(condition);
  }
}

export default ConditionViewStore;
