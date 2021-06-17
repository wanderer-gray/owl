import { Component } from 'react';
import { inject } from 'mobx-react';
import Store from './store';
import GroupEditStore from './group/edit';
import GroupCreateStore from './group/create';
import View from './view';

class Groups extends Component {
  constructor(props) {
    super(props);

    const { SearchStore } = this.props;

    const GroupsStore = new Store({ SearchStore });

    this.GroupsStore = GroupsStore;
    this.GroupEditStore = new GroupEditStore({ GroupsStore });
    this.GroupCreateStore = new GroupCreateStore({ GroupsStore });
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
        GroupsStore={this.GroupsStore}
        GroupEditStore={this.GroupEditStore}
        GroupCreateStore={this.GroupCreateStore}
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
)(Groups);
