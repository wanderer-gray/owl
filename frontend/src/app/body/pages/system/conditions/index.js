import ConditionsStore from './store';
import ConditionEditStore from './condition/edit';
import ConditionCreateStore from './condition/create';
import View from './view';

const Conditions = (props) => {
  const conditions = new ConditionsStore(props);
  const conditionEdit = new ConditionEditStore({ ConditionsStore: conditions });
  const conditionCreate = new ConditionCreateStore({ ConditionsStore: conditions });

  return (
    <View
      ConditionsStore={conditions}
      ConditionEditStore={conditionEdit}
      ConditionCreateStore={conditionCreate}
    />
  );
};

export default Conditions;
