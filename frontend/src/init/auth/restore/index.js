import RestoreStore from './store';
import RestoreView from './view';

const Restore = ({ AuthStore }) => {
  const restoreStore = new RestoreStore(AuthStore);

  return <RestoreView RestoreStore={restoreStore} />;
};

export default Restore;
