import Store from './store';
import View from './view';

const Profile = () => {
  const store = new Store();

  return <View store={store} />;
};

export default Profile;
