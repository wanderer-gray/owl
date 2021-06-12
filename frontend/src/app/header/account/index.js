import React from 'react';
import { inject } from 'mobx-react';
import Store from './store';
import View from './view';

const Account = ({ AuthStore, BodyStore }) => {
  const store = new Store({ AuthStore, BodyStore });

  return <View store={store} />;
};

export default inject(({ AuthStore, BodyStore }) => {
  return {
    AuthStore,
    BodyStore,
  };
})(Account);
