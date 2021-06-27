import { makeAutoObservable } from 'mobx';
import { httpErrors } from '../../../../enums';

class ContactsStore {
  contacts = [];
  count = 0;
  datetime = 0;

  link = '';

  get email() {
    return this.SearchStore.value;
  }

  constructor({ SearchStore }) {
    makeAutoObservable(this);

    this.SearchStore = SearchStore;

    this.searchContacts();
  }
  
  setResult = ({ contacts, count }, datetime) => {
    if (this.datetime > datetime) {
      return;
    }

    this.contacts = contacts;
    this.count = count;
    this.datetime = datetime;
  }

  setLink = (link) => {
    this.link = link;
  }

  searchContacts = async(email = '', datetime = Date.now()) => {
    try {
      const result = await api('contacts/searchContacts')
        .method('post')
        .query({ email });
      
      this.setResult(result, datetime);
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось выполнить поиск контактов'
      });
    }
  }

  refresh = () => {
    this.searchContacts(this.email);
  }

  createContact = async() => {
    const { link } = this;

    try {
      await api('contacts/createContact')
        .method('post')
        .body({ link });
      
      this.refresh();

      notify({
        variant: 'success',
        message: 'Контакт добавлен'
      });
    } catch (error) {
      const { status } = error || {};

      if (status === httpErrors.NOT_FOUND) {
        notify({
          variant: 'warning',
          message: 'Ссылка пользователя не существует'
        });

        return;
      }

      if (status === httpErrors.CONFLICT) {
        this.refresh();

        notify({
          variant: 'warning',
          message: 'Контакт существует'
        });

        return;
      }

      notify({
        variant: 'error',
        message: 'Не удалось добавить контакт'
      });
    }
  }

  deleteContact = async(id) => {
    try {
      await api('contacts/deleteContact')
        .method('delete')
        .query({ id });

      notify({
        variant: 'success',
        message: 'Контакт удалён'
      });
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось удалить контакт'
      });
    }
      
    this.refresh();
  }
}

export default ContactsStore;
