import TestCreateStore from '../shared/store/create';
import QuestionEditStore from '../shared/store/question/edit';
import View from '../shared/view/create';

const CreateTest = () => {
  const testCreateStore = new TestCreateStore();
  const questionEditStore = new QuestionEditStore({ TestStore: testCreateStore });

  return (
    <View
      TestStore={testCreateStore}
      QuestionEditStore={questionEditStore}
    />
  );
};

export default CreateTest;
