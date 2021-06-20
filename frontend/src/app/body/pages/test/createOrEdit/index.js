import Store from './store/edit';
import View from './view';

const CreateTest = () => {
  const store = new Store();

  return <View store={store} />;
};

export default CreateTest;
