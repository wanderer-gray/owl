import { Component } from 'react';
import { inject } from 'mobx-react';
import Store from './store';
import UserEditStore from './user/edit';
import UserCreateStore from './user/create';
import View from './view';

class Users extends Component {
  constructor(props) {
    super(props);

    const {
      AuthStore,
      SearchStore
    } = this.props;

    const UsersStore = new Store({ SearchStore });

    this.UsersStore = UsersStore;
    this.UserEditStore = new UserEditStore({ UsersStore, AuthStore });
    this.UserCreateStore = new UserCreateStore({ UsersStore, AuthStore });
  }

  componentDidMount() {
    const { SearchStore } = this.props;

    SearchStore.setView(true);
    SearchStore.setPlaceholder('Введите email пользователя...');
    SearchStore.setOnValueChange(this.UsersStore.searchUsers);
  }

  componentWillUnmount() {
    this.props.SearchStore.clear();

    this.UserEditStore.dispose();
    this.UserCreateStore.dispose();
  }

  render() {
    return (
      <View
        AuthStore={this.props.AuthStore}
        UsersStore={this.UsersStore}
        UserEditStore={this.UserEditStore}
        UserCreateStore={this.UserCreateStore}
      />
    );
  }
}

export default inject(
  ({ AuthStore, SearchStore }) => { 
    return {
      AuthStore,
      SearchStore
    };
  }
)(Users);
