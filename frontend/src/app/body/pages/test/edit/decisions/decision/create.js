import DecisionEditStore from './edit';

class DecisionCreateStore extends DecisionEditStore {
  constructor({ DecisionsStore }) {
    super({ DecisionsStore })

    this.onOpen = this.onOpen.bind(this);
  }

  onOpen() {
    super.onOpen({
      title: '',
      description: '',
      from: 0,
      to: 0,
    });
  }

  onSave = () => {
    const {
      title,
      description,
      from,
      to,
    } = this;

    if (!title) {
      notify({
        variant: 'warning',
        message: 'Поле "Название" не должно быть пустым'
      });

      return;
    }

    this.DecisionsStore.addDecision({
      title,
      description,
      from,
      to,
    });

    this.onClose();
  }
}

export default DecisionCreateStore;
