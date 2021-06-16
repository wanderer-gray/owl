import Store from './store';
import View from './view';

const System = () => {
  const store = new Store();

  return <View store={store} />;
};

export default System;
