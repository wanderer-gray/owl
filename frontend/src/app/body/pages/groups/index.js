import { Component } from 'react';
import { inject } from 'mobx-react';
import Store from './store';
import GroupEditStore from './group/edit';
import GroupCreateStore from './group/create';
import View from './view';

class Groups extends Component {
  constructor(props) {
    super(props);

    const {
      AuthStore,
      SearchStore
    } = this.props;

    const GroupsStore = new Store({ SearchStore });

    this.GroupsStore = GroupsStore;
    this.GroupEditStore = new GroupEditStore({ GroupsStore, AuthStore });
    this.GroupCreateStore = new GroupCreateStore({ GroupsStore, AuthStore });
  }

  componentDidMount() {
    const { SearchStore } = this.props;

    SearchStore.setView(true);
    SearchStore.setPlaceholder('Введите название группы...');
    SearchStore.setOnValueChange(this.GroupsStore.searchGroups);
  }

  componentWillUnmount() {
    this.props.SearchStore.clear();

    this.GroupEditStore.dispose();
    this.GroupCreateStore.dispose();
  }

  render() {
    return (
      <View
        AuthStore={this.props.AuthStore}
        GroupsStore={this.GroupsStore}
        GroupEditStore={this.GroupEditStore}
        GroupCreateStore={this.GroupCreateStore}
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
)(Groups);
