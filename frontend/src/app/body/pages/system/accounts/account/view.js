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
      setHost: action,
      setPort: action,
      setSecure: action,
      setUser: action,
      setPass: action,
    });
  }

  setAccount = (account) => {
    this.account = toJS(account);
  }

  setHost = (host) => {
    this.account.host = toJS(host);
  }

  setPort = (port) => {
    const value = Number(port);

    if (value && (!Number.isInteger(value) || value < 0 || value > (2 ** 16 - 1))) {
      return;
    }

    this.account.port = toJS(value);
  }

  setSecure = (secure) => {
    this.account.secure = toJS(secure);
  }

  setUser = (user) => {
    this.account.user = toJS(user);
  }

  setPass = (pass) => {
    this.account.pass = toJS(pass);
  }
}

export default AccountViewStore;
