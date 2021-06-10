import { makeAutoObservable } from 'mobx';
import ApiStore from '../api/store';

class AuthStore {
  logOut = null;

  open = false;
  type = 'login';

  constructor() {
    makeAutoObservable(this);

    ApiStore.errorHandler = this.apiErrorHandler;
    AuthStore.logOut = this.logOut;
  }

  apiErrorHandler = (error) => {
    if (!error || !error.status || error.status !== 401) {
      return;
    }

    this.setOpen(true)
    this.setType('login');
  }

  setOpen = (open) => {
    this.open = open;
  }

  setType = (type) => {
    this.type = type;
  }

  close = () => {
    this.setOpen(false)
    this.setType('login');
  }

  logOut = async() => {
    try {
      await api()
        .service('auth/logout')
        .method('delete');
    } catch {
      // pass
    }
    
    window.location.reload();
  }
}

export default AuthStore;
