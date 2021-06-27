import { makeObservable, observable, action } from 'mobx';
import TestViewStore from './view';
import { statuses } from '../../../../../../enums';
import { types } from '../../../../../../enums/tests';

class TestEditStore extends TestViewStore {
  status = statuses.loading;

  constructor(id) {
    super();

    makeObservable(this, {
      status: observable,
      setStatus: action,
    });

    this.getTest(id);
  }

  setStatus = (status) => {
    this.status = status;
  }

  getTest = async(id) => {
    try {
      const test = await api('tests/getTest')
        .query({ id });

      notify({
        variant: 'success',
        message: 'Тест получен'
      });

      this.setTest(test);
      this.setStatus(statuses.uploaded);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить тест'
      });

      this.setStatus(statuses.error);
    }
  }

  onSave = async() => {
    if (!this.checkFieldsAndNotify()) {
      return;
    }

    const {
      id,
      type,
    } = this;
    const body = this.getForSave();

    try {
      await api('tests/updateTest')
        .method('put')
        .query({ id })
        .body(body);

      notify({
        variant: 'success',
        message: `${types.getTitle(type)} изменён`
      });

      this.getTest(id);
    } catch {
      notify({
        variant: 'error',
        message: `Не удалось изменить ${types.getTitle(type).toLowerCase()}`
      });
    }
  }

  deleteTest = async() => {
    const {
      id,
      type,
    } = this;

    try {
      await api('tests/deleteTest')
        .method('delete')
        .query({ id });

      notify({
        variant: 'success',
        message: `${types.getTitle(type)} удалён`
      });

      window.location = '/';
    } catch {
      notify({
        variant: 'error',
        message: `Не удалось удалить ${types.getTitle(type).toLowerCase()}`
      });
    }
  }
}

export default TestEditStore;
