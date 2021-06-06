import AuthStore from './store';
import AuthView from './view';

const Auth = ({ children }) => {
  const authStore = new AuthStore();
  
  return (
    <AuthView AuthStore={authStore}>
      {children}
    </AuthView>
  );
};

export default Auth;
