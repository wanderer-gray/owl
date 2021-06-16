import { makeAutoObservable } from 'mobx';

class ConditionsStore {
  conditions = [];

  constructor() {
    makeAutoObservable(this);

    this.getConditions();
  }

  setConditions = (conditions) => {
    this.conditions = conditions;
  }

  getConditions = async() => {
    try {
      const conditions = await api('system/getEmailConditions');
      
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
      
      this.getConditions();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось удалить условие'
      });
    }
  }
}

export default ConditionsStore;
