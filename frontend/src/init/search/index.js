import { makeAutoObservable } from 'mobx';

class SearchStore {
  view = false;
  placeholder = '';
  value = '';
  onValueChange = null;

  constructor() {
    makeAutoObservable(this);
  }

  setView = (view) => {
    this.view = view;
  }

  setPlaceholder = (placeholder) => {
    this.placeholder = placeholder;
  }

  setValue = (value) => {
    this.value = value;
  }

  onChange = (event) => {
    const value = event.target.value;
    const datetime = Date.now();
    const { onValueChange } = this;

    this.setValue(value);
    onValueChange && onValueChange(value, datetime);
  }

  setOnValueChange = (onValueChange) => {
    this.onValueChange = onValueChange;
  }

  clear = () => {
    this.setView(false);
    this.setPlaceholder('');
    this.setValue('');
    this.setOnValueChange(null);
  }
}

export default SearchStore;
