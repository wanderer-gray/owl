import { makeAutoObservable } from 'mobx';

class LogInStore {
  email = '';
  password = '';

  constructor(AuthStore) {
    makeAutoObservable(this);

    this.AuthStore = AuthStore;
  }

  setEmail = (email) => {
    this.email = email;
  }

  setPassword = (password) => {
    this.password = password;
  }

  close = () => {
    this.AuthStore.close();
  }

  LogIn = async() => {
    const {
      email,
      password
    } = this;

    try {
      await api('auth/login')
        .method('post')
        .body({
          email,
          password
        });
      
      this.close();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось войти в систему'
      });
    }
  }
}

export default LogInStore;
