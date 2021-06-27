import { makeAutoObservable } from 'mobx';
import { httpErrors } from '../../../enums';

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
    } catch (error) {
      const { status } = error || {};

      if (status === httpErrors.LOCKED) {
        notify({
          variant: 'warning',
          message: 'Адрес электронной почты не поддерживается'
        });

        return;
      }

      if (status === httpErrors.NOT_FOUND) {
        notify({
          variant: 'warning',
          message: 'Адрес электронной почты не найден'
        });

        return;
      }

      if (status === httpErrors.TOO_MANY_REQUESTS) {
        notify({
          variant: 'warning',
          message: 'Превышен лимит на отправку запросов'
        });

        return;
      }

      notify({
        variant: 'error',
        message: 'Не удалось войти в систему'
      });
    }
  }
}

export default LogInStore;
