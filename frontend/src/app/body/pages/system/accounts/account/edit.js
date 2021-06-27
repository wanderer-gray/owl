import { makeObservable, observable, action } from 'mobx';
import AccountViewStore from './view';
import { httpErrors } from '../../../../../../enums';

class AccountEditStore extends AccountViewStore {
  open = false;

  constructor({ AccountsStore }) {
    super({ AccountsStore });

    makeObservable(this, {
      open: observable,
      setOpen: action,
    });

    this.onOpen = this.onOpen.bind(this);
  }

  setOpen = (open) => {
    this.open = open;
  }

  onOpen(account) {
    this.setOpen(true);
    this.setAccount(account);
  }

  onClose = () => {
    this.setOpen(false);
  }

  onSave = async() => {
    const {
      id,
      host,
      port,
      secure,
      user,
      pass,
    } = this;

    try {
      await api('system/updateEmailAccount')
        .method('put')
        .query({ id })
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
        message: 'Аккаунт изменён'
      });
    } catch (error) {
      const { status } = error || {};

      if (status === httpErrors.NOT_FOUND) {
        this.refresh();

        notify({
          variant: 'warning',
          message: 'Аккаунт не найден'
        });

        return;
      }

      notify({
        variant: 'error',
        message: 'Не удалось изменить аккаунт'
      });
    }
  }

  refresh = () => {
    this.AccountsStore.refresh();
    this.onClose();
  }
}

export default AccountEditStore;
