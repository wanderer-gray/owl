import { makeAutoObservable, transaction } from 'mobx';
import ApiStore from '../api/store';

class AuthStore {
  isAuth = false;
  permissions = [];

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

  init = async() => {
    let data;

    try {
      data = await api('auth/init');
    } catch {
      data = {
        isAuth: false,
        permissions: [],
      };
    }

    transaction(() => {
      this.isAuth = data.isAuth;
      this.permissions = data.permissions;
    });
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
