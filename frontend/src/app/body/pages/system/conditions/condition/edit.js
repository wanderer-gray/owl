import { makeObservable, observable, action } from 'mobx';
import ConditionViewStore from './view';
import { httpErrors } from '../../../../../../enums';

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
  }

  onSave = async() => {
    const {
      id,
      type,
      condition,
    } = this;

    try {
      await api('system/updateEmailCondition')
        .method('put')
        .query({ id })
        .body({
          type,
          condition,
        });
      
      this.refresh();

      notify({
        variant: 'success',
        message: 'Условие изменено'
      });
    } catch (error) {
      const { status } = error || {};

      if (status === httpErrors.NOTFOUND) {
        this.refresh();

        notify({
          variant: 'warning',
          message: 'Условие не найдено'
        });

        return;
      }

      notify({
        variant: 'error',
        message: 'Не удалось изменить условие'
      });
    }
  }

  refresh = () => {
    this.ConditionsStore.refresh();
    this.onClose();
  }
}

export default ConditionEditStore;
