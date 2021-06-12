import { Provider } from 'mobx-react';
import AuthStore from './store';
import AuthView from './view';


const Auth = ({ children }) => {
  const authStore = new AuthStore();

  
  return (
    <Provider AuthStore={authStore}>
      <AuthView>
        {children}
      </AuthView>
    </Provider>
  );
};

export default Auth;
