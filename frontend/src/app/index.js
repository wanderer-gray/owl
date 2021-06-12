import { inject } from 'mobx-react';
import React from 'react';

const App = ({ AuthStore }) => {
  console.log(AuthStore)
  return (
    <h1>
      Hello, World!
    </h1>
  );
};

export default inject(
  ({ AuthStore }) => {
    return {
      AuthStore
    };
  }
)(App);
