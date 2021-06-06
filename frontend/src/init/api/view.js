import { Component } from 'react';
import ApiStore from './store';

const getApi = (url) => {
  return new ApiStore(url);
}

class ApiView extends Component {
  constructor(props) {
    super(props);

    window.api = getApi;
  }

  render() {
    const { children } = this.props;

    return children;
  }
}

export default ApiView;