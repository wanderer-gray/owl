import LogInStore from './store';
import LogInView from './view';

const LogIn = ({ AuthStore }) => {
  const logInStore = new LogInStore(AuthStore);

  return <LogInView LogInStore={logInStore} />;
};

export default LogIn;
