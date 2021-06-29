import { makeAutoObservable, toJS } from 'mobx';

class DecisionsStore {
  open = false;
  decisions = [];

  get testId() {
    return this.TestStore.id;
  }

  get maxPoints() {
    return this.TestStore.questions.reduce((result, { points }) => result + points, 0);
  }

  constructor({ TestStore }) {
    makeAutoObservable(this);

    this.TestStore = TestStore;
  }

  setOpen = (open) => {
    this.open = open;
  }

  setDecisions = (decisions) => {
    this.decisions = toJS(decisions);
  }

  addDecision = (decision) => {
    const decisions = toJS(this.decisions);

    decisions.push(decision);

    this.setDecisions(decisions);
  }

  removeDecision = (index) => {
    const decisions = toJS(this.decisions);

    decisions.splice(index, 1);

    this.setDecisions(decisions);
  }
  
  getDecisions = async() => {
    const { testId } = this;

    try {
      const decisions = await api('decisions/getDecisions')
        .query({ testId });
      
      this.setDecisions(decisions);
    } catch {
      notify({
        variant: 'error',
        message: `Не удалось получить решения`
      });
    }
  }

  onOpen = () => {
    this.setOpen(true);
    this.getDecisions();
  }

  onClose = () => {
    this.setOpen(false);
  }

  onSave = async() => {
    const {
      testId,
      decisions,
    } = this;

    try {
      await api('decisions/setDecisions')
        .method('put')
        .query({ testId })
        .body({ decisions });

      notify({
        variant: 'success',
        message: 'Данных сохранены'
      });

      this.onClose();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось сохранить данные'
      });
    }
  }
}

export default DecisionsStore;
