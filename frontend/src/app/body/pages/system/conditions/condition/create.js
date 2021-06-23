import ConditionEditStore from './edit';
import { types } from '../../../../../../enums/emailConditions';

const defaultCondition = {
  type: types.WHITE,
  condition: ''
};

class ConditionCreateStore extends ConditionEditStore {
  constructor({ ConditionsStore }) {
    super({ ConditionsStore });

    this.onOpen = this.onOpen.bind(this);
  }

  onOpen() {
    super.onOpen(defaultCondition);
  }

  onSave = async() => {
    const {
      type,
      action,
      condition,
    } = this;

    try {
      await api('system/createEmailCondition')
        .method('post')
        .body({ 
          type,
          action,
          condition,
        });
      
      this.refresh();

      notify({
        variant: 'success',
        message: 'Условие добавлено'
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось добавить условие'
      });
    }
  }
}

export default ConditionCreateStore;
