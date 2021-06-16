import { Component } from 'react';
import { inject } from 'mobx-react';
import Store from './store';
import UserEditStore from './user/edit';
import UserCreateStore from './user/create';
import View from './view';

class Users extends Component {
  constructor(props) {
    super(props);

    const { SearchStore } = this.props;

    const UsersStore = new Store({ SearchStore });

    this.UsersStore = UsersStore;
    this.UserEditStore = new UserEditStore({ UsersStore });
    this.UserCreateStore = new UserCreateStore({ UsersStore });
  }

  componentDidMount() {
    const { SearchStore } = this.props;

    SearchStore.setView(true);
    SearchStore.setPlaceholder('Введите email пользователя...');
    SearchStore.setOnValueChange(this.UsersStore.searchUsers);
  }

  componentWillUnmount() {
    this.props.SearchStore.clear();
  }

  render() {
    return (
      <View
        UsersStore={this.UsersStore}
        UserEditStore={this.UserEditStore}
        UserCreateStore={this.UserCreateStore}
      />
    );
  }
}

export default inject(
  ({ SearchStore }) => { 
    return {
      SearchStore
    };
  }
)(Users);
