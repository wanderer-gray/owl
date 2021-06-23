import AccountEditStore from './edit';

const defaultAccount = {
  host: '',
  port: 465,
  secure: true,
  user: '',
  pass: '',
};

class AccountCreateStore extends AccountEditStore {
  constructor({ AccountsStore }) {
    super({ AccountsStore });

    this.onOpen = this.onOpen.bind(this);
  }

  onOpen() {
    super.onOpen(defaultAccount);
  }

  onSave = async() => {
    const {
      host,
      port,
      secure,
      user,
      pass,
    } = this;

    try {
      await api('system/createEmailAccount')
        .method('post')
        .body({ 
          host,
          port,
          secure,
          user,
          pass,
        });
      
      this.refresh();

      notify({
        variant: 'success',
        message: 'Аккаунт добавлен'
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось добавить аккаунт'
      });
    }
  }
}

export default AccountCreateStore;
