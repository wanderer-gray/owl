import { makeAutoObservable } from 'mobx';

class GlobalPermissionsStore {
  globalPermissions = [];

  constructor() {
    makeAutoObservable(this);

    this.getGlobalPermissions();
  }

  setGlobalPermissions = (globalPermissions) => {
    this.globalPermissions = globalPermissions;
  }
  
  getGlobalPermissions = async() => {
    try {
      const globalPermissions = await api('system/getGlobalPermissions');
      
      this.setGlobalPermissions(globalPermissions);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить список глобальных разрешений'
      });
    }
  }

  updateGlobalPermission = async(id, permit) => {
    try {
      await api('system/updateGlobalPermission')
        .method('put')
        .query({ id })
        .body({ permit });

      notify({
        variant: 'success',
        message: 'Глобальное разрешение изменено'
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось изменить глобальное разрешение'
      });
    }

    this.getGlobalPermissions();
  }
}

export default GlobalPermissionsStore;
