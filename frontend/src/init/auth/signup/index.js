import SignUpStore from './store';
import SignUpView from './view';

const SignUp = ({ AuthStore }) => {
  const signUpStore = new SignUpStore(AuthStore);

  return <SignUpView SignUpStore={signUpStore} />;
};

export default SignUp;
