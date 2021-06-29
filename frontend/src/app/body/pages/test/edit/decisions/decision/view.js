import { makeObservable, observable, computed, action, toJS } from 'mobx';

class DecisionViewStore {
  decision = {};

  get title() {
    return this.decision.title || '';
  }

  get description() {
    return this.decision.description || '';
  }

  get from() {
    return this.decision.from || 0;
  }

  get to() {
    return this.decision.to || this.DecisionsStore.maxPoints;
  }

  constructor({ DecisionsStore }) {
    makeObservable(this, {
      decision: observable,
      title: computed,
      description: computed,
      from: computed,
      to: computed,
      setDecision: action,
      setTitle: action,
      setDescription: action,
      setFrom: action,
      setTo: action,
    });

    this.DecisionsStore = DecisionsStore;
  }

  setDecision = (decision) => {
    this.decision = toJS(decision);
  }

  setTitle = (title) => {
    this.decision.title = toJS(title.substring(0, 255));
  }

  setDescription = (description) => {
    this.decision.description = toJS(description.substring(0, 255));
  }

  setFrom = (from) => {
    this.decision.from = toJS(from);
  }

  setTo = (to) => {
    this.decision.to = toJS(to);
  }
}

export default DecisionViewStore;
