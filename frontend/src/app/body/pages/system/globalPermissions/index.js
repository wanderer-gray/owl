import Store from './store';
import View from './view';

const GlobalPermissions = () => {
  const store = new Store();

  return <View store={store} />;
};

export default GlobalPermissions;
