import { makeAutoObservable } from 'mobx';

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
    } catch {
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
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось завершить регистрацию'
      });
    }
  }
}

export default SignUpStore;
