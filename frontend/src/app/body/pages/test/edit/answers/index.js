import { makeAutoObservable, transaction } from 'mobx';

class AnswersStore {
  open = false;

  info = null;
  
  users = [];
  count = 0;

  offset = 0;

  limit = 10;

  get testId() {
    return this.TestStore.id;
  }

  getPoints = (answers) => {
    return this.info.reduce((result, { points, options }) => {
      const user = options.reduce((count, { id, checked }) => {
        const exists = answers.has(id);

        if (checked) {
          if (exists) {
            return count + 1;
          }
          
          return count - 1;
        }

        if (exists) {
          return count - 1;
        }

        return count;
      }, 0);
      const all = options.reduce((count, { checked }) => count + checked, 0);

      return result + points * Math.max(user / (all || 1), 0);
    }, 0);
  }

  constructor({ TestStore }) {
    makeAutoObservable(this);

    this.TestStore = TestStore;
  }

  setOpen = (open) => {
    this.open = open;
  }

  setInfo = (info) => {
    this.info = info;
  }

  setUsers = (users) => {
    this.users = users.map((user) => {
      const answers = new Set(user.answers.map(({ optionId }) => optionId));
      const points = this.getPoints(answers);

      return {
        ...user,
        points,
        answers,
      };
    });
  }

  setCount = (count) => {
    this.count = count;
  }

  setOffset = (offset) => {
    this.offset = offset;
  }

  getInfo = async() => {
    const { testId } = this;

    try {
      const info = await api('analytics/getInfo')
        .query({ id: testId });
      
      this.setInfo(info);

      this.refresh();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить информацию о тесте'
      });
    }
  }

  getUsers = async() => {
    const {
      testId,
      offset,
    } = this;

    try {
      const {
        users,
        count,
      } = await api('analytics/getAnswers')
        .query({
          id: testId,
          offset,
        });
      
      transaction(() => {
        this.setUsers(users);
        this.setCount(count);
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось получить информацию о тесте'
      });
    }
  }

  refresh = () => {
    this.getUsers();
  }

  onOpen = () => {
    this.setOpen(true);
    this.getInfo();
  }

  onClose = () => {
    this.setOpen(false);
    
    transaction(() => {
      this.setInfo(null);
      this.setUsers([]);
      this.setCount(0);
    });
  }

  onOffset = (offset) => {
    this.setOffset(offset);

    this.refresh();
  }
}

export default AnswersStore;
