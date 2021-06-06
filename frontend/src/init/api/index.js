import ApiView from './view';

const Api = ({ children }) => {

  return (
    <ApiView>
      {children}
    </ApiView>
  );
};

export default Api;
