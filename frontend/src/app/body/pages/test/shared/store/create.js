import { makeObservable, observable, action } from 'mobx';
import TestViewStore from './view';
import { statuses } from '../../../../../../enums';
import { types } from '../../../../../../enums/tests';

class TestCreateStore extends TestViewStore {
  status = statuses.none;

  constructor() {
    super();

    makeObservable(this, {
      status: observable,
      setStatus: action,
    });

    this.setTest({
      type: types.TEST,
      title: '',
      description: '',
      availableAll: false,
      questions: [],
    });
  }

  setStatus = (status) => {
    this.status = status;
  }

  onSave = async() => {
    if (!this.checkFieldsAndNotify()) {
      return;
    }

    const body = this.getForSave();
    
    this.setStatus(statuses.loading);

    try {
      const testId = await api('tests/createTest')
        .method('post')
        .body(body);

      notify({
        variant: 'success',
        message: `${types.getTitle(this.type)} добавлен`
      });

      this.setStatus(statuses.uploaded);

      window.location = `/test/edit/${testId}`;
    } catch {
      notify({
        variant: 'error',
        message: `Не удалось добавить ${types.getTitle(this.type).toLowerCase()}`
      });

      this.setStatus(statuses.error);
    }
  }
}

export default TestCreateStore;
