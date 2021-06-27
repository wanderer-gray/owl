import { makeAutoObservable } from 'mobx';
import { httpErrors } from '../../../enums';

class SignUpStore {
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

  sendSignUpCode = async() => {
    const {
      email
    } = this;

    try {
      await api('auth/sendSignUpCode')
        .method('post')
        .query({ email });

      this.setStep(2);

      notify({
        variant: 'success',
        message: 'Код подтверждения отправлен на почту'
      });
    } catch (error) {
      const { status } = error || {};

      if (status === httpErrors.LOCKED) {
        notify({
          variant: 'warning',
          message: 'Адрес электронной почты не поддерживается'
        });

        return;
      }

      if (status === httpErrors.CONFLICT) {
        notify({
          variant: 'warning',
          message: 'Адрес электронной почты уже используется'
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

      if (status === httpErrors.SERVICE_UNAVAILABLE) {
        notify({
          variant: 'warning',
          message: 'Сервис временно недоступен'
        });

        return;
      }

      notify({
        variant: 'error',
        message: 'Не удалось отправить код'
      });
    }
  }

  SignUp = async() => {
    const {
      email,
      code,
      password
    } = this;

    try {
      await api('auth/signup')
        .method('post')
        .body({
          email,
          code,
          password
        });
      
      this.close();
    } catch (error) {
      const { status } = error || {};

      if (status === httpErrors.NOT_FOUND) {
        notify({
          variant: 'warning',
          message: 'Код подтверждения не совпадает'
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
        message: 'Не удалось завершить регистрацию'
      });
    }
  }
}

export default SignUpStore;
