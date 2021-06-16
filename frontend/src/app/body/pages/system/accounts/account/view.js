import { makeObservable, observable, computed, action, toJS } from 'mobx';

class AccountViewStore {
  account = {};

  get id() {
    return this.account.id || null;
  }

  get host() {
    return this.account.host || '';
  }

  get port() {
    return this.account.port || 0;
  }

  get secure() {
    return this.account.secure || false;
  }

  get user() {
    return this.account.user || '';
  }

  get pass() {
    return this.account.pass || '';
  }

  constructor({ AccountsStore, account = {} }) {
    this.AccountsStore = AccountsStore;
    this.account = toJS(account);

    makeObservable(this, {
      account: observable,
      host: computed,
      port: computed,
      secure: computed,
      user: computed,
      pass: computed,
      setAccount: action,
      setValue: action,
    });
  }

  setAccount = (account) => {
    this.account = toJS(account);
  }

  setValue = (key, value) => {
    this.account[key] = value;
  }
}

export default AccountViewStore;
