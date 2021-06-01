import { Component } from 'react';

const api = (props) => {
  alert(props);
};

class Api extends Component {
  constructor(props) {
    super(props);

    window.api = api;
  }

  render() {
    const { children } = this.props;

    return children;
  }
}

export default Api;
