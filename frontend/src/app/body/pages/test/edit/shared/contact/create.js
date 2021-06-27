import ContactEditStore from './edit';

class ContactCreateStore extends ContactEditStore {
  constructor({ SharedStore }) {
    super({ SharedStore });

    this.onOpen = this.onOpen.bind(this);
  }

  onOpen() {
    super.onOpen({});
  }
}

export default ContactCreateStore;
