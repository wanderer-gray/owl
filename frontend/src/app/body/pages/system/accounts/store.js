import { makeAutoObservable } from 'mobx';

class AccountsStore {
  accounts = [];

  constructor() {
    makeAutoObservable(this);

    this.getAccounts();
  }

  setAccounts = (accounts) => {
    this.accounts = accounts;
  }

  getAccounts = async() => {
    try {
      const accounts = await api('system/getEmailAccounts');
      
      this.setAccounts(accounts);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить список аккаунтов'
      });
    }
  }

  refresh = () => {
    this.getAccounts();
  }

  deleteAccount = async(id) => {
    try {
      await api('system/deleteEmailAccount')
        .method('delete')
        .query({ id });
      
      this.getAccounts();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось удалить аккаунт'
      });
    }
  }
}

export default AccountsStore;
