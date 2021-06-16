import ConditionsStore from './store';
import ConditionEditStore from './condition/edit';
import ConditionCreateStore from './condition/create';
import View from './view';

const Conditions = () => {
  const conditions = new ConditionsStore();
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
