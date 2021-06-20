import Store from './store';
import View from './view';

const Tests = () => {
  const store = new Store();

  return <View Store={store} />;
}

export default Tests;
