import { makeAutoObservable } from 'mobx';

class RestoreStore {
  step = 1;
  email = '';
  code = '';
  password = '';

  constructor(AuthStore) {
    makeAutoObservable(this);

    this.AuthStore = AuthStore;
  }

  setStep = (step) => {
    this.step = step;
  }

  setEmail = (email) => {
    this.email = email;
  }

  setCode = (code) => {
    this.code = code;
  }

  setPassword = (password) => {
    this.password = password;
  }

  close = () => {
    this.AuthStore.close();
  }

  sendRestoreCode = async() => {
    const { email } = this;

    try {
      await api('auth/sendRestoreCode')
        .method('post')
        .query({ email });
      
      this.setStep(2);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось отправить код'
      });
    }
  }

  Restore = async() => {
    const {
      email,
      code,
      password
    } = this;

    try {
      await api('auth/restore')
        .method('post')
        .body({
          email,
          code,
          password
        });
      
      this.close();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось восстановить аккаунт'
      });
    }
  }
}

export default RestoreStore;
