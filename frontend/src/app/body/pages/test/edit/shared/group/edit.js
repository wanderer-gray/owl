import { makeObservable, observable, action, toJS } from 'mobx';
import GroupViewStore from './view';

class GroupEditStore extends GroupViewStore {
  open = false;

  groups = [];

  constructor({ SharedStore }) {
    super({ SharedStore });

    makeObservable(this, {
      open: observable,
      setOpen: action,
    });

    this.onOpen = this.onOpen.bind(this);
  }

  setOpen = (open) => {
    this.open = open;
  }

  onOpen(group) {
    this.setOpen(true);
    this.setGroup(group);

    this.groups = this.SharedStore.groups.filter((g) => g !== group);
  }

  onClose = () => {
    this.setOpen(false);
  }

  onSave = () => {
    const {
      id,
      title,
      begin,
      end,
      limit,
    } = this;

    if (!id) {
      return;
    }

    const groups = toJS(this.groups);

    groups.push({
      id,
      title,
      begin,
      end,
      limit,
    })

    this.SharedStore.setGroups(groups);

    this.onClose();
  }
}

export default GroupEditStore;
