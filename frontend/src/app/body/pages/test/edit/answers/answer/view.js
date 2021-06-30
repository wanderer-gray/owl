import { makeAutoObservable } from 'mobx';

class AnswerViewStore {
  open = false;
  user = {};

  get email() {
    return this.user.email || '';
  }

  get answers() {
    return this.user.answers || new Set();
  }

  get points() {
    return this.user.points || 0;
  }

  get maxPoints() {
    if (!this.AnswersStore.info) {
      return null;
    }

    return this.AnswersStore.info.reduce((result, { points }) => result + points, 0);
  }

  get questions() {
    if (!this.AnswersStore.info) {
      return [];
    }

    const { answers } = this;

    return this.AnswersStore.info.map((question) => {
      const { options } = question;
      
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
      const maxPoints = question.points;

      return {
        ...question,
        points: maxPoints * Math.max(user / (all || 1), 0),
        maxPoints,
        options: options.map((option) => {
          const { id, checked } = option;
          const exists = answers.has(id);

          let color = 'white';

          if (checked) {
            if (exists) {
              color = 'green';
            } else {
              color = 'yellow';
            }
          } else if (exists) {
            color = 'red';
          }

          return {
            ...option,
            color,
          };
        }),
      };
    });
  }

  constructor({ AnswersStore }) {
    this.AnswersStore = AnswersStore;

    makeAutoObservable(this);
  }

  setOpen = (open) => {
    this.open = open;
  }

  setUser = (user) => {
    this.user = user;
  }

  onOpen = (user) => {
    this.setOpen(true);
    this.setUser(user);
  }

  onClose = () => {
    this.setOpen(false);
  }
}

export default AnswerViewStore;
