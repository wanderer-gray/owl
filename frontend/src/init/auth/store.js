import { makeAutoObservable } from 'mobx';
import ApiStore from '../api/store';

class AuthStore {
  isAuth = false;
  permissions = [];
  globalPermissions = [];

  open = false;
  type = 'login';

  constructor() {
    makeAutoObservable(this);

    ApiStore.errorHandler = this.apiErrorHandler;

    this.init();
  }

  apiErrorHandler = (error) => {
    if (!error || !error.status || error.status !== 401) {
      return;
    }

    this.onLogIn();
  }

  init = () => {
    this.checkIsAuth();
    this.getPermissions();
    this.getGlobalPermissions();
  }

  checkIsAuth = async() => {
    try {
      this.isAuth = await api('auth/isAuth');
    } catch {
      this.isAuth = false;
    }
  }

  getPermissions = async() => {
    try {
      this.permissions = await api('auth/getPermissions');
    } catch {
      this.permissions = [];
    }
  }

  getGlobalPermissions = async() => {
    try {
      this.globalPermissions = await api('auth/getGlobalPermissions');
    } catch {
      this.globalPermissions = [];
    }
  }

  setOpen = (open) => {
    this.open = open;
  }

  setType = (type) => {
    this.type = type;
  }

  close = () => {
    this.setOpen(false)

    this.init();
  }

  onLogIn = () => {
    this.setOpen(true)
    this.setType('login');
  }

  onLogOut = async() => {
    try {
      await api('auth/logout')
        .method('delete');
    } catch {
      // pass
    }
    
    window.location = '/';
  }
}

export default AuthStore;
