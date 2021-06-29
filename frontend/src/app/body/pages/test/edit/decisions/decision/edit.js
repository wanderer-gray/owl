import { makeObservable, observable, action, toJS } from 'mobx';
import DecisionViewStore from './view';

class DecisionEditStore extends DecisionViewStore {
  open = false;

  index = 0;

  constructor({ DecisionsStore }) {
    super({ DecisionsStore });

    makeObservable(this, {
      open: observable,
      setOpen: action,
    });

    this.onOpen = this.onOpen.bind(this);
  }

  setOpen = (open) => {
    this.open = open;
  }

  onOpen(decision) {
    this.setOpen(true);
    this.setDecision(decision);

    this.index = this.DecisionsStore.decisions.findIndex((d) => d === decision);
  }

  onClose = () => {
    this.setOpen(false);
  }

  onSave = () => {
    const {
      index,
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

    const decisions = toJS(this.DecisionsStore.decisions);

    decisions[index] = {
      title,
      description,
      from,
      to,
    };

    this.DecisionsStore.setDecisions(decisions);

    this.onClose();
  }
}

export default DecisionEditStore;
