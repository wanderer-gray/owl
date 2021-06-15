import { Component } from 'react';
import { inject } from 'mobx-react';
import Store from './store';
import RoleEditStore from './role/edit';
import RoleCreateStore from './role/create';
import View from './view';

class Roles extends Component {
  constructor(props) {
    super(props);

    const { SearchStore } = this.props;

    const RolesStore = new Store({ SearchStore });

    this.RolesStore = RolesStore;
    this.RoleEditStore = new RoleEditStore({ RolesStore });
    this.RoleCreateStore = new RoleCreateStore({ RolesStore });
  }

  componentDidMount() {
    const { SearchStore } = this.props;

    SearchStore.setView(true);
    SearchStore.setPlaceholder('Введите название роли...');
    SearchStore.setOnValueChange(this.RolesStore.searchRoles);
  }

  componentWillUnmount() {
    this.props.SearchStore.clear();
  }

  render() {
    return (
      <View
        RolesStore={this.RolesStore}
        RoleEditStore={this.RoleEditStore}
        RoleCreateStore={this.RoleCreateStore}
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
)(Roles);
