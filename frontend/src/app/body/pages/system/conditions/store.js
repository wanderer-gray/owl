import { makeAutoObservable } from 'mobx';

class ConditionsStore {
  action
  conditions = [];

  constructor({ action }) {
    this.action = action;

    makeAutoObservable(this);

    this.getConditions();
  }

  setConditions = (conditions) => {
    this.conditions = conditions;
  }

  getConditions = async() => {
    const { action } = this;

    try {
      const conditions = await api('system/getEmailConditions')
        .query({ action });
      
      this.setConditions(conditions);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить список условий'
      });
    }
  }

  refresh = () => {
    this.getConditions();
  }

  deleteCondition = async(id) => {
    try {
      await api('system/deleteEmailCondition')
        .method('delete')
        .query({ id });

      notify({
        variant: 'success',
        message: 'Условие удалено'
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось удалить условие'
      });
    }
      
    this.getConditions();
  }
}

export default ConditionsStore;
