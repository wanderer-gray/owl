import TestStore from './store';
import TestView from './view';

const ViewTest = (props) => {
  const { match } = props;

  const store = new TestStore(match.params.id);

  return <TestView TestStore={store} />;
};

export default ViewTest;
