import ConditionEditStore from './edit';
import { system } from '../../../../../../enums';

const defaultCondition = {
  condition: '',
  type: system.EMAIL_СONDITION_WHITE,
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
      condition,
      type,
    } = this;

    try {
      await api('system/createEmailCondition')
        .method('post')
        .body({ 
          condition,
          type,
        });
      
      this.refresh();
      this.onClose();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось добавить условие'
      });
    }
  }
}

export default ConditionCreateStore;
