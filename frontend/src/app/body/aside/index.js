import React from 'react';
import { inject } from 'mobx-react';
import Store from './store';
import View from './view';

const Aside = ({ AuthStore }) => {
  const store = new Store({ AuthStore });

  return <View store={store} />;
};

export default inject(({ AuthStore }) => {
  return {
    AuthStore,
  };
})(Aside);
