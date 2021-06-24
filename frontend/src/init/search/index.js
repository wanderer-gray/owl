import { makeAutoObservable } from 'mobx';

const debounce = (callback, ms) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(callback, ms, ...args);
  };
};

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

    this.setValue(value);
    this.onValueChange(value, datetime);
  }

  setOnValueChange = (onValueChange, ms = 300) => {
    this.onValueChange = debounce(onValueChange, ms);
  }

  clear = () => {
    this.setView(false);
    this.setPlaceholder('');
    this.setValue('');
    this.setOnValueChange(null);
  }
}

export default SearchStore;
