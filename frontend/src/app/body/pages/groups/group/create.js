import GroupEditStore from './edit';

const defaultGroup = {
  title: '',
  contacts: [],
};

class GroupCreateStore extends GroupEditStore {
  constructor({ GroupsStore }) {
    super({ GroupsStore });

    this.onOpen = this.onOpen.bind(this);
  }

  onOpen() {
    super.onOpen(defaultGroup);
  }

  onSave = async() => {
    const {
      title,
      contactIds,
    } = this;

    try {
      await api('groups/createGroup')
        .method('post')
        .body({ 
          title,
          contactIds,
        });
      
      this.refresh();
      this.onClose();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось добавить группу'
      });
    }
  }
}

export default GroupCreateStore;
