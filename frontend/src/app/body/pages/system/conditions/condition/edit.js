import { makeObservable, observable, action } from 'mobx';
import ConditionViewStore from './view';

class ConditionEditStore extends ConditionViewStore {
  open = false;

  constructor({ ConditionsStore }) {
    super({ ConditionsStore });

    makeObservable(this, {
      open: observable,
      setOpen: action,
    });

    this.onOpen = this.onOpen.bind(this);
  }

  setOpen = (open) => {
    this.open = open;
  }

  onOpen(data) {
    this.setOpen(true);
    this.setData(data);
  }

  onClose = () => {
    this.setOpen(false);
    this.setData({});
  }

  onSave = async() => {
    const {
      data: {
        id,
        condition,
        type,
      },
    } = this;

    try {
      await api('system/updateEmailCondition')
        .method('put')
        .query({ id })
        .body({ 
          condition,
          type,
        });
      
      this.refresh();
      this.onClose();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось изменить условие'
      });
    }
  }

  refresh = () => {
    this.ConditionsStore.refresh();
  }
}

export default ConditionEditStore;
