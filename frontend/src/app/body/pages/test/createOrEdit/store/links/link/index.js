import { makeAutoObservable, toJS } from 'mobx';
import MembersStore from './members';

class LinkStore {
  open = false;
  data = {};

  get id() {
    return this.data.id || null;
  }

  get link() {
    return this.data.link || '';
  }

  get begin() {
    return this.data.begin || null;
  }

  get end() {
    return this.data.end || null;
  }

  get members() {
    return this.data.members || [];
  }

  constructor({ LinksStore }) {
    makeAutoObservable(this);

    this.LinksStore = LinksStore;

    this.MembersStore = new MembersStore({ LinkStore: this });
  }

  setOpen = (open) => {
    this.open = toJS(open);
  }

  setData = (data) => {
    this.data = toJS(data);
  }

  setLink = (link) => {
    this.data.link = toJS(link);
  }

  setBegin = (begin) => {
    this.data.begin = toJS(begin);
  }

  setEnd = (end) => {
    this.data.end = toJS(end);
  }

  setMembers = (members) => {
    this.data.members = toJS(members);
  }

  addMember = (member) => {
    const exists = this.members.some(({ type, memberId }) => type === member.type && memberId === member.memberId);

    if (exists) {
      return;
    }

    const members = toJS(this.members);

    members.push(member);

    this.setMembers(members);
  }

  removeMember = (member) => {
    let members = toJS(this.members);

    members = members.filter(
      ({ type, memberId }) => !(type === member.type && memberId === member.memberId)
    );

    this.setMembers(members);
  }

  onOpen = (data) => {
    this.setOpen(true);
    this.setData(data);
  }

  onClose = () => {
    this.setOpen(false);
  }

  onSave = async() => {
    const {
      id,
      link,
      begin,
      end,
      members,
    } = this;

    try {
      await api('tests/updateLink')
        .method('put')
        .query({ id })
        .body({ 
          link,
          begin,
          end,
          members,
        });
      
      this.refresh();
      this.onClose();
    } catch {
      notify({
        variant: 'error',
        message: 'Не удалось изменить участников'
      });
    }
  }

  refresh = () => {
    this.LinksStore.refresh();
  }

  dispose = () => {
    this.MembersStore.dispose();
  }
}

export default LinkStore;
