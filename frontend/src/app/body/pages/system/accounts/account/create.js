import AccountEditStore from './edit';

const defaultAccount = {
  host: '',
  port: 25,
  secure: false,
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
      account: {
        host,
        port,
        secure,
        user,
        pass,
      },
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
      this.onClose();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось добавить аккаунт'
      });
    }
  }
}

export default AccountCreateStore;
