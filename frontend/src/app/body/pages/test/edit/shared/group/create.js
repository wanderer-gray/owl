import GroupEditStore from './edit';

class GroupCreateStore extends GroupEditStore {
  constructor({ SharedStore }) {
    super({ SharedStore });

    this.onOpen = this.onOpen.bind(this);
  }

  onOpen() {
    super.onOpen({});
  }
}

export default GroupCreateStore;
