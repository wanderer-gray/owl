import { Component } from 'react';
import { inject } from 'mobx-react';
import Store from './store';
import View from './view';

class Groups extends Component {
  constructor(props) {
    super(props);

    const { SearchStore } = this.props;

    this.store = new Store({ SearchStore });
  }

  componentDidMount() {
    const { SearchStore } = this.props;

    SearchStore.setView(true);
    SearchStore.setPlaceholder('Введите название группы...');
    SearchStore.setOnValueChange(this.store.searchGroups);
  }

  componentWillUnmount() {
    this.props.SearchStore.clear();
  }

  render() {
    return <View store={this.store} />;
  }
}

export default inject(
  ({ SearchStore }) => { 
    return {
      SearchStore
    };
  }
)(Groups);
