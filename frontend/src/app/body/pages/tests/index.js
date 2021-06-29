import { Component } from 'react';
import { inject } from 'mobx-react';
import Store from './store';
import View from './view';

class Tests extends Component {
  constructor(props) {
    super(props);

    const { SearchStore } = this.props;

    const TestsStore = new Store({ SearchStore });

    this.TestsStore = TestsStore;
  }

  componentDidMount() {
    const { SearchStore } = this.props;

    SearchStore.setView(true);
    SearchStore.setPlaceholder('Введите название теста...');
    SearchStore.setOnValueChange(this.TestsStore.searchTests);
  }

  componentWillUnmount() {
    this.props.SearchStore.clear();
  }

  render() {
    return (
      <View TestsStore={this.TestsStore} />
    );
  }
}

export default inject(
  ({ SearchStore }) => { 
    return {
      SearchStore
    };
  }
)(Tests);
