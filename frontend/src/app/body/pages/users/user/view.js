import { makeObservable, observable, computed, action, toJS } from 'mobx';

class UserViewStore {
  user = {};

  get id() {
    return this.user.id || null;
  }

  get email() {
    return this.user.email || '';
  }

  get password() {
    return this.user.password;
  }
  
  get roles() {
    return this.user.roles || [];
  }

  constructor({ UsersStore, user = {} }) {
    this.UsersStore = UsersStore;
    this.user = toJS(user);

    makeObservable(this, {
      user: observable,
      email: computed,
      password: computed,
      roles: computed,
      setUser: action,
      setEmail: action,
      setPassword: action,
      setRoles: action,
    });
  }

  setUser = (user) => {
    this.user = toJS(user);
  }

  setEmail = (email) => {
    this.user.email = toJS(email);
  }

  setPassword = (password) => {
    this.user.password = toJS(password);
  }

  setRoles = (roles) => {
    this.user.roles = toJS(roles);
  }
}

export default UserViewStore;
