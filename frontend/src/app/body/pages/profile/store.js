import { makeAutoObservable } from 'mobx';

class ProfileStore {
  profile = null;

  oldPassword = '';
  newPassword = '';

  open = false;
  password = '';

  constructor() {
    makeAutoObservable(this);

    this.getProfile();
  }

  setProfile = (profile) => {
    this.profile = profile;
  }

  setOldPassword = (oldPassword) => {
    this.oldPassword = oldPassword;
  }

  setNewPassword = (newPassword) => {
    this.newPassword = newPassword;
  }

  setOpen = (open) => {
    this.open = open;
  }

  setPassword = (password) => {
    this.password = password;
  }

  onOpen = () => {
    this.setOpen(true);
    this.setPassword('');
  }

  onClose = () => {
    this.setOpen(false);
    this.setPassword('');
  }

  getProfile = async() => {
    let profile = null;
    
    try {
      profile = await api('accounts/getProfile');
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить профиль'
      });
    }

    this.setOldPassword('');
    this.setNewPassword('');

    this.setProfile(profile);
  }

  updateLink = async() => {
    try {
      await api('accounts/updateLink')
        .method('put');

      notify({
        variant: 'success',
        message: 'Ссылка обновлена'
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось обновить ссылку'
      });
    }

    this.getProfile();
  }

  updatePassword = async() => {
    const {
      oldPassword,
      newPassword,
    } = this;

    try {
      await api('accounts/updatePassword')
        .method('put')
        .body({
          oldPassword,
          newPassword
        });

      notify({
        variant: 'success',
        message: 'Пароль обновлён'
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось обновить пароль'
      });
    }

    this.getProfile();
  }

  deleteAccount = async() => {
    const { password } = this;

    try {
      await api('accounts/deleteAccount')
        .method('delete')
        .body({ password });
      
      window.location = '/';
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось удалить аккаунт'
      });
    }

    this.getProfile();
  }
}

export default ProfileStore;
